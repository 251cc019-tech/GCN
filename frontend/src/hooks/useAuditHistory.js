import { useState, useEffect, useCallback } from 'react';
import { auditService } from '../services/auditService.js';

export function useAuditHistory() {
  const [audits, setAudits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [standardFilter, setStandardFilter] = useState('all');

  const fetchAudits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await auditService.getAudits();
      setAudits(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch audit history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  const filteredAudits = audits.filter(item => {
    const matchesSearch = !searchFilter ||
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.productName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.standardName?.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStandard = standardFilter === 'all' || item.standardType === standardFilter;
    return matchesSearch && matchesStandard;
  });

  return {
    audits: filteredAudits,
    allAudits: audits,
    isLoading,
    error,
    searchFilter,
    standardFilter,
    setSearchFilter,
    setStandardFilter,
    refetch: fetchAudits
  };
}

export default useAuditHistory;
