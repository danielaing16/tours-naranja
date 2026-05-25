export default function AdminPageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <header className="admin-page-header admin-animate-header">
      <div className="admin-page-header-copy">
        {eyebrow && <span className="admin-page-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && <div className="admin-page-header-action">{action}</div>}
    </header>
  );
}
