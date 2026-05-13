import React from 'react';

function FileSlot({ modality, file, onChange }) {
  return (
    <div
      className={`file-slot ${file ? 'has-file' : ''}`}
      style={{ '--slot-color': modality.color }}
    >
      <div className="slot-header">
        <span className="slot-badge" style={{ background: modality.color }}>{modality.label}</span>
        <span className="slot-desc">{modality.desc}</span>
      </div>

      {file ? (
        <div className="slot-filled">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M15 5L7 13L3 9" stroke={modality.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="slot-filename">{file.name}</span>
          <button type="button" className="slot-remove" onClick={() => onChange(null)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 3L3 11M3 3L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      ) : (
        <label className="slot-empty">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke={modality.color} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Upload .nii / .nii.gz</span>
          <input
            type="file"
            accept=".nii,.nii.gz,.gz"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
          />
        </label>
      )}
    </div>
  );
}

export default FileSlot;
