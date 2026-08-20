import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

export function RequirementTable({ clauses = [] }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-sm overflow-hidden shadow-xs mt-8">
      
      <div className="p-6 border-b border-[var(--rule)] bg-[#FAFAF8]">
        <h2 className="font-display font-bold text-xl text-[var(--ink)]">
          Regulatory Clause Verification Matrix
        </h2>
        <p className="text-xs font-mono text-[var(--slate)] mt-1">
          Detailed itemized audit of standard requirements against verified product evidence.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--rule)] bg-[var(--paper)] text-[11px] font-mono uppercase tracking-wider text-[var(--slate)]">
              <th className="py-3.5 px-4 font-semibold w-32">Clause Ref</th>
              <th className="py-3.5 px-4 font-semibold w-40">Section</th>
              <th className="py-3.5 px-4 font-semibold">Requirement & Finding</th>
              <th className="py-3.5 px-4 font-semibold w-28">Status</th>
              <th className="py-3.5 px-4 font-semibold w-32">Citation</th>
              <th className="py-3.5 px-4 font-semibold w-48">Auditor Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--rule)] text-xs font-mono">
            {clauses.map((item) => {
              const isVerified = item.status === 'verified';
              const isFlagged = item.status === 'flagged';
              const statusColor = isVerified ? 'text-[var(--verified)]' : isFlagged ? 'text-[var(--flagged)]' : 'text-[var(--pending)]';
              const statusBg = isVerified ? 'bg-[#EBF4EF]' : isFlagged ? 'bg-[#FBF0EF]' : 'bg-[#FAF4E8]';

              return (
                <tr key={item.id} className="hover:bg-[#FCFCFA] transition-colors">
                  
                  {/* Clause Ref */}
                  <td className="py-4 px-4 font-bold text-[var(--ink)] align-top">
                    {item.clauseId}
                  </td>

                  {/* Section */}
                  <td className="py-4 px-4 text-[var(--slate)] align-top">
                    {item.section}
                  </td>

                  {/* Requirement Text & Excerpt */}
                  <td className="py-4 px-4 align-top font-sans space-y-2">
                    <p className="text-[var(--ink)] leading-relaxed">
                      {item.text}
                    </p>
                    {item.excerpt && item.excerpt !== 'None provided' && (
                      <div className="text-[11px] font-mono text-[var(--slate)] bg-[var(--paper)] p-2 rounded-xs border-l-2 border-[var(--ink)]">
                        <span className="font-semibold block text-[10px] uppercase text-[var(--ink)] mb-0.5">
                          Evidence Excerpt:
                        </span>
                        "{item.excerpt}"
                      </div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 align-top">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xs font-semibold uppercase text-[10px] ${statusBg} ${statusColor}`}>
                      {isVerified && <CheckCircle2 className="w-3 h-3" />}
                      {isFlagged && <AlertTriangle className="w-3 h-3" />}
                      {!isVerified && !isFlagged && <HelpCircle className="w-3 h-3" />}
                      <span>{item.status}</span>
                    </span>
                  </td>

                  {/* Citation */}
                  <td className="py-4 px-4 text-[var(--slate)] align-top">
                    {item.evidencePage !== 'N/A' ? (
                      <span className="bg-[var(--paper)] px-2 py-1 rounded-xs border border-[var(--rule)] text-[11px]">
                        p.{item.evidencePage} ¶{item.evidenceParagraph}
                      </span>
                    ) : (
                      <span className="text-[var(--slate)] opacity-60">—</span>
                    )}
                  </td>

                  {/* Auditor Notes */}
                  <td className="py-4 px-4 text-[var(--slate)] align-top font-sans">
                    {item.reviewerNote ? (
                      <p className="italic text-[var(--ink)] text-[11px]">
                        {item.reviewerNote}
                      </p>
                    ) : (
                      <span className="opacity-40 text-[11px]">No notes</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RequirementTable;
