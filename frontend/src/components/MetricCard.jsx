import React from 'react';

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'var(--primary-light)',
  iconColor = 'var(--primary)',
  trend,
  trendType = 'positive',
  badgeText,
  badgeType = 'info'
}) => {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        {Icon && (
          <div className="metric-icon-wrap" style={{ backgroundColor: iconBg, color: iconColor }}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="metric-value">{value}</div>

      <div className="metric-footer">
        {badgeText && (
          <span className={`badge badge-${badgeType}`}>{badgeText}</span>
        )}
        {trend && (
          <span style={{
            color: trendType === 'positive' ? 'var(--success)' : trendType === 'negative' ? 'var(--danger)' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.825rem'
          }}>
            {trend}
          </span>
        )}
        {subtitle && <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>}
      </div>
    </div>
  );
};
