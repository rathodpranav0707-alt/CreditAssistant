import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  loading = false,
  icon: Icon,
  ...props
}) => {
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const fullWidthClass = fullWidth ? 'btn-full' : '';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${fullWidthClass} ${className}`.trim()}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg
            style={{ animation: 'spin 1s linear infinite', width: '1rem', height: '1rem' }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              style={{ opacity: 0.25 }}
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              style={{ opacity: 0.75 }}
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </span>
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </button>
  );
};
