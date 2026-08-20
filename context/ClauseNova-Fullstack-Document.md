# ClauseNova — Frontend & Backend Document

**Product:** ClauseNova (AI-powered compliance auditing platform)
**Author:** Thread Threaders
**Scope:** Combined frontend (React) and backend (Node.js/Express) architecture, design system, data models, and implementation

---

# Part 1 — Frontend

## 1. Product Context

ClauseNova compares product documents against regulatory standards (ISO, CE, FDA), flags matched vs. missing requirements, surfaces the exact evidence behind each match, and generates an audit report with a compliance score. The frontend's job is to make a dense, text-heavy compliance review feel scannable, trustworthy, and fast — the auditor should never have to re-read a source document to trust the AI's finding.

Primary users: compliance auditors, QA engineers, regulatory officers.
Core loop: **Upload → Compare → Review flagged clauses → Export audit report.**

---

## 2. Design Tokens

The visual language borrows from redline legal review — margin annotations, clause numbering, and a stamped verification mark — rather than a generic SaaS dashboard look.

### Color

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#1B2333` | Primary text, headers, nav |
| `--paper` | `#F7F5EF` | App background |
| `--surface` | `#FFFFFF` | Cards, panels |
| `--rule` | `#D8D3C7` | Hairline dividers, borders |
| `--slate` | `#5B6472` | Secondary text, captions |
| `--verified` | `#2F6E4F` | Matched requirement, success state |
| `--flagged` | `#B23A2E` | Missing requirement, error state |
| `--pending` | `#C08A2E` | Under review / partial match |

### Type

| Role | Face | Use |
|---|---|---|
| Display | `Newsreader` (serif) | Page titles, report headings — gives the "official document" weight |
| Body / UI | `Inter` | Navigation, buttons, forms, body copy |
| Evidence / Data | `IBM Plex Mono` | Clause references, page/paragraph citations, compliance scores |

### Layout signature

Every requirement row carries a thin **leader line** connecting the requirement text to its evidence citation in the margin — mimicking how an auditor hand-annotates a printed spec. This is the one recurring motif; everything else stays quiet (flat surfaces, no shadows beyond 1px, no gradients).

---

## 3. Information Architecture

```
/                     Landing (value prop, sign in)
/workspace            Upload panel (product doc + standard doc)
/workspace/:id        Comparison view (the core screen)
/workspace/:id/report Generated audit report (exportable)
/history               Past audits
```

---

## 4. Page-by-Page Breakdown

### 4.1 Upload Workspace
- Two drop zones side by side: **Product Document** and **Regulatory Standard**
- Accepts PDF / Word, shows filename + page count once parsed
- "Run Comparison" CTA disabled until both files are present

### 4.2 Comparison View (core screen)
- Left column: scrollable list of requirements, grouped by standard section, each tagged Verified / Flagged / Pending
- Right column (sticky): evidence panel — shows the exact source excerpt with page/paragraph reference when a requirement row is selected
- Top bar: live compliance score, count of matched vs. missing

### 4.3 Audit Report
- Summary header: compliance score, generated date, standard version
- Full requirement table with status, evidence reference, and reviewer notes field
- "Export PDF" / "Export DOCX" actions

---

## 5. Component Architecture

```
<App>
 ├── <TopNav />
 ├── <UploadWorkspace>
 │     ├── <DropZone kind="product" />
 │     └── <DropZone kind="standard" />
 ├── <ComparisonView>
 │     ├── <ComplianceScoreBar />
 │     ├── <RequirementList>
 │     │     └── <RequirementRow />   (repeated)
 │     └── <EvidencePanel />
 └── <AuditReport>
       ├── <ReportSummary />
       └── <RequirementTable />
```

---

## 6. Key Components (React)

### `ComplianceScoreBar`

```jsx
function ComplianceScoreBar({ matched, missing, pending }) {
  const total = matched + missing + pending;
  const score = total ? Math.round((matched / total) * 100) : 0;

  return (
    <div className="flex items-center gap-4 border-b border-[var(--rule)] px-6 py-4 bg-[var(--surface)]">
      <span className="font-mono text-2xl text-[var(--ink)]">{score}%</span>
      <span className="text-sm text-[var(--slate)]">compliant</span>
      <div className="flex gap-3 ml-auto text-xs font-mono">
        <span className="text-[var(--verified)]">{matched} matched</span>
        <span className="text-[var(--flagged)]">{missing} missing</span>
        <span className="text-[var(--pending)]">{pending} pending</span>
      </div>
    </div>
  );
}
```

### `RequirementRow`

```jsx
function RequirementRow({ requirement, isActive, onSelect }) {
  const statusColor = {
    verified: "var(--verified)",
    flagged: "var(--flagged)",
    pending: "var(--pending)",
  }[requirement.status];

  return (
    <button
      onClick={() => onSelect(requirement.id)}
      className={`w-full text-left px-4 py-3 border-l-2 transition-colors ${
        isActive ? "bg-[var(--paper)]" : "bg-transparent"
      }`}
      style={{ borderLeftColor: statusColor }}
    >
      <p className="text-sm text-[var(--ink)]">{requirement.text}</p>
      <p className="text-xs font-mono text-[var(--slate)] mt-1">
        {requirement.clauseId}
      </p>
    </button>
  );
}
```

### `EvidencePanel`

```jsx
function EvidencePanel({ evidence }) {
  if (!evidence) {
    return (
      <div className="p-6 text-sm text-[var(--slate)]">
        Select a requirement to view its supporting evidence.
      </div>
    );
  }

  return (
    <div className="p-6 border-l border-[var(--rule)] bg-[var(--surface)]">
      <p className="text-xs font-mono text-[var(--slate)] mb-2">
        p.{evidence.page} ¶{evidence.paragraph}
      </p>
      <blockquote className="text-sm text-[var(--ink)] leading-relaxed">
        {evidence.excerpt}
      </blockquote>
    </div>
  );
}
```

### `DropZone`

```jsx
function DropZone({ kind, file, onFileSelect }) {
  return (
    <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-[var(--rule)] rounded-sm p-10 cursor-pointer hover:border-[var(--ink)] transition-colors">
      <span className="text-sm text-[var(--slate)] uppercase tracking-wide">
        {kind === "product" ? "Product Document" : "Regulatory Standard"}
      </span>
      {file ? (
        <span className="font-mono text-sm text-[var(--ink)]">{file.name}</span>
      ) : (
        <span className="text-xs text-[var(--slate)]">Drop PDF or Word file, or click to browse</span>
      )}
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => onFileSelect(kind, e.target.files[0])}
      />
    </label>
  );
}
```

---

## 7. State Management

- Local component state (`useState`) for UI interactions (active requirement, drag state)
- A single `useComparisonResult(auditId)` hook fetches parsed requirements + evidence from the backend and exposes `{ requirements, evidence, scoreSummary, status }`
- No global store needed at MVP scale — one comparison is scoped to one workspace session

## 8. API Integration Points

| Action | Endpoint (suggested) |
|---|---|
| Upload documents | `POST /api/audits` |
| Poll comparison status | `GET /api/audits/:id` |
| Fetch requirement + evidence detail | `GET /api/audits/:id/requirements` |
| Generate report export | `POST /api/audits/:id/report` |

## 9. Accessibility & Responsiveness

- All status colors (`verified` / `flagged` / `pending`) are paired with text labels, never color alone
- Requirement list and evidence panel stack vertically below 768px, with evidence shown as an expandable drawer under the selected row
- Full keyboard navigation through requirement rows (arrow keys + Enter to select)
- Visible focus rings on all interactive elements
-e 

---

# Part 2 — Backend

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
