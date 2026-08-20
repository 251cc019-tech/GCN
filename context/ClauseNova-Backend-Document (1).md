# ClauseNova — Backend Document

**Product:** ClauseNova (AI-powered compliance auditing platform)
**Author:** Thread Threaders
**Scope:** Backend architecture, data models, AI comparison pipeline, and API implementation (Node.js/Express, paired with the React frontend)

---

## 1. System Overview

The backend accepts a product document and a regulatory standard, extracts text from both, runs an AI comparison pass to classify each requirement as **matched / missing / pending**, attaches evidence (page + paragraph) for every match, and produces a scored audit report.

```
Client (React)
   │  POST /api/audits (files)
   ▼
API Layer (Express)
   │
   ├── Document Parser  (PDF/DOCX → clean text + page/paragraph map)
   ├── Requirement Extractor  (standard → structured requirement list)
   ├── Comparison Engine  (LLM: requirement × product text → status + evidence)
   └── Report Generator  (scored summary → stored audit record)
   │
   ▼
Database (audits, requirements, evidence)
```

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| API server | Node.js + Express | Matches the React frontend's JS ecosystem, fast to prototype |
| File storage | S3-compatible bucket | Uploaded PDFs/DOCX stored outside the DB |
| Database | PostgreSQL | Relational fit for audits → requirements → evidence |
| Parsing | `pdf-parse`, `mammoth` (DOCX) | Text + structure extraction |
| AI comparison | Anthropic Claude API | Requirement classification + evidence extraction, with citations |
| Job queue | BullMQ (Redis) | Comparison runs are long; process async, poll for status |

---

## 3. Data Models

```
Audit
 ├── id
 ├── name
 ├── status          # "processing" | "complete" | "failed"
 ├── productDocId
 ├── standardDocId
 ├── score            # 0–100, computed on complete
 ├── createdAt

Requirement
 ├── id
 ├── auditId
 ├── clauseId         # e.g. "ISO 9001 §7.1.5"
 ├── text
 ├── status            # "verified" | "flagged" | "pending"
 ├── evidenceId        # nullable

Evidence
 ├── id
 ├── requirementId
 ├── page
 ├── paragraph
 ├── excerpt
 ├── confidence         # 0–1, model's match confidence
```

---

## 4. API Endpoints

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/audits` | Upload product + standard docs, kick off comparison job |
| `GET` | `/api/audits/:id` | Poll audit status + score summary |
| `GET` | `/api/audits/:id/requirements` | List requirements with status + linked evidence |
| `POST` | `/api/audits/:id/report` | Generate exportable PDF/DOCX report |
| `GET` | `/api/audits` | List past audits (history page) |

---

## 5. Implementation

### 5.1 Upload + kick off comparison

```js
// routes/audits.js
import { Router } from "express";
import multer from "multer";
import { queueComparisonJob } from "../jobs/comparisonQueue.js";
import { createAudit } from "../db/audits.js";

const upload = multer({ dest: "tmp/uploads/" });
const router = Router();

router.post(
  "/api/audits",
  upload.fields([{ name: "product" }, { name: "standard" }]),
  async (req, res) => {
    const { product, standard } = req.files;
    if (!product || !standard) {
      return res.status(400).json({ error: "Both documents are required." });
    }

    const audit = await createAudit({
      productFile: product[0],
      standardFile: standard[0],
      status: "processing",
    });

    await queueComparisonJob(audit.id);

    res.status(202).json({ auditId: audit.id, status: audit.status });
  }
);

export default router;
```

### 5.2 Document parsing

```js
// services/documentParser.js
import pdf from "pdf-parse";
import mammoth from "mammoth";
import fs from "fs/promises";

export async function extractText(filePath, mimeType) {
  const buffer = await fs.readFile(filePath);

  if (mimeType === "application/pdf") {
    const { text } = await pdf(buffer);
    return splitIntoPages(text);
  }

  if (mimeType.includes("wordprocessingml")) {
    const { value } = await mammoth.extractRawText({ buffer });
    return splitIntoPages(value);
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
}

function splitIntoPages(rawText) {
  // Returns [{ page: 1, paragraphs: ["...", "..."] }, ...]
  return rawText
    .split(/\f/) // form-feed as page break marker from pdf-parse
    .map((pageText, i) => ({
      page: i + 1,
      paragraphs: pageText.split(/\n{2,}/).filter(Boolean),
    }));
}
```

### 5.3 Comparison engine (AI classification)

```js
// services/comparisonEngine.js
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function classifyRequirement(requirementText, productPages) {
  const productText = productPages
    .map((p) => `[Page ${p.page}]\n${p.paragraphs.join("\n")}`)
    .join("\n\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `You are auditing a product document against one regulatory requirement.

Requirement: "${requirementText}"

Product document (paginated):
${productText}

Return ONLY JSON in this shape, no other text:
{
  "status": "verified" | "flagged" | "pending",
  "page": number | null,
  "paragraph": number | null,
  "excerpt": string | null,
  "confidence": number
}`,
      },
    ],
  });

  const raw = response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("");

  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}
```

### 5.4 Background job — full audit run

```js
// jobs/comparisonQueue.js
import { Queue, Worker } from "bullmq";
import { extractText } from "../services/documentParser.js";
import { extractRequirements } from "../services/requirementExtractor.js";
import { classifyRequirement } from "../services/comparisonEngine.js";
import { saveRequirementResults, markAuditComplete } from "../db/audits.js";

export const comparisonQueue = new Queue("comparison");

export async function queueComparisonJob(auditId) {
  await comparisonQueue.add("run-comparison", { auditId });
}

new Worker("comparison", async (job) => {
  const { auditId } = job.data;

  const [productPages, standardRequirements] = await Promise.all([
    extractText(`tmp/uploads/${auditId}-product`, "application/pdf"),
    extractRequirements(`tmp/uploads/${auditId}-standard`),
  ]);

  const results = [];
  for (const requirement of standardRequirements) {
    const classification = await classifyRequirement(requirement.text, productPages);
    results.push({ ...requirement, ...classification });
  }

  await saveRequirementResults(auditId, results);

  const score = Math.round(
    (results.filter((r) => r.status === "verified").length / results.length) * 100
  );
  await markAuditComplete(auditId, score);
});
```

### 5.5 Status polling endpoint

```js
// routes/auditStatus.js
router.get("/api/audits/:id", async (req, res) => {
  const audit = await getAuditById(req.params.id);
  if (!audit) return res.status(404).json({ error: "Audit not found." });

  res.json({
    id: audit.id,
    status: audit.status,
    score: audit.score,
    counts: audit.status === "complete" ? await getStatusCounts(audit.id) : null,
  });
});
```

---

## 6. AI Pipeline Notes

- Requirements are extracted from the standard **once per audit**, then each is classified independently against the product document — this keeps the model's context focused and makes evidence traceable per requirement.
- `confidence` from the model backs the **"pending"** status: anything below a configurable threshold (e.g. 0.6) is surfaced for human review rather than auto-marked verified or flagged.
- Every "verified" result carries a page/paragraph citation so the frontend's `EvidencePanel` never has to fall back to a generic summary.

---

## 7. Error Handling & Resilience

| Failure | Handling |
|---|---|
| Unsupported file type | Reject at upload with 400 before queueing |
| Parsing failure (corrupt PDF) | Mark audit `failed`, surface reason to client |
| AI call timeout/error | Retry up to 2x with backoff; on final failure, mark that requirement `pending` rather than failing the whole audit |
| Partial job crash | BullMQ persists job state in Redis; resumable on worker restart |

## 8. Security & Compliance Considerations

- Uploaded documents are often confidential — store in a private bucket, generate short-lived signed URLs for any client-side preview
- Auth on all `/api/audits/*` routes scoped to the requesting organization
- Audit records (and underlying files) retained per a configurable retention policy, since these may themselves be subject to compliance requirements
