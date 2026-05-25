import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import { useLanguage } from '../../i18n/LanguageContext';

const ICONS = [
  <svg key="chat" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7 18.5l-2.5 2.5V6.8A3.8 3.8 0 0 1 8.3 3h7.4A3.8 3.8 0 0 1 19.5 6.8v6.4a3.8 3.8 0 0 1-3.8 3.8H9.2L7 18.5z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
    <path d="M8.5 8.5h7M8.5 11.5h4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>,
  <svg key="shield" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2.5l8 3.2v5.8c0 5.2-3.6 9.2-8 10.5-4.4-1.3-8-5.3-8-10.5V5.7l8-3.2z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 12.2l2 2 4-4.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  <svg key="award" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.75" />
    <path
      d="M8.2 16.2 7 21l5-2.5L17 21l-1.2-4.8"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  <svg key="guides" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.75" />
    <path
      d="M5.5 20.5c0-3 2.9-5.5 6.5-5.5s6.5 2.5 6.5 5.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>,
];

const PALETTES = ['orange', 'yellow', 'orange-alt', 'yellow'];

export default function HomeWhyUs() {
  const { site, ui } = useLanguage();
  const { whyUs } = site;

  return (
    <section className="home-why">
      <div className="container">
        <Reveal>
          <header className="home-why-head">
            <span className="home-why-eyebrow">{ui.home.whyEyebrow}</span>
            <h2 className="home-why-title">{whyUs.title}</h2>
          </header>
        </Reveal>
      </div>

      <div className="home-why-band">
        {whyUs.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 70} variant="scale">
            <article className={`home-why-panel home-why-panel--${PALETTES[i % PALETTES.length]}`}>
              <div className="home-why-panel-icon">{ICONS[i % ICONS.length]}</div>
              <h3 className="home-why-panel-title">{item.title}</h3>
              <p className="home-why-panel-text">{item.text}</p>
              {item.link && (
                <Link to={item.link} className="home-why-panel-link">
                  {item.linkLabel || ui.home.verMasLink}
                  <span aria-hidden="true"> ›</span>
                </Link>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
