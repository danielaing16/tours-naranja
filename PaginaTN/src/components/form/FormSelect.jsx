function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="plan-select-chevron">
      <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FormSelect({ id, label, hint, children, value, onChange, required }) {
  return (
    <div className="plan-field">
      <label htmlFor={id}>{label}</label>
      {hint && <p className="plan-field-hint">{hint}</p>}
      <div className="plan-select-wrap">
        <select
          id={id}
          className="plan-select"
          value={value}
          onChange={onChange}
          required={required}
        >
          {children}
        </select>
        <ChevronIcon />
      </div>
    </div>
  );
}
