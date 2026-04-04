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
      <textarea className="textarea-field" id={textareaId} {...props} />
      {error && <span className="textarea-error">{error}</span>}
    </div>
  );
}
