import type { InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`.trim()}>
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input className="input-field" id={inputId} aria-invalid={!!error} aria-describedby={error && inputId ? `${inputId}-error` : undefined} {...props} />
      {error && <span className="input-error" id={inputId ? `${inputId}-error` : undefined} role="alert">{error}</span>}
    </div>
  );
}
