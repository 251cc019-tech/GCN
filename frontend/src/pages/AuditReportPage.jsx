import React, { useState, useEffect } from 'react';
import { ChevronLeft, RefreshCw, AlertCircle } from 'lucide-react';
import ReportSummary from '../components/report/ReportSummary.jsx';
import RequirementTable from '../components/report/RequirementTable.jsx';
import { auditService } from '../services/auditService.js';

export function AuditReportPage({ auditId, onBackToComparison, onBackToWorkspace }) {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReport() {
      if (!auditId) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await auditService.generateReport(auditId);
        setReport(data);
      } catch (err) {
        setError(err.message || 'Failed to generate audit report.');
      } finally {
        setIsLoading(false);
      }
    }
    loadReport();
  }, [auditId]);

  const handleExportPrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    if (!report) return;
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clausenova-audit-report-${auditId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <RefreshCw className="w-8 h-8 text-[var(--slate)] animate-spin mb-4" />
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">
          Compiling Regulatory Audit Dossier...
        </h2>
        <p className="text-xs font-mono text-[var(--slate)] mt-1">
          Assembling clause verification evidence, notes, and compliance metrics.
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-[var(--surface)] border border-[var(--rule)] rounded-sm text-center">
        <AlertCircle className="w-10 h-10 text-[var(--flagged)] mx-auto mb-3" />
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">
          Audit Report Error
        </h2>
        <p className="text-xs font-mono text-[var(--slate)] mt-2">
          {error || 'Unable to generate report.'}
        </p>
        <button
          type="button"
          onClick={onBackToWorkspace}
          className="mt-6 px-4 py-2 bg-[var(--ink)] text-[var(--paper)] text-xs font-mono uppercase tracking-wider rounded-sm"
        >
          Return to Workspace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Navigation Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToComparison}
          className="text-xs font-mono text-[var(--slate)] hover:text-[var(--ink)] flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Comparison Matrix</span>
        </button>

        <span className="text-xs font-mono text-[var(--slate)]">
          Audit ID: {auditId}
        </span>
      </div>

      {/* Report Summary Card */}
      <ReportSummary
        report={report}
        onExportPrint={handleExportPrint}
        onExportJson={handleExportJson}
      />

      {/* Requirement Matrix Table */}
      <RequirementTable clauses={report.clauses || []} />
    </div>
  );
}

export default AuditReportPage;
