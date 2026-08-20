import React from 'react';
import { ShieldCheck, Calendar, FileText, CheckCircle2, AlertTriangle, Clock, Printer, Download } from 'lucide-react';
import { formatDate } from '../../utils/formatDate.js';

export function ReportSummary({ report, onExportPrint, onExportJson }) {
  if (!report) return null;

  const score = report.complianceScore || 0;
  const isConformant = score >= 80;
  const statusColor = isConformant ? 'text-[var(--verified)]' : score >= 60 ? 'text-[var(--pending)]' : 'text-[var(--flagged)]';
  const sealBg = isConformant ? 'bg-[#EBF4EF] border-[var(--verified)] text-[var(--verified)]' : 'bg-[#FAF4E8] border-[var(--pending)] text-[var(--pending)]';

  return (
    <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-sm p-8 shadow-xs">
      
      {/* Header with Title & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[var(--rule)]">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[var(--slate)] block mb-1">
            Official Compliance Audit Certificate
          </span>
          <h1 className="font-display text-3xl font-bold text-[var(--ink)] tracking-tight">
            {report.auditName || 'Regulatory Audit Evaluation'}
          </h1>
          <p className="text-sm font-sans text-[var(--slate)] mt-1">
            {report.productName} · {report.standardType}
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportPrint}
            className="px-4 py-2 bg-[var(--surface)] text-[var(--ink)] border border-[var(--rule)] rounded-sm text-xs font-mono uppercase tracking-wider hover:bg-[var(--paper)] transition-colors flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            type="button"
            onClick={onExportJson}
            className="px-4 py-2 bg-[var(--ink)] text-[var(--paper)] rounded-sm text-xs font-mono uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Score & Metric Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-b border-[var(--rule)]">
        
        {/* Compliance Gauge */}
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-mono text-2xl font-bold ${sealBg}`}>
            {score}%
          </div>
          <div>
            <span className="text-[11px] uppercase font-mono tracking-wider text-[var(--slate)] block">
              Audit Score
            </span>
            <span className={`font-mono text-sm font-semibold uppercase ${statusColor}`}>
              {report.verdict || 'CONFORMANT'}
            </span>
          </div>
        </div>

        {/* Verified Count */}
        <div className="flex items-center gap-3 border-l border-[var(--rule)] pl-4">
          <CheckCircle2 className="w-8 h-8 text-[var(--verified)]" />
          <div>
            <span className="font-mono text-2xl font-bold text-[var(--ink)]">
              {report.statistics?.verifiedCount || 0}
            </span>
            <span className="text-[11px] uppercase font-mono tracking-wider text-[var(--slate)] block">
              Verified Clauses
            </span>
          </div>
        </div>

        {/* Flagged Count */}
        <div className="flex items-center gap-3 border-l border-[var(--rule)] pl-4">
          <AlertTriangle className="w-8 h-8 text-[var(--flagged)]" />
          <div>
            <span className="font-mono text-2xl font-bold text-[var(--ink)]">
              {report.statistics?.flaggedCount || 0}
            </span>
            <span className="text-[11px] uppercase font-mono tracking-wider text-[var(--slate)] block">
              Non-Conformances
            </span>
          </div>
        </div>

        {/* Generated Timestamp */}
        <div className="flex items-center gap-3 border-l border-[var(--rule)] pl-4">
          <Calendar className="w-8 h-8 text-[var(--slate)]" />
          <div>
            <span className="font-mono text-xs font-semibold text-[var(--ink)] block">
              {formatDate(report.generatedAt)}
            </span>
            <span className="text-[11px] uppercase font-mono tracking-wider text-[var(--slate)] block">
              Audit Date
            </span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="pt-6">
        <span className="text-xs uppercase font-mono tracking-wider text-[var(--slate)] block mb-2 font-semibold">
          Executive Auditor Summary
        </span>
        <p className="text-sm font-sans text-[var(--ink)] leading-relaxed bg-[var(--paper)] p-4 rounded-sm border border-[var(--rule)]">
          {report.executiveSummary}
        </p>
      </div>
    </div>
  );
}

export default ReportSummary;
