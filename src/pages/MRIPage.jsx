import React, { useState } from 'react';
import FileSlot from '../components/FileSlot';
import { ENDPOINTS } from '../config/api';
import '../styles/upload.css';

const MODALITIES = [
  { key: 'flair', label: 'FLAIR', desc: 'Fluid-attenuated inversion recovery', color: '#3b9eff' },
  { key: 't1',    label: 'T1',    desc: 'T1-weighted structural scan',          color: '#a78bfa' },
  { key: 't1ce',  label: 'T1ce',  desc: 'T1 contrast-enhanced',                color: '#f59e0b' },
  { key: 't2',    label: 'T2',    desc: 'T2-weighted fluid-sensitive scan',     color: '#34d399' },
];

function MRIPage({ onBack }) {
  const [files,     setFiles]     = useState({ flair: null, t1: null, t1ce: null, t2: null });
  const [status,    setStatus]    = useState('idle');   // idle | analyzing | done | error
  const [statusMsg, setStatusMsg] = useState('');
  const [result,    setResult]    = useState(null);

  const allFilesReady = Object.values(files).every(Boolean);
  const isProcessing  = status === 'analyzing';
  const setFile       = (key) => (file) => setFiles(prev => ({ ...prev, [key]: file }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allFilesReady) return;

    setStatus('analyzing');
    setStatusMsg('Running segmentation... (~40 seconds)');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('flair', files.flair);
      formData.append('t1',    files.t1);
      formData.append('t1ce',  files.t1ce);
      formData.append('t2',    files.t2);

      const response = await fetch(ENDPOINTS.analyzeMRI, { method: 'POST', body: formData });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setStatus('done');
      setStatusMsg('');
    } catch (err) {
      setStatus('error');
      setStatusMsg(err.message);
    }
  };

  const handleReset = () => {
    setFiles({ flair: null, t1: null, t1ce: null, t2: null });
    setStatus('idle');
    setStatusMsg('');
    setResult(null);
  };

  const handleDownload = () => {
    if (!result) return;
    const text = `RADIOS — MRI ANALYSIS REPORT\n${'='.repeat(50)}\n\n${result.report}\n\n${'='.repeat(50)}\nTumor Volume: ${result.tumor_volume_cm3} cm³\nLocation: ${result.location}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `RADIOS_MRI_Report_${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="app-wrapper">
      <div className="upload-container animate-fadeInUp">

        {/* Header */}
        <div className="upload-header">
          <button onClick={onBack} className="btn-secondary back-btn" disabled={isProcessing}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <div className="upload-title-section">
            <h2 className="upload-title">MRI Brain Tumor Analysis</h2>
            <p className="upload-subtitle">Upload all 4 MRI modalities for segmentation + AI clinical report</p>
          </div>
        </div>

        {/* Upload Form */}
        {status !== 'done' && (
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="modality-grid">
              {MODALITIES.map(mod => (
                <FileSlot
                  key={mod.key}
                  modality={mod}
                  file={files[mod.key]}
                  onChange={setFile(mod.key)}
                />
              ))}
            </div>

            <div className="readiness-bar">
              <span>{Object.values(files).filter(Boolean).length} / 4 files uploaded</span>
              {allFilesReady && <span className="ready-badge">✓ Ready to analyze</span>}
            </div>

            {status === 'error' && (
              <div className="auth-error">⚠ {statusMsg}</div>
            )}

            <button type="submit" className="btn-primary submit-btn" disabled={!allFilesReady || isProcessing}>
              {isProcessing
                ? <><span className="spinner"></span>{statusMsg}</>
                : <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2V12M10 2L6 6M10 2L14 6M3 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Start Analysis
                  </>
              }
            </button>
          </form>
        )}

        {/* Results */}
        {status === 'done' && result && (
          <div className="results-section animate-fadeInUp">
            <div className="results-header">
              <h3 className="results-title">Analysis Complete</h3>
              <div className="results-actions">
                <button onClick={handleDownload} className="btn-accent">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1V13M9 13L5 9M9 13L13 9M2 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download Report
                </button>
                <button onClick={handleReset} className="btn-secondary">New Analysis</button>
              </div>
            </div>

            {result.overlay_image && (
              <div className="overlay-section">
                <h4 className="section-subheading">Segmentation Overlay</h4>
                <img
                  src={`data:image/png;base64,${result.overlay_image}`}
                  alt="MRI segmentation overlay"
                  className="overlay-image"
                />
              </div>
            )}

            <div className="report-section">
              <h4 className="section-subheading">Clinical Report</h4>
              <div className="results-output">
                <pre className="results-text">{result.report}</pre>
              </div>
            </div>

            {result.clinical_flags?.length > 0 && (
              <div className="flags-section">
                <h4 className="section-subheading">Clinical Flags</h4>
                <div className="flags-list">
                  {result.clinical_flags.map(flag => (
                    <span key={flag} className="flag-chip">{flag.replace(/_/g, ' ')}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default MRIPage;
