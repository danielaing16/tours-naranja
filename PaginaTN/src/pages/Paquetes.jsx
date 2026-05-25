import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import Reveal from '../components/ui/Reveal';
import { PageEmpty, PageError, PageLoading } from '../components/ui/PageState';
import { whatsappUrl } from '../constants/contacto';
import { useLanguage } from '../i18n/LanguageContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchPaquetes } from '../services/paquetesService';

const CONTACTO = { pathname: '/', hash: 'contacto' };

function packageCategory(p) {
  return p.intereses?.[0] || p.ritmo || '';
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="page-minimal-cta-icon">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Paquetes() {
  const { site, ui } = useLanguage();
  const { paquetesPage } = site;
  const t = ui.paquetes;
  const { data: paquetes, loading, error } = useAsyncData(() => fetchPaquetes(), []);
  const [filter, setFilter] = useState('all');

  const categories = useMemo(() => {
    const tags = new Set();
    (paquetes ?? []).forEach((p) => {
      const tag = packageCategory(p);
      if (tag) tags.add(tag);
    });
    return Array.from(tags);
  }, [paquetes]);

  const filtered = useMemo(() => {
    if (!paquetes) return [];
    if (filter === 'all') return paquetes;
    return paquetes.filter((p) => packageCategory(p).toLowerCase() === filter.toLowerCase());
  }, [paquetes, filter]);

  return (
    <div className="paquetes-page page-motion">
      <section className="paquetes-catalog">
        <div className="container section paquetes-main">
          <Reveal variant="scale">
            <header className="paquetes-header">
              <div className="paquetes-header-copy">
                <span className="paquetes-header-badge">{paquetesPage.eyebrow}</span>
                <h1 className="paquetes-header-title">{paquetesPage.title}</h1>
                <p className="paquetes-header-sub">{paquetesPage.subtitle}</p>
              </div>
              <Link to="/crea-tu-plan" className="paquetes-header-cta">
                {t.customizeTrip}
                <ArrowIcon />
              </Link>
            </header>
          </Reveal>

          {!loading && !error && (paquetes?.length ?? 0) > 0 && (
            <Reveal delay={80}>
              <div className="paquetes-header-bar">
                <div className="paquetes-filters" role="tablist" aria-label={t.filterAria}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={filter === 'all'}
                    className={`paquetes-filter-chip${filter === 'all' ? ' is-active' : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    {t.filterAll}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={filter === cat}
                      className={`paquetes-filter-chip${filter === cat ? ' is-active' : ''}`}
                      onClick={() => setFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <p className="paquetes-header-count">
                  {filtered.length} {filtered.length === 1 ? t.experience : t.experiences}
                </p>
              </div>
            </Reveal>
          )}

          {loading && <PageLoading message={t.loading} />}
          {error && (
            <PageError
              message={error}
              hint={t.errorHint}
              action={
                <Link to={CONTACTO} className="btn btn-outline">
                  {t.contact}
                </Link>
              }
            />
          )}
          {!loading && !error && (paquetes?.length ?? 0) === 0 && (
            <PageEmpty title={t.emptyTitle} message={t.emptyMessage} />
          )}
          {!loading && !error && (paquetes?.length ?? 0) > 0 && filtered.length === 0 && (
            <PageEmpty title={t.noResultsTitle} message={t.noResultsMessage} />
          )}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid-3 home-packages-grid paquetes-grid">
              {filtered.map((p, i) => (
                <Reveal key={p.id} variant="scale" delay={i * 70}>
                  <PackageCard p={p} accent={i} variant="overlay" activeLabel hideLabel />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <Reveal>
        <section className="paquetes-cta">
          <div className="container paquetes-cta-inner">
            <div className="paquetes-cta-copy">
              <h2>{paquetesPage.ctaTitle}</h2>
              <p>{paquetesPage.ctaText}</p>
            </div>
            <div className="paquetes-cta-actions">
              <a
                className="paquetes-cta-btn paquetes-cta-btn--primary"
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
              >
                {paquetesPage.ctaWhatsapp}
              </a>
              <Link to="/crea-tu-plan" className="paquetes-cta-btn paquetes-cta-btn--outline">
                {paquetesPage.ctaPersonaliza}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
