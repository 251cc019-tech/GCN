import React, { useState, useEffect } from 'react';
import { Bookmark, FileSearch, CheckCircle, AlertCircle, HelpCircle, Save, Edit3, Sparkles } from 'lucide-react';

export function EvidencePanel({
  requirement,
  onUpdateNote,
  onStatusOverride
}) {
  const [noteText, setNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    if (requirement) {
      setNoteText(requirement.reviewerNote || '');
    }
  }, [requirement]);

  if (!requirement) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center bg-[var(--surface)]">
        <FileSearch className="w-10 h-10 text-[var(--slate)] opacity-40 mb-3" />
        <p className="font-display font-medium text-[var(--ink)] text-base">
          No Clause Selected
        </p>
        <p className="text-xs text-[var(--slate)] mt-1 max-w-xs font-mono">
          Select any requirement from the redline list to inspect verified source evidence citations.
        </p>
      </div>
    );
  }

  const evidence = requirement.evidence;
  const isVerified = requirement.status === 'verified';
  const isFlagged = requirement.status === 'flagged';
  const isPending = requirement.status === 'pending';

  const handleSaveNote = async () => {
    if (!onUpdateNote) return;
    setIsSavingNote(true);
    await onUpdateNote(requirement.id, noteText);
    setIsSavingNote(false);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--surface)] overflow-y-auto">
      
      {/* Evidence Panel Header */}
      <div className="p-6 border-b border-[var(--rule)] bg-[#FAFAF8]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--slate)]">
            Auditor Evidence Dossier
          </span>
          {evidence?.confidence && (
            <span className="text-xs font-mono text-[var(--ink)] px-2 py-0.5 rounded-xs bg-[var(--paper)] border border-[var(--rule)]">
              Match Confidence: {Math.round(evidence.confidence * 100)}%
            </span>
          )}
        </div>

        <h3 className="font-mono font-bold text-base text-[var(--ink)]">
          {requirement.clauseId}
        </h3>
        <p className="text-xs text-[var(--slate)] font-mono mt-0.5">
          {requirement.section}
        </p>
      </div>

      {/* Requirement Text Box */}
      <div className="p-6 border-b border-[var(--rule)]">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--slate)] block mb-1">
          Regulatory Standard Mandate
        </span>
        <p className="text-sm font-serif italic text-[var(--ink)] leading-relaxed bg-[var(--paper)] p-4 rounded-sm border border-[var(--rule)]">
          "{requirement.text}"
        </p>
      </div>

      {/* Evidence Source Excerpt */}
      <div className="p-6 border-b border-[var(--rule)] flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--slate)]">
            Verified Source Citation
          </span>
          {evidence?.page ? (
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[var(--paper)] text-[var(--ink)] rounded-xs border border-[var(--rule)]">
              Page {evidence.page} · Paragraph {evidence.paragraph}
            </span>
          ) : (
            <span className="font-mono text-xs text-[var(--flagged)] px-2 py-0.5 bg-[#FBF0EF] rounded-xs">
              No Document Citation Found
            </span>
          )}
        </div>

        {evidence?.excerpt ? (
          <blockquote className="text-sm text-[var(--ink)] leading-relaxed border-l-2 border-[var(--ink)] pl-4 py-2 font-mono bg-[#FAF9F5] rounded-r-sm">
            {evidence.excerpt}
          </blockquote>
        ) : (
          <div className="p-4 bg-[#FBF0EF] text-[var(--flagged)] text-xs font-mono rounded-sm border border-[#F5D5D1]">
            Finding: The analyzed technical document contains no verifiable specification meeting requirement {requirement.clauseId}.
          </div>
        )}

        {/* Auditor Action Controls */}
        <div className="mt-6 pt-4 border-t border-[var(--rule)]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--slate)] block mb-2">
            Auditor Disposition Override
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onStatusOverride && onStatusOverride(requirement.id, 'verified')}
              className={`px-3 py-1.5 text-xs font-mono rounded-sm border transition-colors flex items-center gap-1.5 ${
                isVerified
                  ? 'bg-[var(--verified)] text-white border-[var(--verified)]'
                  : 'bg-[var(--surface)] text-[var(--verified)] border-[var(--rule)] hover:bg-[#EBF4EF]'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Mark Verified</span>
            </button>

            <button
              type="button"
              onClick={() => onStatusOverride && onStatusOverride(requirement.id, 'flagged')}
              className={`px-3 py-1.5 text-xs font-mono rounded-sm border transition-colors flex items-center gap-1.5 ${
                isFlagged
                  ? 'bg-[var(--flagged)] text-white border-[var(--flagged)]'
                  : 'bg-[var(--surface)] text-[var(--flagged)] border-[var(--rule)] hover:bg-[#FBF0EF]'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Flag Non-conformant</span>
            </button>

            <button
              type="button"
              onClick={() => onStatusOverride && onStatusOverride(requirement.id, 'pending')}
              className={`px-3 py-1.5 text-xs font-mono rounded-sm border transition-colors flex items-center gap-1.5 ${
                isPending
                  ? 'bg-[var(--pending)] text-white border-[var(--pending)]'
                  : 'bg-[var(--surface)] text-[var(--pending)] border-[var(--rule)] hover:bg-[#FAF4E8]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Pending Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviewer Notes Field */}
      <div className="p-6 bg-[#FAFAF8] border-t border-[var(--rule)]">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="reviewer-note" className="text-xs font-mono uppercase tracking-wider text-[var(--ink)] flex items-center gap-1.5 font-semibold">
            <Edit3 className="w-3.5 h-3.5 text-[var(--slate)]" />
            <span>Auditor Field Notes</span>
          </label>
          {isSavingNote && (
            <span className="text-[11px] font-mono text-[var(--slate)] animate-pulse">
              Saving...
            </span>
          )}
        </div>

        <textarea
          id="reviewer-note"
          rows={3}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add auditor remarks, CAPA action references, or cross-checks..."
          className="w-full text-xs font-mono p-3 bg-[var(--surface)] border border-[var(--rule)] rounded-sm focus:outline-hidden focus:border-[var(--ink)] resize-none"
        />

        <button
          type="button"
          onClick={handleSaveNote}
          className="mt-2 w-full py-2 bg-[var(--ink)] text-[var(--paper)] text-xs font-mono uppercase tracking-wider rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Auditor Note</span>
        </button>
      </div>
    </div>
  );
}

export default EvidencePanel;
