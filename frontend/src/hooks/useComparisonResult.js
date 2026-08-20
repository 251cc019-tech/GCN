import { useState, useEffect, useCallback, useTransition } from 'react';
import { auditService } from '../services/auditService.js';

export function useComparisonResult(auditId) {
  const [audit, setAudit] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [selectedRequirementId, setSelectedRequirementId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'verified' | 'flagged' | 'pending'
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, startTransition] = useTransition();

  const fetchAuditData = useCallback(async () => {
    if (!auditId) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await auditService.getRequirements(auditId);
      
      startTransition(() => {
        setAudit({
          id: data.auditId,
          status: data.status,
          score: data.score,
          counts: data.counts,
        });
        setRequirements(data.requirements || []);
        
        // Select first requirement by default if not set
        if (!selectedRequirementId && data.requirements?.length > 0) {
          setSelectedRequirementId(data.requirements[0].id);
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch comparison results');
    } finally {
      setIsLoading(false);
    }
  }, [auditId, selectedRequirementId]);

  // Initial fetch and polling if processing
  useEffect(() => {
    fetchAuditData();

    // Polling interval if audit is in processing state
    const interval = setInterval(async () => {
      if (audit?.status === 'processing') {
        fetchAuditData();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchAuditData, audit?.status]);

  const selectedRequirement = requirements.find(r => r.id === selectedRequirementId) || requirements[0] || null;

  const handleSelectRequirement = (id) => {
    setSelectedRequirementId(id);
  };

  const handleUpdateNote = async (reqId, note) => {
    try {
      const updated = await auditService.updateRequirement(auditId, reqId, { reviewerNote: note });
      setRequirements(prev => prev.map(r => (r.id === reqId ? { ...r, reviewerNote: note } : r)));
      return updated;
    } catch (err) {
      console.error('Failed to update reviewer note:', err);
    }
  };

  const handleStatusOverride = async (reqId, newStatus) => {
    try {
      await auditService.updateRequirement(auditId, reqId, { status: newStatus });
      fetchAuditData();
    } catch (err) {
      console.error('Failed to override status:', err);
    }
  };

  // Filtered requirements
  const filteredRequirements = requirements.filter(req => {
    const matchesFilter = filterStatus === 'all' || req.status === filterStatus;
    const matchesSearch = !searchQuery || 
      req.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
      req.clauseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.section.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return {
    audit,
    requirements: filteredRequirements,
    allRequirements: requirements,
    selectedRequirement,
    selectedRequirementId,
    filterStatus,
    searchQuery,
    isLoading,
    error,
    scoreSummary: audit ? {
      score: audit.score,
      matched: audit.counts?.matched || 0,
      missing: audit.counts?.missing || 0,
      pending: audit.counts?.pending || 0,
      total: audit.counts?.total || 0,
    } : null,
    setFilterStatus,
    setSearchQuery,
    handleSelectRequirement,
    handleUpdateNote,
    handleStatusOverride,
    refetch: fetchAuditData,
  };
}

export default useComparisonResult;
