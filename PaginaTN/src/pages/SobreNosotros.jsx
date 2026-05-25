import { Link } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import { useLanguage } from '../i18n/LanguageContext';

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="page-minimal-cta-icon">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const STAT_ICONS = [
  <svg key="trips" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.75" />
    <path d="M12 7v5.2l3.2 1.8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>,
  <svg key="events" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.75" />
    <circle cx="16" cy="10" r="2" stroke="currentColor" strokeWidth="1.75" />
    <path
      d="M4.5 19.5c0-2.8 2.5-4.5 4.5-4.5s4.2 1.8 4.5 4.5M13.5 15c2.2 0 4 1.6 4 4.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>,
  <svg key="projects" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 18V8l8-4 8 4v10M8 14h8M8 10h5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
];

const CONTACTO = { pathname: '/', hash: 'contacto' };

export default function SobreNosotros() {
  const { site } = useLanguage();
  const { about, ourExperience } = site;
  const stats = ourExperience.stats;

  return (
    <div className="about-page page-motion">
      <div className="about-page-texture" aria-hidden="true" />

      <section className="about-main">
        <div className="container section">
          <Reveal variant="scale">
            <header className="about-hero">
              <div className="about-hero-main">
                <span className="about-eyebrow">{about.eyebrow}</span>
                <h1 className="about-hero-title">{about.title}</h1>
                <p className="about-hero-sub">{about.subtitle}</p>
              </div>
              <Link to={CONTACTO} className="about-hero-cta">
                {about.ctaHeader}
                <ArrowIcon />
              </Link>
            </header>
          </Reveal>

          <Reveal delay={60}>
            <ul className="about-values" aria-label="Valores">
              {about.values.map((v) => (
                <li key={v}>
                  <span className="about-value-chip">{v}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={90}>
            <blockquote className="about-intro-card">
              <span className="about-intro-deco" aria-hidden="true" />
              <p>{about.intro}</p>
            </blockquote>
          </Reveal>

          <Reveal delay={120}>
            <div className="about-stats-panel">
              <div className="about-stats-panel-deco" aria-hidden="true" />
              <div className="about-stats">
                {stats.map((stat, i) => (
                  <article key={stat.label} className="about-stat">
                    <span className="about-stat-icon">{STAT_ICONS[i % STAT_ICONS.length]}</span>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </article>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="about-sections">
            {about.sections.map((s, i) => (
              <Reveal key={s.heading} variant={i % 2 === 0 ? 'left' : 'right'} delay={80 + i * 70}>
                <article className="about-section-card">
                  <span className="about-section-index">{String(i + 1).padStart(2, '0')}</span>
                  <h2>{s.heading}</h2>
                  <p>{s.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reveal>
        <section className="about-cta-band">
          <div className="about-cta-band-texture" aria-hidden="true" />
          <div className="container about-cta-band-inner">
            <div className="about-cta-copy">
              <h2>{about.ctaTitle}</h2>
              <p>{about.ctaText}</p>
            </div>
            <div className="about-cta-actions">
              <Link to="/paquetes" className="about-cta-btn about-cta-btn--primary">
                {about.ctaPaquetes}
              </Link>
              <Link to={CONTACTO} className="about-cta-btn about-cta-btn--outline">
                {about.ctaContacto}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
