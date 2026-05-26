import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';
import { useLanguage } from '../i18n/LanguageContext';
import { localizePaquete } from '../lib/localizePaquete';

const fmt = (n, lang) =>
  new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n);

const ACCENTS = ['orange', 'green', 'teal'];

function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="package-overlay-icon">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function PackageCard({ p, accent = 0, variant = 'default', activeLabel = false, hideLabel = false }) {
  const { lang, ui } = useLanguage();
  const pc = ui.packageCard;
  const pkg = localizePaquete(p, lang);
  const imagen = pkg.imagen_url || pkg.imagen || '';
  const descripcion = pkg.descripcion_corta || pkg.descripcion || '';
  const intereses = Array.isArray(pkg.intereses)
    ? pkg.intereses
    : typeof pkg.intereses === 'string' && pkg.intereses
      ? [pkg.intereses]
      : [];
  const destinoNombre = pkg.destinos?.nombre || (lang === 'en' ? 'Córdoba' : 'Córdoba');
  const tone = ACCENTS[accent % ACCENTS.length];
  const label = (intereses[0] || pkg.ritmo || 'Tour').toUpperCase();
  const meta = `${pkg.dias} ${pkg.dias === 1 ? pc.dayMeta : pc.daysMeta} · ${destinoNombre}`;

  if (variant === 'overlay') {
    const duracion = `${pkg.dias} ${pkg.dias === 1 ? pc.dayTour : pc.daysTour}`;
    return (
      <div className="package-card-wrap">
        {!hideLabel && (
          <span className={`package-card-label${activeLabel || accent === 0 ? ' is-active' : ''}`}>{label}</span>
        )}
        <Link to={`/paquetes/${pkg.id}`} className="package-card package-card--overlay">
          <div className="package-card-media">
            <SafeImage src={imagen} alt={pkg.nombre} />
          </div>
          <div className="package-card-glass">
            <span className="package-overlay-price">{fmt(pkg.precio, lang)}</span>
            <span className="package-overlay-divider" aria-hidden="true" />
            <h3 className="package-overlay-title">{pkg.nombre}</h3>
            <p className="package-overlay-meta">
              <ClockIcon />
              <span>{duracion}</span>
            </p>
          </div>
        </Link>
      </div>
    );
  }

  if (variant === 'destination') {
    return (
      <Link
        to={`/paquetes/${pkg.id}`}
        className={`card package-card package-card--destination package-card--${tone}`}
      >
        <div className="package-card-media">
          <SafeImage src={imagen} alt={pkg.nombre} />
          {intereses[0] && <span className="package-dest-tag">{intereses[0]}</span>}
        </div>
        <div className="package-body package-body--destination">
          <div className="package-card-top">
            <h3>{pkg.nombre}</h3>
            <span className="package-duration">
              {pkg.dias} {pkg.dias === 1 ? pc.dayMeta : pc.daysMeta}
            </span>
          </div>
          <p className="package-location">{destinoNombre}, Colombia</p>
          {descripcion && <p className="package-desc package-desc--destination">{descripcion}</p>}
          <div className="package-dest-foot">
            <span className="package-price package-price--destination">{fmt(pkg.precio, lang)}</span>
            <span className="package-dest-link">{pc.viewDetail} ›</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article className={`card package-card package-card--${tone}`}>
      <div className="package-card-media">
        <SafeImage src={imagen} alt={pkg.nombre} />
      </div>
      <div className="package-body">
        <div className="package-meta">
          <span className="package-badge">
            {pkg.dias} {pkg.dias === 1 ? pc.dayMeta : pc.daysMeta}
            {pkg.destinos?.nombre ? ` · ${pkg.destinos.nombre}` : ''}
          </span>
          <span className="package-price">{fmt(pkg.precio, lang)}</span>
        </div>
        <h3>{pkg.nombre}</h3>
        <p className="package-desc">{descripcion}</p>
        {intereses.length > 0 && (
          <div className="tags">
            {intereses.map((i) => (
              <span key={i} className="tag">
                {i}
              </span>
            ))}
          </div>
        )}
        <Link to={`/paquetes/${pkg.id}`} className="btn btn-primary package-card-btn">
          {pc.viewDetail}
        </Link>
      </div>
    </article>
  );
}
