import { useState } from 'react';
import { auditService } from '../services/auditService.js';

export function useFileUpload(onSuccess) {
  const [productFile, setProductFile] = useState(null);
  const [standardFile, setStandardFile] = useState(null);
  const [standardPreset, setStandardPreset] = useState('ISO 9001:2015');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (kind, file) => {
    if (kind === 'product') {
      setProductFile(file);
    } else if (kind === 'standard') {
      setStandardFile(file);
    }
  };

  const handleClearFile = (kind) => {
    if (kind === 'product') setProductFile(null);
    if (kind === 'standard') setStandardFile(null);
  };

  const handleUsePreset = (presetName) => {
    setStandardPreset(presetName);
  };

  const handleSubmit = async (customName = '') => {
    if (!productFile && !standardFile) {
      setError('Please upload product documentation or load a sample audit.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const formData = new FormData();
      if (productFile) formData.append('product', productFile);
      if (standardFile) formData.append('standard', standardFile);
      if (customName) formData.append('productName', customName);
      formData.append('standardType', standardPreset);

      const response = await auditService.createAudit(formData);
      if (onSuccess && response?.data?.auditId) {
        onSuccess(response.data.auditId);
      }
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to submit documents for comparison.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadSample = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      const formData = new FormData();
      formData.append('isSample', 'true');
      formData.append('productName', 'NovaTech BioSensor QMS Dossier v3.2');
      formData.append('standardName', `${standardPreset} Requirements`);
      formData.append('standardType', standardPreset);

      const response = await auditService.createAudit(formData);
      if (onSuccess && response?.data?.auditId) {
        onSuccess(response.data.auditId);
      }
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to load sample audit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReadyToRun = Boolean(productFile && (standardFile || standardPreset));

  return {
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
  };
}

export default useFileUpload;
