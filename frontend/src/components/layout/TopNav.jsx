import React from 'react';
import { ShieldCheck, FileCheck2, History, FolderOpen, Sparkles } from 'lucide-react';

export function TopNav({ currentView, onNavigate, activeAuditId }) {
  return (
    <header className="sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--rule)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-md bg-[var(--ink)] flex items-center justify-center text-[var(--paper)] shadow-xs transition-transform group-hover:scale-105">
            <ShieldCheck className="w-5 h-5 text-[var(--paper)]" />
          </div>
          <div>
            <span className="font-display font-bold text-xl tracking-tight text-[var(--ink)]">
              Clause<span className="text-[var(--verified)]">Nova</span>
            </span>
            <span className="block text-[10px] uppercase font-mono tracking-widest text-[var(--slate)]">
              Regulatory Audit Engine
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('workspace')}
            className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 ${
              currentView === 'workspace'
                ? 'bg-[var(--ink)] text-[var(--paper)] font-semibold'
                : 'text-[var(--slate)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>

          {activeAuditId && (
            <>
              <button
                onClick={() => onNavigate('comparison', activeAuditId)}
                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 ${
                  currentView === 'comparison'
                    ? 'bg-[var(--ink)] text-[var(--paper)] font-semibold'
                    : 'text-[var(--slate)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Comparison</span>
              </button>

              <button
                onClick={() => onNavigate('report', activeAuditId)}
                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 ${
                  currentView === 'report'
                    ? 'bg-[var(--ink)] text-[var(--paper)] font-semibold'
                    : 'text-[var(--slate)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Audit Report</span>
              </button>
            </>
          )}

          <button
            onClick={() => onNavigate('history')}
            className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 ${
              currentView === 'history'
                ? 'bg-[var(--ink)] text-[var(--paper)] font-semibold'
                : 'text-[var(--slate)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Past Audits</span>
          </button>
        </nav>

        {/* Auditor Stamp Badge */}
        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[var(--rule)] text-xs font-mono text-[var(--slate)]">
          <span className="w-2 h-2 rounded-full bg-[var(--verified)] animate-pulse"></span>
          <span>ISO / CE / FDA Ready</span>
        </div>
      </div>
    </header>
  );
}

export default TopNav;
