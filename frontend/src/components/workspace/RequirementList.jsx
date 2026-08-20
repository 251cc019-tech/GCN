import React from 'react';
import { Search, Filter } from 'lucide-react';
import RequirementRow from './RequirementRow.jsx';

export function RequirementList({
  requirements = [],
  selectedRequirementId,
  onSelectRequirement,
  filterStatus = 'all',
  onFilterChange,
  searchQuery = '',
  onSearchChange,
}) {
  return (
    <div className="flex flex-col h-full bg-[var(--surface)] border-r border-[var(--rule)]">
      
      {/* Header Filters & Search Bar */}
      <div className="p-4 border-b border-[var(--rule)] bg-[var(--surface)] sticky top-0 z-20">
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-[var(--slate)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clauses, requirements, or keywords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-[var(--paper)] border border-[var(--rule)] rounded-sm focus:outline-hidden focus:border-[var(--ink)]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-xs font-mono overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={`px-2.5 py-1 rounded-sm transition-colors ${
              filterStatus === 'all'
                ? 'bg-[var(--ink)] text-[var(--paper)] font-medium'
                : 'text-[var(--slate)] hover:bg-[var(--paper)]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('verified')}
            className={`px-2.5 py-1 rounded-sm transition-colors flex items-center gap-1 ${
              filterStatus === 'verified'
                ? 'bg-[var(--verified)] text-white font-medium'
                : 'text-[var(--verified)] hover:bg-[#EBF4EF]'
            }`}
          >
            Verified
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('flagged')}
            className={`px-2.5 py-1 rounded-sm transition-colors flex items-center gap-1 ${
              filterStatus === 'flagged'
                ? 'bg-[var(--flagged)] text-white font-medium'
                : 'text-[var(--flagged)] hover:bg-[#FBF0EF]'
            }`}
          >
            Flagged
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('pending')}
            className={`px-2.5 py-1 rounded-sm transition-colors flex items-center gap-1 ${
              filterStatus === 'pending'
                ? 'bg-[var(--pending)] text-white font-medium'
                : 'text-[var(--pending)] hover:bg-[#FAF4E8]'
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {/* Scrollable Requirement Rows */}
      <div className="flex-1 overflow-y-auto divide-y divide-[var(--rule)]">
        {requirements.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-[var(--slate)]">
            No matching requirements found.
          </div>
        ) : (
          requirements.map((req) => (
            <RequirementRow
              key={req.id}
              requirement={req}
              isActive={req.id === selectedRequirementId}
              onSelect={onSelectRequirement}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default RequirementList;
