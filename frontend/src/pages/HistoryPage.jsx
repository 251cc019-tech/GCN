import React from 'react';
import { Search, Filter, History, RefreshCw, FolderPlus, Sparkles } from 'lucide-react';
import AuditCard from '../components/history/AuditCard.jsx';
import { useAuditHistory } from '../hooks/useAuditHistory.js';
import { auditService } from '../services/auditService.js';

export function HistoryPage({ onOpenComparison, onOpenReport, onNewAudit }) {
  const {
    audits,
    allAudits,
    isLoading,
    error,
    searchFilter,
    standardFilter,
    setSearchFilter,
    setStandardFilter,
    refetch,
  } = useAuditHistory();

  const handleSeedSamples = async () => {
    try {
      await auditService.seedSampleData();
      refetch();
    } catch (err) {
      console.error('Failed to seed samples:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[var(--slate)] block mb-1">
            Audit Repository
          </span>
          <h1 className="font-display text-3xl font-bold text-[var(--ink)] tracking-tight">
            Past Compliance Audits
          </h1>
          <p className="text-sm font-sans text-[var(--slate)] mt-1">
            Browse and inspect previous compliance assessments and verification trails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSeedSamples}
            className="px-4 py-2 bg-[var(--paper)] text-[var(--ink)] border border-[var(--rule)] rounded-sm text-xs font-mono uppercase tracking-wider font-semibold hover:bg-[#ECE8DC] transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--pending)]" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="button"
            onClick={onNewAudit}
            className="px-4 py-2 bg-[var(--ink)] text-[var(--paper)] rounded-sm text-xs font-mono uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-xs"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Audit</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-sm p-4 mb-8 flex flex-col sm:flex-row items-center gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[var(--slate)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audits by title, product, or standard..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-[var(--paper)] border border-[var(--rule)] rounded-sm focus:outline-hidden focus:border-[var(--ink)]"
          />
        </div>

        {/* Standard Selector Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[var(--slate)] shrink-0" />
          <select
            value={standardFilter}
            onChange={(e) => setStandardFilter(e.target.value)}
            className="text-xs font-mono bg-[var(--paper)] border border-[var(--rule)] rounded-sm px-3 py-2 text-[var(--ink)] focus:outline-hidden"
          >
            <option value="all">All Standards</option>
            <option value="ISO 9001:2015">ISO 9001:2015</option>
            <option value="CE MDR 2017/745">CE MDR 2017/745</option>
            <option value="FDA 21 CFR 820">FDA 21 CFR 820</option>
          </select>
        </div>
      </div>

      {/* Audit Cards Grid */}
      {isLoading ? (
        <div className="py-16 text-center">
          <RefreshCw className="w-8 h-8 text-[var(--slate)] animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-[var(--slate)]">Loading audit records...</p>
        </div>
      ) : audits.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-sm p-12 text-center">
          <History className="w-10 h-10 text-[var(--slate)] opacity-40 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-lg text-[var(--ink)]">
            No Audits Found
          </h3>
          <p className="text-xs font-mono text-[var(--slate)] mt-1 mb-6">
            Upload your first document set or load sample demo audits to explore.
          </p>
          <button
            type="button"
            onClick={onNewAudit}
            className="px-5 py-2.5 bg-[var(--ink)] text-[var(--paper)] rounded-sm text-xs font-mono uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity"
          >
            Create New Audit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audits.map((audit) => (
            <AuditCard
              key={audit.id}
              audit={audit}
              onOpenComparison={onOpenComparison}
              onOpenReport={onOpenReport}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
