import type { TextareaHTMLAttributes } from 'react';
import './Textarea.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  const textareaId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`textarea-group ${error ? 'textarea-group--error' : ''} ${className}`.trim()}>
      {label && (
        <label className="textarea-label" htmlFor={textareaId}>
          {label}
        </label>
      )}
      <textarea className="textarea-field" id={textareaId} aria-invalid={!!error} aria-describedby={error && textareaId ? `${textareaId}-error` : undefined} {...props} />
      {error && <span className="textarea-error" id={textareaId ? `${textareaId}-error` : undefined} role="alert">{error}</span>}
    </div>
  );
}
