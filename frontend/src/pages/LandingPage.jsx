import React from 'react';
import { ShieldCheck, FileCheck, ArrowRight, CheckCircle2, Award, Sparkles, BookOpen, Layers } from 'lucide-react';

export function LandingPage({ onStartAudit, onViewHistory }) {
  return (
    <div className="flex-1">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-[var(--rule)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF4EF] border border-[#D0E5D9] text-[var(--verified)] text-xs font-mono mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Regulatory Redline & Compliance Auditing</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--ink)] leading-[1.15]">
              Dense regulatory compliance reviews, <span className="underline decoration-[var(--rule)] underline-offset-8">verified in seconds</span>.
            </h1>

            <p className="mt-6 text-lg text-[var(--slate)] font-sans leading-relaxed">
              ClauseNova compares product documentation against regulatory standards (ISO, CE, FDA), flags matched vs. missing requirements, and surfaces exact evidence citations so auditors never have to blindly trust AI findings.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onStartAudit}
                className="px-6 py-3.5 bg-[var(--ink)] text-[var(--paper)] rounded-sm text-sm font-mono uppercase tracking-wider font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-xs"
              >
                <span>Launch Audit Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onViewHistory}
                className="px-6 py-3.5 bg-[var(--paper)] text-[var(--ink)] border border-[var(--rule)] rounded-sm text-sm font-mono uppercase tracking-wider font-semibold hover:bg-[#ECE8DC] transition-all"
              >
                <span>View Sample Audits</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Redline Protocol */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono tracking-widest text-[var(--slate)] block mb-2">
            The Auditor Workflow
          </span>
          <h2 className="font-display text-3xl font-bold text-[var(--ink)]">
            How ClauseNova Verifies Compliance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-sm p-8 flex flex-col">
            <div className="w-10 h-10 rounded-sm bg-[var(--paper)] border border-[var(--rule)] flex items-center justify-center font-mono font-bold text-[var(--ink)] mb-6">
              01
            </div>
            <h3 className="font-display text-xl font-bold text-[var(--ink)] mb-2">
              Dual-Document Upload
            </h3>
            <p className="text-sm font-sans text-[var(--slate)] leading-relaxed flex-1">
              Provide your technical specification or quality manual alongside standard regulatory mandates (ISO 9001, MDR 2017/745, FDA 21 CFR 820).
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-sm p-8 flex flex-col relative">
            <div className="w-10 h-10 rounded-sm bg-[var(--paper)] border border-[var(--rule)] flex items-center justify-center font-mono font-bold text-[var(--verified)] mb-6">
              02
            </div>
            <h3 className="font-display text-xl font-bold text-[var(--ink)] mb-2">
              Redline Clause Analysis
            </h3>
            <p className="text-sm font-sans text-[var(--slate)] leading-relaxed flex-1">
              Every mandate is individually analyzed with leader-line evidence linking exact page and paragraph citations from your dossier.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-sm p-8 flex flex-col">
            <div className="w-10 h-10 rounded-sm bg-[var(--paper)] border border-[var(--rule)] flex items-center justify-center font-mono font-bold text-[var(--ink)] mb-6">
              03
            </div>
            <h3 className="font-display text-xl font-bold text-[var(--ink)] mb-2">
              Certified Audit Certificate
            </h3>
            <p className="text-sm font-sans text-[var(--slate)] leading-relaxed flex-1">
              Export comprehensive compliance scores, non-conformance registers, and auditor field notes formatted for notified body submissions.
            </p>
          </div>
        </div>
      </section>

      {/* Standard Frameworks Supported */}
      <section className="py-12 bg-[#F3EFE6] border-t border-[var(--rule)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6 text-xs font-mono text-[var(--slate)]">
            <span className="uppercase tracking-widest font-semibold text-[var(--ink)]">
              Supported Regulatory Frameworks:
            </span>
            <div className="flex flex-wrap items-center gap-6">
              <span className="px-3 py-1 bg-[var(--surface)] border border-[var(--rule)] rounded-xs">ISO 9001:2015 Quality</span>
              <span className="px-3 py-1 bg-[var(--surface)] border border-[var(--rule)] rounded-xs">EU MDR 2017/745</span>
              <span className="px-3 py-1 bg-[var(--surface)] border border-[var(--rule)] rounded-xs">FDA 21 CFR Part 820</span>
              <span className="px-3 py-1 bg-[var(--surface)] border border-[var(--rule)] rounded-xs">ISO 13485:2016 Medical</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
