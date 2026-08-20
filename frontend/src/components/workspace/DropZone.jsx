import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, X } from 'lucide-react';

export function DropZone({ kind, file, onFileSelect, onClearFile, accept = '.pdf,.doc,.docx,.txt' }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(kind, e.dataTransfer.files[0]);
    }
  };

  const isProduct = kind === 'product';
  const label = isProduct ? 'Product Specification / Dossier' : 'Regulatory Standard / Framework';
  const description = isProduct 
    ? 'Upload technical manual, software spec, or design file (PDF, DOCX, TXT)'
    : 'Upload standard document or select standard preset (ISO, CE MDR, FDA)';

  return (
    <div className="flex-1 flex flex-col">
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-md p-8 cursor-pointer transition-all min-h-[220px] ${
          isDragOver
            ? 'border-[var(--ink)] bg-[var(--surface)] scale-[1.01]'
            : file
            ? 'border-[var(--verified)] bg-[#F5FAF7]'
            : 'border-[var(--rule)] bg-[var(--surface)] hover:border-[var(--slate)]'
        }`}
      >
        {file ? (
          <div className="flex flex-col items-center text-center gap-2 w-full max-w-sm">
            <div className="w-12 h-12 rounded-full bg-[#EBF4EF] flex items-center justify-center text-[var(--verified)]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase font-mono tracking-wider text-[var(--slate)]">
              {label}
            </span>
            <p className="font-mono text-sm font-semibold text-[var(--ink)] truncate max-w-full px-4">
              {file.name}
            </p>
            <p className="text-xs text-[var(--slate)] font-mono">
              {(file.size / 1024).toFixed(1)} KB · Ready for review
            </p>

            {onClearFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClearFile(kind);
                }}
                className="mt-2 text-xs text-[var(--flagged)] hover:underline flex items-center gap-1 font-mono"
              >
                <X className="w-3.5 h-3.5" /> Replace file
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[var(--paper)] flex items-center justify-center text-[var(--slate)]">
              <Upload className="w-5 h-5 text-[var(--ink)]" />
            </div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--ink)]">
              {label}
            </span>
            <p className="text-xs text-[var(--slate)] max-w-xs leading-relaxed">
              {description}
            </p>
            <span className="mt-2 px-3 py-1 bg-[var(--paper)] text-[11px] font-mono text-[var(--ink)] rounded-sm border border-[var(--rule)]">
              Browse Files or Drag & Drop
            </span>
          </div>
        )}

        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onFileSelect(kind, e.target.files[0]);
            }
          }}
        />
      </label>
    </div>
  );
}

export default DropZone;
