# ClauseNova — Frontend Document

**Product:** ClauseNova (AI-powered compliance auditing platform)
**Author:** Thread Threaders
**Scope:** Frontend architecture, design system, page layouts, and React component structure

---

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
