import React from 'react';
import { Calendar, FileCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatDate } from '../../utils/formatDate.js';

export function AuditCard({ audit, onOpenComparison, onOpenReport }) {
  const score = audit.score || 0;
  const isConformant = score >= 80;
  const scoreColor = isConformant ? 'text-[var(--verified)]' : score >= 60 ? 'text-[var(--pending)]' : 'text-[var(--flagged)]';
  const scoreBg = isConformant ? 'bg-[#EBF4EF]' : score >= 60 ? 'bg-[#FAF4E8]' : 'bg-[#FBF0EF]';

  return (
    <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-sm p-6 hover:shadow-sm transition-all flex flex-col justify-between">
      <div>
        
        {/* Top Header with Score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-xs border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)]">
            {audit.standardType || 'ISO 9001:2015'}
          </span>

          <div className={`px-2.5 py-1 rounded-sm font-mono text-sm font-bold flex items-center gap-1 ${scoreBg} ${scoreColor}`}>
            <span>{score}%</span>
          </div>
        </div>

        {/* Audit Title & Product */}
        <h3 className="font-display font-bold text-lg text-[var(--ink)] tracking-tight line-clamp-1">
          {audit.name}
        </h3>
        <p className="text-xs font-sans text-[var(--slate)] mt-1 line-clamp-2">
          {audit.productName}
        </p>

        {/* Stats Row */}
        {audit.counts && (
          <div className="flex items-center gap-3 mt-4 text-[11px] font-mono text-[var(--slate)] border-t border-[var(--rule)] pt-3">
            <span className="text-[var(--verified)]">{audit.counts.matched || 0} matched</span>
            <span>·</span>
            <span className="text-[var(--flagged)]">{audit.counts.missing || 0} missing</span>
            <span>·</span>
            <span className="text-[var(--pending)]">{audit.counts.pending || 0} pending</span>
          </div>
        )}
      </div>

      {/* Footer Actions & Date */}
      <div className="mt-6 pt-4 border-t border-[var(--rule)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] font-mono text-[var(--slate)]">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(audit.createdAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenComparison(audit.id)}
            className="px-3 py-1.5 text-xs font-mono text-[var(--ink)] bg-[var(--paper)] hover:bg-[#EAE6DA] rounded-sm transition-colors"
          >
            Review
          </button>
          <button
            type="button"
            onClick={() => onOpenReport(audit.id)}
            className="px-3 py-1.5 text-xs font-mono text-[var(--paper)] bg-[var(--ink)] hover:opacity-90 rounded-sm transition-opacity flex items-center gap-1"
          >
            <span>Report</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuditCard;
