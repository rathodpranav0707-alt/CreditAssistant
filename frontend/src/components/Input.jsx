import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = ({
  label,
  hint,
  error,
  type = 'text',
  isPassword = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          <span>{label}</span>
          {hint && <span className="form-hint">{hint}</span>}
        </label>
      )}
      <div className="input-wrapper">
        {Icon && <span className="input-icon-left"><Icon size={18} /></span>}
        <input
          type={inputType}
          className={`form-input${Icon ? ' has-icon-left' : ''}${isPassword ? ' has-icon-right' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="input-icon-right"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};
