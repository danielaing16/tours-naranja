import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SafeImage from '../components/SafeImage';
import Reveal from '../components/ui/Reveal';
import { whatsappUrl } from '../constants/contacto';
import { useLanguage } from '../i18n/LanguageContext';
import { fetchJson } from '../lib/fetchJson';
import { localizePaquete } from '../lib/localizePaquete';

const fmt = (n, lang) =>
  new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n);

export default function PaqueteDetalle() {
  const { lang, ui } = useLanguage();
  const t = ui.packageDetail;
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setCargando(true);
    fetchJson(`/api/paquetes/${id}`)
      .then((data) => setP(data))
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return <p className="container page">{t.loading}</p>;
  if (error || !p) {
    return (
      <div className="container page">
        <p>{error || t.notFound}</p>
        <Link to="/paquetes" className="back-link">
          {t.back}
        </Link>
      </div>
    );
  }

  const pkg = localizePaquete(p, lang);
  const imagen = pkg.imagen_url || '';
  const descripcion = pkg.descripcion_larga || pkg.descripcion_corta || '';
  const incluye = Array.isArray(pkg.incluye) ? pkg.incluye : [];
  const destino = pkg.destinos?.nombre || '';

  return (
    <div className="container page page-motion">
      <Link to="/paquetes" className="back-link">
        {t.backList}
      </Link>
      <Reveal delay={80} variant="scale">
        <article className="detail card">
          <SafeImage className="detail-img" src={imagen} alt={pkg.nombre} />
          <div className="detail-body">
            <span className="badge">
              {pkg.dias} {t.days}
              {destino ? ` · ${destino}` : ''}
              {pkg.incluye_transporte ? ` · ${t.transportIncluded}` : ''}
            </span>
            <h1>{pkg.nombre}</h1>
            <p className="detail-price">{fmt(pkg.precio, lang)}</p>
            <p>{descripcion}</p>
            {incluye.length > 0 && (
              <>
                <h3>{t.includes}</h3>
                <ul>
                  {incluye.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </>
            )}
            <div className="detail-actions">
              <a
                className="btn btn-primary"
                href={whatsappUrl(
                  lang === 'en'
                    ? `Hello, I am interested in ${pkg.nombre}`
                    : `Hola, me interesa ${pkg.nombre}`
                )}
                target="_blank"
                rel="noreferrer"
              >
                {t.wantPackage}
              </a>
              <Link to="/crea-tu-plan" className="btn btn-outline">
                {t.customize}
              </Link>
            </div>
          </div>
        </article>
      </Reveal>
    </div>
  );
}
