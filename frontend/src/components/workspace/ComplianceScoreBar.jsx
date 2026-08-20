import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, TrendingUp } from 'lucide-react';

export function ComplianceScoreBar({ matched = 0, missing = 0, pending = 0, standardName = '' }) {
  const total = matched + missing + pending;
  const score = total ? Math.round((matched / total) * 100) : 0;

  const scoreColor = score >= 80 ? 'text-[var(--verified)]' : score >= 60 ? 'text-[var(--pending)]' : 'text-[var(--flagged)]';
  const progressBg = score >= 80 ? 'bg-[var(--verified)]' : score >= 60 ? 'bg-[var(--pending)]' : 'bg-[var(--flagged)]';

  return (
    <div className="border-b border-[var(--rule)] px-6 py-4 bg-[var(--surface)] shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Score & Verdict Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <span className={`font-mono text-3xl font-bold tracking-tight ${scoreColor}`}>
              {score}%
            </span>
            <span className="text-xs uppercase tracking-wider font-mono text-[var(--slate)]">
              compliance score
            </span>
          </div>

          {standardName && (
            <div className="hidden sm:inline-block px-2.5 py-1 text-[11px] font-mono rounded-sm border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)]">
              {standardName}
            </div>
          )}
        </div>

        {/* Breakdown Badges */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#EBF4EF] text-[var(--verified)] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{matched} matched</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#FBF0EF] text-[var(--flagged)] font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{missing} missing</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#FAF4E8] text-[var(--pending)] font-medium">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{pending} pending</span>
          </div>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-[var(--paper)] h-1.5 rounded-full overflow-hidden mt-3 border border-[var(--rule)]">
        <div 
          className={`h-full transition-all duration-500 ease-out ${progressBg}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default ComplianceScoreBar;
