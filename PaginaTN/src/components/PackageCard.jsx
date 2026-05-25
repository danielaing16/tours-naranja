import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';
import { useLanguage } from '../i18n/LanguageContext';

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
  const imagen = p.imagen_url || p.imagen || '';
  const descripcion = p.descripcion_corta || p.descripcion || '';
  const intereses = Array.isArray(p.intereses) ? p.intereses : [];
  const destinoNombre = p.destinos?.nombre || 'Córdoba';
  const tone = ACCENTS[accent % ACCENTS.length];
  const label = (intereses[0] || p.ritmo || 'Tour').toUpperCase();
  const meta = `${p.dias} ${p.dias === 1 ? pc.dayMeta : pc.daysMeta} · ${destinoNombre}`;

  if (variant === 'overlay') {
    const duracion = `${p.dias} ${p.dias === 1 ? pc.dayTour : pc.daysTour}`;
    return (
      <div className="package-card-wrap">
        {!hideLabel && (
          <span className={`package-card-label${activeLabel || accent === 0 ? ' is-active' : ''}`}>{label}</span>
        )}
        <Link to={`/paquetes/${p.id}`} className="package-card package-card--overlay">
          <div className="package-card-media">
            <SafeImage src={imagen} alt={p.nombre} />
          </div>
          <div className="package-card-glass">
            <span className="package-overlay-price">{fmt(p.precio, lang)}</span>
            <span className="package-overlay-divider" aria-hidden="true" />
            <h3 className="package-overlay-title">{p.nombre}</h3>
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
        to={`/paquetes/${p.id}`}
        className={`card package-card package-card--destination package-card--${tone}`}
      >
        <div className="package-card-media">
          <SafeImage src={imagen} alt={p.nombre} />
          {intereses[0] && <span className="package-dest-tag">{intereses[0]}</span>}
        </div>
        <div className="package-body package-body--destination">
          <div className="package-card-top">
            <h3>{p.nombre}</h3>
            <span className="package-duration">{p.dias} días</span>
          </div>
          <p className="package-location">{destinoNombre}, Colombia</p>
          {descripcion && <p className="package-desc package-desc--destination">{descripcion}</p>}
          <div className="package-dest-foot">
            <span className="package-price package-price--destination">{fmt(p.precio)}</span>
            <span className="package-dest-link">Ver detalle ›</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article className={`card package-card package-card--${tone}`}>
      <div className="package-card-media">
        <SafeImage src={imagen} alt={p.nombre} />
      </div>
      <div className="package-body">
        <div className="package-meta">
          <span className="package-badge">
            {p.dias} días{p.destinos?.nombre ? ` · ${p.destinos.nombre}` : ''}
          </span>
          <span className="package-price">{fmt(p.precio)}</span>
        </div>
        <h3>{p.nombre}</h3>
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
        <Link to={`/paquetes/${p.id}`} className="btn btn-primary package-card-btn">
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
