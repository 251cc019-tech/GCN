# ClauseNova — AI-Powered Compliance Auditing Platform

ClauseNova compares product documentation against regulatory standards (ISO 9001, CE MDR, FDA 21 CFR Part 820), flags matched vs. missing requirements, surfaces exact evidence citations (page and paragraph) behind every finding, and generates exportable audit reports with real-time compliance scoring.

---

## 🏗️ Architecture & Project Structure

The project follows an industry-standard monorepo architecture:

```
project-root/
├── frontend/                     # React + Vite + Tailwind CSS + Lucide Icons
│   ├── public/                   # Static assets & favicons
│   ├── src/
│   │   ├── assets/               # Images, logos, branding
│   │   ├── components/
│   │   │   ├── layout/           # TopNav, Footer
│   │   │   ├── workspace/        # DropZone, ComplianceScoreBar, RequirementList, RequirementRow, EvidencePanel
│   │   │   ├── report/           # ReportSummary, RequirementTable
│   │   │   └── history/          # AuditCard
│   │   ├── hooks/                # Custom React hooks (useComparisonResult, useAuditHistory, useFileUpload)
│   │   ├── services/             # API client services (auditService, api)
│   │   ├── context/              # Global React contexts
│   │   ├── pages/                # LandingPage, WorkspaceUploadPage, ComparisonPage, AuditReportPage, HistoryPage
│   │   ├── utils/                # Pure logic helpers (cn, formatDate)
│   │   ├── styles/               # Design tokens & typography
│   │   ├── App.jsx               # Client router & application shell
│   │   └── main.jsx              # React entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Node.js + Express layered REST API
│   ├── src/
│   │   ├── config/               # Database, Ollama & Environment configs
│   │   ├── routes/               # Clean URL routes mapping (audit.routes.js)
│   │   ├── controllers/          # Request/response handlers (audit.controller.js)
│   │   ├── services/             # Core business logic (parser, extractor, comparisonEngine, report)
│   │   ├── models/               # Data access layer (Audit, Requirement, Evidence)
│   │   ├── middleware/           # Auth, file upload, validation, centralized error handling
│   │   ├── utils/                # Shared utilities & response formatters
│   │   ├── db/
│   │   │   ├── migrations/       # SQL schema definition (001_initial_schema.sql)
│   │   │   └── seeds/            # Sample seed data for development
│   │   └── app.js                # Express app setup & middleware pipeline
│   ├── server.js                 # Server listener entry point
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml            # Multi-container setup (Postgres, Ollama, Backend, Frontend)
└── README.md
```

---

## 🎨 Design Tokens (Redline Legal Review)

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#1B2333` | Primary text, headers, navigation |
| `--paper` | `#F7F5EF` | App background |
| `--surface` | `#FFFFFF` | Cards, panels, modal dialogs |
| `--rule` | `#D8D3C7` | Hairline dividers, borders |
| `--slate` | `#5B6472` | Secondary text, captions, metadata |
| `--verified` | `#2F6E4F` | Matched requirement, verified badge |
| `--flagged` | `#B23A2E` | Missing requirement, flagged badge |
| `--pending` | `#C08A2E` | Under review / partial match |

**Typography**:
- **Display**: `Newsreader` (Serif) — for official document weight and report titles.
- **Body / UI**: `Inter` (Sans-serif) — for crisp readability and controls.
- **Evidence / Data**: `IBM Plex Mono` (Monospace) — for clause IDs, citations, and scores.

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend starts at `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend starts at `http://localhost:5173`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `POST` | `/api/audits` | Upload product & standard documents to start audit |
| `GET` | `/api/audits` | List all historical audits with compliance scores |
| `GET` | `/api/audits/:id` | Poll audit progress, status, and summary statistics |
| `GET` | `/api/audits/:id/requirements` | Retrieve all parsed requirements and evidence citations |
| `POST` | `/api/audits/:id/report` | Generate and export official audit report |
| `PATCH` | `/api/audits/:id/requirements/:reqId` | Update auditor notes or override requirement status |
