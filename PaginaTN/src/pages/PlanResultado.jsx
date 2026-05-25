import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SafeImage from '../components/SafeImage';
import Reveal from '../components/ui/Reveal';
import { whatsappUrl } from '../constants/contacto';
import { useLanguage } from '../i18n/LanguageContext';
import { buildWhatsappPlanMessage } from '../lib/whatsappPlanMessage';
import { buildPlanFromPreferences, fetchPlanFromApi } from '../services/planService';

const fmt = (n, lang) => {
  if (n == null || Number.isNaN(Number(n))) return '—';
  return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n);
};

function AliadoChip({ tipo, item, lang, labels }) {
  if (!item) return null;
  return (
    <div className={`result-aliado result-aliado--${tipo}`}>
      <span className="result-aliado-type">{tipo === 'hotel' ? labels.hotel : labels.restaurant}</span>
      <strong>{item.nombre}</strong>
      {item.destino_nombre && (
        <span className="result-aliado-destino">
          {labels.inDestination}: {item.destino_nombre}
        </span>
      )}
      {item.ubicacion && <span className="result-aliado-location">{item.ubicacion}</span>}
      {item.descripcion && <p>{item.descripcion}</p>}
      {item.precio_referencia != null && (
        <span className="result-aliado-price">{fmt(item.precio_referencia, lang)}</span>
      )}
    </div>
  );
}

function DayCard({ day, lang, labels }) {
  const actividades = day.actividades?.length ? day.actividades : [day.actividad].filter(Boolean);

  return (
    <article className="result-day-card">
      <header className="result-day-card-head">
        <span className="result-day-num">
          {labels.day} {day.dia}
        </span>
        {day.titulo && <h3 className="result-day-title">{day.titulo}</h3>}
      </header>
      <ul className="result-day-activities">
        {actividades.map((texto) => (
          <li key={texto}>{texto}</li>
        ))}
      </ul>
      <div className="result-day-extras">
        <AliadoChip tipo="hotel" item={day.hotel} lang={lang} labels={labels} />
        <AliadoChip tipo="restaurante" item={day.restaurante} lang={lang} labels={labels} />
      </div>
    </article>
  );
}

export default function PlanResultado() {
  const { lang, ui } = useLanguage();
  const t = ui.planResult;
  const planForm = ui.plan;
  const navigate = useNavigate();
  const { state } = useLocation();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!state) {
      const fallback = buildPlanFromPreferences(null);
      setPlan(fallback);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError('');

    fetchPlanFromApi(state)
      .then((data) => {
        if (!cancelled) setPlan(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [state]);

  if (loading) {
    return (
      <div className="container page page-motion">
        <p className="hint">{t.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page page-motion">
        <p className="error-msg">{error}</p>
        <Link to="/crea-tu-plan" className="btn btn-outline">
          {t.back}
        </Link>
      </div>
    );
  }

  if (!plan) {
    navigate('/crea-tu-plan', { replace: true });
    return null;
  }

  const esPersonalizado =
    plan.tipo === 'plan_personalizado' || plan.tipo === 'asesoria';
  const {
    titulo,
    subtitulo,
    personas,
    presupuesto,
    paquete,
    itinerario,
    nota,
    paqueteId,
    mensaje,
    mensaje_ia,
  } = plan;
  const listaDias = itinerario?.length ? itinerario : plan.dias || [];
  const diasMostrar = plan.diasSolicitados ?? listaDias.length;
  const mensajePrincipal = mensaje_ia || mensaje;
  const imagenPaquete = paquete?.imagen_url || paquete?.imagen || '';
  const precioLabel =
    plan.precio_estimado != null ? fmt(plan.precio_estimado, lang) : t.priceOnRequest;
  const aliados = plan.aliados || { hoteles: [], restaurantes: [] };
  const labels = {
    day: t.day,
    hotel: t.hotel,
    restaurant: t.restaurant,
    inDestination: t.inDestination,
  };

  return (
    <div className="container page page-motion plan-result-page">
      <Reveal>
        <Link to="/crea-tu-plan" className="back-link">
          {t.back}
        </Link>
      </Reveal>

      <Reveal delay={80} variant="scale">
        <div className="result-header card">
          <span className="badge">{esPersonalizado ? t.badgeCustom : t.badge}</span>
          <h1 className="page-title">{titulo}</h1>
          <p className="page-subtitle">{subtitulo}</p>

          <div className="result-summary">
            <div className="result-summary-item">
              <span className="result-summary-label">{t.summaryDays}</span>
              <strong>{diasMostrar}</strong>
            </div>
            <div className="result-summary-item">
              <span className="result-summary-label">{t.people}</span>
              <strong>{personas}</strong>
            </div>
            <div className="result-summary-item">
              <span className="result-summary-label">{t.budget}</span>
              <strong>{fmt(presupuesto, lang)}</strong>
            </div>
            {!esPersonalizado && paquete && (
              <div className="result-summary-item result-summary-item--wide">
                <span className="result-summary-label">{t.recommended}</span>
                <strong>
                  {paquete.nombre} · {precioLabel}
                </strong>
              </div>
            )}
            {esPersonalizado && plan.destinos_resumen && (
              <div className="result-summary-item result-summary-item--wide">
                <span className="result-summary-label">{t.destinations}</span>
                <strong>{plan.destinos_resumen}</strong>
              </div>
            )}
          </div>

          <div className="result-message-block">
            <p className="result-lead">{mensajePrincipal}</p>
            {plan.gemini && mensaje_ia && (
              <p className="hint">
                {plan.gemini_personalizado ? t.geminiPersonalizedHint : t.geminiHint}
              </p>
            )}
            {esPersonalizado && plan.es_propuesta_cliente && (
              <p className="hint">{t.notCatalogPackage}</p>
            )}
            {esPersonalizado && plan.paquete_cercano && (
              <p className="hint">
                {t.nearPackage}: {plan.paquete_cercano.nombre}
              </p>
            )}
            {nota && <p className="hint result-preview-hint">{nota}</p>}
            {plan.alternativas?.length > 0 && !esPersonalizado && (
              <p className="hint">
                {t.alternatives}: {plan.alternativas.map((a) => a.nombre).join(' · ')}
              </p>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal delay={140}>
        <div className="grid-2 result-grid">
          <div className="card result-itinerary-card">
            <h2>{t.itinerary}</h2>
            <p className="result-itinerary-note">{t.itineraryNote}</p>
            <div className="result-days">
              {listaDias.map((d) => (
                <DayCard key={d.dia} day={d} lang={lang} labels={labels} />
              ))}
            </div>
          </div>

          <div className="card result-side-card">
            {!esPersonalizado && (
              <>
                <SafeImage src={imagenPaquete} alt={paquete?.nombre} className="result-img" />
                <h3>{paquete?.nombre}</h3>
                <p>{paquete?.descripcion_corta || paquete?.descripcion}</p>
                {paquete?.incluye?.length > 0 && (
                  <>
                    <h4>{ui.packageDetail.includes}</h4>
                    <ul className="result-includes">
                      {paquete.incluye.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}

            {esPersonalizado && (
              <>
                <h3>{t.customTitle}</h3>
                <p>{t.customBody}</p>
              </>
            )}

            {plan.aliados_aviso && (
              <p className="result-aliados-warn" role="status">
                {plan.aliados_aviso}
              </p>
            )}

            {(aliados.hoteles?.length > 0 || aliados.restaurantes?.length > 0) && (
              <section className="result-aliados-section">
                <h4>{t.alliesTitle}</h4>
                <p className="hint">{t.alliesHint}</p>
                {aliados.hoteles?.length > 0 && (
                  <div className="result-aliados-group">
                    <h5>{t.hotels}</h5>
                    {aliados.hoteles.map((h) => (
                      <AliadoChip key={h.id || h.nombre} tipo="hotel" item={h} lang={lang} labels={labels} />
                    ))}
                  </div>
                )}
                {aliados.restaurantes?.length > 0 && (
                  <div className="result-aliados-group">
                    <h5>{t.restaurants}</h5>
                    {aliados.restaurantes.map((r) => (
                      <AliadoChip
                        key={r.id || r.nombre}
                        tipo="restaurante"
                        item={r}
                        lang={lang}
                        labels={labels}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {plan.complementos?.length > 0 &&
              !aliados.hoteles?.length &&
              !aliados.restaurantes?.length && (
                <section className="result-aliados-section">
                  <h4>{t.extras}</h4>
                  <ul className="result-includes">
                    {plan.complementos.map((c) => (
                      <li key={c.id}>
                        {c.nombre} ({c.tipo})
                        {c.precio_referencia ? ` — ${fmt(c.precio_referencia, lang)}` : ''}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            <div className="detail-actions">
              <a
                className="btn btn-primary btn-block"
                href={whatsappUrl(buildWhatsappPlanMessage(plan, lang, t.whatsapp, planForm))}
                target="_blank"
                rel="noreferrer"
              >
                {t.confirmWhatsapp}
              </a>
              {paqueteId && (
                <Link to={`/paquetes/${paqueteId}`} className="btn btn-outline btn-block">
                  {t.viewPackage}
                </Link>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
