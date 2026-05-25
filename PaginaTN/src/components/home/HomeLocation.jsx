import Reveal from '../ui/Reveal';
import ContactForm from '../ContactForm';
import { PHONE_DISPLAY, whatsappUrl } from '../../constants/contacto';
import { useLanguage } from '../../i18n/LanguageContext';

export default function HomeLocation() {
  const { site, ui } = useLanguage();
  const { contactSection } = site;
  const h = ui.home;

  return (
    <section id="contacto" className="home-location" aria-labelledby="contacto-title">
      <div
        className="home-location-bg"
        style={{ backgroundImage: `url(${contactSection.backgroundImage})` }}
        aria-hidden="true"
      />
      <div className="home-location-overlay" aria-hidden="true" />

      <div className="container home-location-inner">
        <Reveal className="home-location-copy">
          <span className="home-location-eyebrow">{h.contactEyebrow}</span>
          <h2 id="contacto-title" className="home-location-title">
            {contactSection.title}
          </h2>
          <p className="home-location-sub">{contactSection.subtitle}</p>

          <dl className="home-location-details">
            <div className="home-location-detail">
              <dt>{h.contactOffice}</dt>
              <dd>{site.location}</dd>
            </div>
            <div className="home-location-detail">
              <dt>{h.contactEmail}</dt>
              <dd>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
            <div className="home-location-detail">
              <dt>{h.contactPhone}</dt>
              <dd>
                <a href="tel:+573022266184">{PHONE_DISPLAY}</a>
              </dd>
            </div>
            <div className="home-location-detail">
              <dt>{h.contactHours}</dt>
              <dd>{contactSection.hours}</dd>
            </div>
          </dl>

          <div className="home-location-actions">
            <a
              className="home-location-btn home-location-btn--primary"
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.25 2 11.5c0 1.87.55 3.67 1.58 5.22L2 22l5.45-1.5A9.7 9.7 0 0 0 12 21c5.52 0 10-4.25 10-9.5S17.52 2 12 2zm4.55 13.38c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.57.12-.17.25-.65.8-.8.96-.15.17-.3.19-.55.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.3.37-.45.12-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.12-.57-1.36-.78-1.86-.2-.48-.41-.42-.57-.43h-.49c-.17 0-.45.06-.68.32-.23.25-.9.88-.9 2.15 0 1.27.92 2.5 1.05 2.67.12.17 1.81 2.76 4.38 3.87.61.26 1.09.42 1.46.54.61.19 1.17.16 1.61.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" />
              </svg>
              {h.contactWhatsapp}
            </a>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="home-location-panel">
            <p className="home-location-panel-label">{h.contactWriteUs}</p>
            <ContactForm compact />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
