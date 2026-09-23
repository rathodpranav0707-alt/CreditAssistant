import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  color = 'var(--primary)',
  height = '8px',
  showLabel = false,
  label = ''
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
          <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>{label}</span>
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="progress-bar-container" style={{ height }}>
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};
