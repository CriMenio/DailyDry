import type { ReactNode, SelectHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type BaseProps = {
  label: string;
  hint?: string;
  required?: boolean;
};

export function AdminField({
  label,
  hint,
  required,
  ...inputProps
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="admin-field">
      <label className="admin-field-label">
        {label}
        {required && <span className="admin-required">*</span>}
      </label>
      {hint && <p className="admin-field-hint">{hint}</p>}
      <input className="admin-field-input" required={required} {...inputProps} />
    </div>
  );
}

export function AdminSelect({
  label,
  hint,
  children,
  ...selectProps
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <div className="admin-field">
      <label className="admin-field-label">{label}</label>
      {hint && <p className="admin-field-hint">{hint}</p>}
      <select className="admin-field-input" {...selectProps}>
        {children}
      </select>
    </div>
  );
}

export function AdminTextarea({
  label,
  hint,
  required,
  ...props
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="admin-field">
      <label className="admin-field-label">
        {label}
        {required && <span className="admin-required">*</span>}
      </label>
      {hint && <p className="admin-field-hint">{hint}</p>}
      <textarea className="admin-field-input admin-field-textarea" required={required} {...props} />
    </div>
  );
}

export function AdminFormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="admin-form-section">
      <header className="admin-form-section-head">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </header>
      <div className="admin-form-section-body">{children}</div>
    </section>
  );
}

export function AdminPageHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="admin-page-header">
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  );
}
