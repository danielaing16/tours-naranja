import Reveal from './Reveal';

export default function PageHeader({ badge, title, subtitle, children, variant = 'up' }) {
  return (
    <Reveal variant={variant}>
      <header className="page-header">
        {badge && <span className="badge">{badge}</span>}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
        {children}
      </header>
    </Reveal>
  );
}
