import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from './Card';

export const RecommendationCard = ({ recommendation }) => {
  const { category, title, priority, impact, description } = recommendation;
  const actionPlan = recommendation.action_plan || recommendation.actionPlan || [];

  const priorityBadge = {
    Critical: 'badge-danger',
    High: 'badge-warning',
    Medium: 'badge-info',
    Low: 'badge-success'
  }[priority] || 'badge-info';

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {category || 'Financial Health'}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className={`badge ${priorityBadge}`}>{priority || 'General'} Priority</span>
        </div>
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
        {title}
      </h3>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
        {description}
      </p>

      {impact && (
        <div style={{
          backgroundColor: 'var(--bg-main)',
          padding: '0.6rem 0.9rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem'
        }}>
          <Sparkles size={16} color="var(--primary)" />
          <span style={{ color: 'var(--text-muted)' }}>Estimated Impact:</span>
          <strong style={{ color: 'var(--text-main)' }}>{impact}</strong>
        </div>
      )}

      {actionPlan.length > 0 && (
        <div style={{ marginTop: 'auto' }}>
          <h4 style={{ fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.6rem', letterSpacing: '0.04em' }}>
            Recommended Action Steps:
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {actionPlan.map((action, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
