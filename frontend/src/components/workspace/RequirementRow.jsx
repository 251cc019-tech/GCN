import React from 'react';
import { Check, AlertCircle, HelpCircle, ChevronRight } from 'lucide-react';

export function RequirementRow({ requirement, isActive, onSelect }) {
  const statusConfig = {
    verified: {
      color: 'var(--verified)',
      bgLight: '#EBF4EF',
      badgeText: 'Verified',
      icon: Check
    },
    flagged: {
      color: 'var(--flagged)',
      bgLight: '#FBF0EF',
      badgeText: 'Missing',
      icon: AlertCircle
    },
    pending: {
      color: 'var(--pending)',
      bgLight: '#FAF4E8',
      badgeText: 'Pending',
      icon: HelpCircle
    },
  }[requirement.status] || {
    color: 'var(--slate)',
    bgLight: 'var(--paper)',
    badgeText: 'Under Review',
    icon: HelpCircle
  };

  const IconComponent = statusConfig.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(requirement.id)}
      className={`group w-full text-left px-5 py-4 border-l-4 border-b border-[var(--rule)] transition-all focus:outline-hidden focus:ring-1 focus:ring-[var(--ink)] ${
        isActive 
          ? 'bg-[var(--surface)] shadow-xs relative z-10' 
          : 'bg-[var(--surface)] hover:bg-[#FAFAF8]'
      }`}
      style={{ borderLeftColor: statusConfig.color }}
    >
      <div className="flex items-start justify-between gap-3">
        
        {/* Requirement Main Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-semibold text-[var(--ink)]">
              {requirement.clauseId}
            </span>
            <span className="text-[11px] font-mono text-[var(--slate)] truncate">
              · {requirement.section}
            </span>
          </div>

          <p className="text-sm text-[var(--ink)] leading-relaxed font-sans line-clamp-3">
            {requirement.text}
          </p>

          {/* Citation Preview / Note */}
          {requirement.evidence?.page && (
            <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-[var(--slate)]">
              <span className="inline-block px-1.5 py-0.5 rounded-xs bg-[var(--paper)] border border-[var(--rule)]">
                p.{requirement.evidence.page} ¶{requirement.evidence.paragraph}
              </span>
              {requirement.evidence.confidence && (
                <span>{Math.round(requirement.evidence.confidence * 100)}% match</span>
              )}
            </div>
          )}
        </div>

        {/* Status Tag Badge */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span 
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-mono font-medium"
            style={{ 
              backgroundColor: statusConfig.bgLight,
              color: statusConfig.color
            }}
          >
            <IconComponent className="w-3 h-3" />
            <span>{statusConfig.badgeText}</span>
          </span>

          <ChevronRight className={`w-4 h-4 text-[var(--slate)] transition-transform ${
            isActive ? 'translate-x-1 text-[var(--ink)]' : 'opacity-0 group-hover:opacity-100'
          }`} />
        </div>
      </div>
    </button>
  );
}

export default RequirementRow;
