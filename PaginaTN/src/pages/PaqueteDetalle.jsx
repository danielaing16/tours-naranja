import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SafeImage from '../components/SafeImage';
import Reveal from '../components/ui/Reveal';
import { whatsappUrl } from '../constants/contacto';
import { useLanguage } from '../i18n/LanguageContext';
import { fetchJson } from '../lib/fetchJson';

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

  const imagen = p.imagen_url || '';
  const descripcion = p.descripcion_larga || p.descripcion_corta || '';
  const incluye = Array.isArray(p.incluye) ? p.incluye : [];
  const destino = p.destinos?.nombre || '';

  return (
    <div className="container page page-motion">
      <Link to="/paquetes" className="back-link">
        {t.backList}
      </Link>
      <Reveal delay={80} variant="scale">
        <article className="detail card">
          <SafeImage className="detail-img" src={imagen} alt={p.nombre} />
          <div className="detail-body">
            <span className="badge">
              {p.dias} {t.days}
              {destino ? ` · ${destino}` : ''}
              {p.incluye_transporte ? ` · ${t.transportIncluded}` : ''}
            </span>
            <h1>{p.nombre}</h1>
            <p className="detail-price">{fmt(p.precio, lang)}</p>
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
                href={whatsappUrl(`Hola, me interesa ${p.nombre}`)}
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
