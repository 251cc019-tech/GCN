import React, { useState } from 'react';
import { ArrowRight, Sparkles, FileText, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import DropZone from '../components/workspace/DropZone.jsx';
import { useFileUpload } from '../hooks/useFileUpload.js';

export function WorkspaceUploadPage({ onAuditCreated }) {
  const [customName, setCustomName] = useState('');
  const {
    productFile,
    standardFile,
    standardPreset,
    isSubmitting,
    isReadyToRun,
    error,
    handleFileSelect,
    handleClearFile,
    handleUsePreset,
    handleSubmit,
    handleLoadSample,
  } = useFileUpload((auditId) => {
    if (onAuditCreated) onAuditCreated(auditId);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Page Heading */}
      <div className="mb-8">
        <span className="text-xs uppercase font-mono tracking-widest text-[var(--slate)] block mb-1">
          Compliance Workspace
        </span>
        <h1 className="font-display text-3xl font-bold text-[var(--ink)] tracking-tight">
          New Regulatory Comparison Audit
        </h1>
        <p className="text-sm font-sans text-[var(--slate)] mt-1">
          Upload product technical documents and regulatory standard specifications to execute a full clause-by-clause compliance audit.
        </p>
      </div>

      {/* Preset / Sample Quick Action Banner */}
      <div className="mb-8 p-4 bg-[var(--surface)] border border-[var(--rule)] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[var(--pending)] shrink-0" />
          <div>
            <p className="text-xs font-mono font-semibold text-[var(--ink)]">
              Quick Demonstration Mode
            </p>
            <p className="text-xs text-[var(--slate)]">
              Instant audit with pre-loaded medical device QMS dossier and ISO 9001 standard.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          disabled={isSubmitting}
          className="px-4 py-2 bg-[var(--paper)] text-[var(--ink)] border border-[var(--rule)] rounded-sm text-xs font-mono uppercase tracking-wider font-semibold hover:bg-[#ECE8DC] transition-colors self-start sm:self-auto shrink-0"
        >
          {isSubmitting ? 'Processing...' : 'Load Sample Audit'}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-[#FBF0EF] border border-[#F5D5D1] text-[var(--flagged)] rounded-sm text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Form Container */}
      <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-sm p-8 shadow-xs">
        
        {/* Project Name Field */}
        <div className="mb-6">
          <label htmlFor="audit-name" className="block text-xs font-mono uppercase tracking-wider text-[var(--slate)] mb-2 font-semibold">
            Audit Dossier Name (Optional)
          </label>
          <input
            id="audit-name"
            type="text"
            placeholder="e.g., NovaTech BioSensor v2.4 QMS Review"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full text-xs font-mono p-3 bg-[var(--paper)] border border-[var(--rule)] rounded-sm focus:outline-hidden focus:border-[var(--ink)]"
          />
        </div>

        {/* Dual Drop Zones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DropZone
            kind="product"
            file={productFile}
            onFileSelect={handleFileSelect}
            onClearFile={handleClearFile}
          />
          <DropZone
            kind="standard"
            file={standardFile}
            onFileSelect={handleFileSelect}
            onClearFile={handleClearFile}
          />
        </div>

        {/* Regulatory Standard Preset Selection */}
        {!standardFile && (
          <div className="mb-8 pt-6 border-t border-[var(--rule)]">
            <span className="block text-xs font-mono uppercase tracking-wider text-[var(--slate)] mb-3 font-semibold">
              Or Select Standard Framework Preset:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'ISO 9001:2015', desc: 'Quality Management Systems' },
                { key: 'CE MDR 2017/745', desc: 'EU Medical Devices Regulation' },
                { key: 'FDA 21 CFR 820', desc: 'Quality System Regulation (QSR)' },
              ].map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => handleUsePreset(preset.key)}
                  className={`p-3 rounded-sm border text-left transition-all ${
                    standardPreset === preset.key
                      ? 'border-[var(--ink)] bg-[var(--paper)] ring-1 ring-[var(--ink)]'
                      : 'border-[var(--rule)] bg-[var(--surface)] hover:border-[var(--slate)]'
                  }`}
                >
                  <p className="font-mono text-xs font-semibold text-[var(--ink)]">
                    {preset.key}
                  </p>
                  <p className="text-[11px] text-[var(--slate)] font-sans mt-0.5">
                    {preset.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-6 border-t border-[var(--rule)] flex items-center justify-between">
          <span className="text-xs font-mono text-[var(--slate)]">
            {isReadyToRun ? 'Ready to compare documents.' : 'Upload both files or select preset to proceed.'}
          </span>

          <button
            type="button"
            disabled={!isReadyToRun || isSubmitting}
            onClick={() => handleSubmit(customName)}
            className={`px-6 py-3 rounded-sm text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 ${
              isReadyToRun && !isSubmitting
                ? 'bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 cursor-pointer shadow-xs'
                : 'bg-[var(--paper)] text-[var(--slate)] border border-[var(--rule)] cursor-not-allowed opacity-60'
            }`}
          >
            <span>{isSubmitting ? 'Comparing Clauses...' : 'Run Compliance Comparison'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceUploadPage;
