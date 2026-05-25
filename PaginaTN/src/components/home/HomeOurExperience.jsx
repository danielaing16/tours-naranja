import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import { useLanguage } from '../../i18n/LanguageContext';

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
      d="M12 3.5 4 7v5.5c0 4.6 3.4 8.2 8 9.7 4.6-1.5 8-5.1 8-9.7V7l-8-3.5z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
    <path d="M9.5 12.5 11 14l3.5-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

export default function HomeOurExperience() {
  const { site, ui } = useLanguage();
  const { ourExperience } = site;

  return (
    <section className="home-experience">
      <div className="container">
        <Reveal>
          <div className="home-experience-panel">
            <div className="home-experience-copy">
              <div className="home-experience-mark" aria-hidden="true">
                <span className="home-experience-mark-arc" />
                <span className="home-experience-mark-dot" />
                <span className="home-experience-mark-dot" />
                <span className="home-experience-mark-dot" />
              </div>
              <span className="home-experience-eyebrow">{ui.home.experienceEyebrow}</span>
              <h2 className="home-experience-title">{ourExperience.title}</h2>
              <p className="home-experience-sub">{ourExperience.subtitle}</p>
              <Link to={ourExperience.ctaLink} className="home-experience-btn">
                {ourExperience.cta}
              </Link>
            </div>

            <div className="home-experience-stats-wrap">
              <div className="home-experience-stats-deco" aria-hidden="true" />
              <div className="home-experience-stats">
                {ourExperience.stats.map((stat, i) => (
                  <Reveal key={stat.label} delay={80 + i * 80}>
                    <article className="home-experience-stat">
                      <span className="home-experience-stat-icon">{STAT_ICONS[i % STAT_ICONS.length]}</span>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
