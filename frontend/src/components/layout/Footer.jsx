import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--rule)] bg-[var(--surface)] py-6 text-xs text-[var(--slate)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-[var(--ink)]">ClauseNova</span>
          <span>— Redline Regulatory Review System</span>
        </div>
        <div className="font-mono text-[11px] text-[var(--slate)]">
          Audit standards: ISO 9001:2015 · EU MDR 2017/745 · FDA 21 CFR Part 820
        </div>
        <div className="text-[11px]">
          Confidential Compliance Record
        </div>
      </div>
    </footer>
  );
}

export default Footer;
