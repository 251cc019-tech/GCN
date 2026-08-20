import React, { useState } from 'react';
import { ArrowRight, Sparkles, AlertCircle, RefreshCw, FileText, ChevronLeft } from 'lucide-react';
import ComplianceScoreBar from '../components/workspace/ComplianceScoreBar.jsx';
import RequirementList from '../components/workspace/RequirementList.jsx';
import EvidencePanel from '../components/workspace/EvidencePanel.jsx';
import { useComparisonResult } from '../hooks/useComparisonResult.js';

export function ComparisonPage({ auditId, onOpenReport, onBackToWorkspace }) {
  const {
    audit,
    requirements,
    allRequirements,
    selectedRequirement,
    selectedRequirementId,
    filterStatus,
    searchQuery,
    isLoading,
    error,
    scoreSummary,
    setFilterStatus,
    setSearchQuery,
    handleSelectRequirement,
    handleUpdateNote,
    handleStatusOverride,
    refetch,
  } = useComparisonResult(auditId);

  const [activeTabMobile, setActiveTabMobile] = useState('list'); // 'list' | 'evidence' for mobile view

  if (isLoading && !audit) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <RefreshCw className="w-8 h-8 text-[var(--slate)] animate-spin mb-4" />
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">
          Parsing & Analyzing Regulatory Clauses...
        </h2>
        <p className="text-xs font-mono text-[var(--slate)] mt-1">
          Extracting text structures and matching evidence citations.
        </p>
      </div>
    );
  }

  if (error && !audit) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-[var(--surface)] border border-[var(--rule)] rounded-sm text-center">
        <AlertCircle className="w-10 h-10 text-[var(--flagged)] mx-auto mb-3" />
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">
          Comparison Load Error
        </h2>
        <p className="text-xs font-mono text-[var(--slate)] mt-2">
          {error}
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
    <div className="flex flex-col flex-1 h-[calc(100vh-4rem)]">
      
      {/* Top Header Bar with Compliance Score */}
      <ComplianceScoreBar
        matched={scoreSummary?.matched || 0}
        missing={scoreSummary?.missing || 0}
        pending={scoreSummary?.pending || 0}
        standardName={audit?.standardType}
      />

      {/* Sub-bar with Navigation & Action to View Audit Report */}
      <div className="px-6 py-2 bg-[#FAF9F5] border-b border-[var(--rule)] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToWorkspace}
            className="text-[var(--slate)] hover:text-[var(--ink)] flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>
          <span className="text-[var(--rule)]">|</span>
          <span className="text-[var(--ink)] font-semibold truncate max-w-xs sm:max-w-md">
            {audit?.name || `Audit #${auditId?.slice(-6)}`}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenReport(auditId)}
          className="px-3 py-1 bg-[var(--ink)] text-[var(--paper)] rounded-xs uppercase tracking-wider text-[11px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
        >
          <span>Generate Full Report</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main 2-Column Redline Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        
        {/* Left Column: Scrollable Requirement List (7 cols on desktop) */}
        <div className="md:col-span-7 h-full overflow-hidden flex flex-col">
          <RequirementList
            requirements={requirements}
            selectedRequirementId={selectedRequirementId}
            onSelectRequirement={(id) => {
              handleSelectRequirement(id);
              setActiveTabMobile('evidence');
            }}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Right Column: Sticky Evidence Panel (5 cols on desktop) */}
        <div className="md:col-span-5 h-full overflow-hidden border-t md:border-t-0 border-[var(--rule)]">
          <EvidencePanel
            requirement={selectedRequirement}
            onUpdateNote={handleUpdateNote}
            onStatusOverride={handleStatusOverride}
          />
        </div>
      </div>
    </div>
  );
}

export default ComparisonPage;
