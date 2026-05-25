import { Link } from 'react-router-dom';
import { PHONE_DISPLAY, whatsappUrl } from '../constants/contacto';
import { useLanguage } from '../i18n/LanguageContext';

const SOCIAL_ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.2c2.7 0 3 .01 4.04.06 1.02.05 1.57.23 1.94.38.49.19.84.42 1.2.78.37.37.6.72.78 1.2.15.37.33.92.38 1.94.05 1.04.06 1.34.06 4.04s-.01 3-.06 4.04c-.05 1.02-.23 1.57-.38 1.94-.19.49-.42.84-.78 1.2-.37.37-.72.6-1.2.78-.37.15-.92.33-1.94.38-1.04.05-1.34.06-4.04.06s-3-.01-4.04-.06c-1.02-.05-1.57-.23-1.94-.38a3.2 3.2 0 0 1-1.2-.78 3.2 3.2 0 0 1-.78-1.2c-.15-.37-.33-.92-.38-1.94C2.21 15 2.2 14.7 2.2 12s.01-3 .06-4.04c.05-1.02.23-1.57.38-1.94.19-.49.42-.84.78-1.2.37-.37.72-.6 1.2-.78.37-.15.92-.33 1.94-.38C9 2.21 9.3 2.2 12 2.2zm0 1.8c-2.67 0-2.98.01-4.02.06-.98.04-1.51.2-1.87.33-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.13.36-.29.89-.33 1.87-.05 1.04-.06 1.35-.06 4.02s.01 2.98.06 4.02c.04.98.2 1.51.33 1.87.18.47.4.8.75 1.15.35.35.68.57 1.15.75.36.13.89.29 1.87.33 1.04.05 1.35.06 4.02.06s2.98-.01 4.02-.06c.98-.04 1.51-.2 1.87-.33.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.13-.36.29-.89.33-1.87.05-1.04.06-1.35.06-4.02s-.01-2.98-.06-4.02c-.04-.98-.2-1.51-.33-1.87a3.1 3.1 0 0 0-.75-1.15 3.1 3.1 0 0 0-1.15-.75c-.36-.13-.89-.29-1.87-.33-1.04-.05-1.35-.06-4.02-.06zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zm5.25-3.37a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 8.5V6.7c0-.8.17-1.2.95-1.2H16V3h-2.1C11.55 3 10 4.55 10 7.1V8.5H8v2.4h2V21h4v-10.1h2.7l.3-2.4H14z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18 5 12 5 12 5s-6 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C6 19 12 19 12 19s6 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.4 2.2 1.7 3.9 3.8 4.5V11c-1.4 0-2.7-.4-3.8-1.1v5.6c0 3.4-2.5 5.5-5.4 5.5-2.8 0-5.1-2.2-5.1-5.3 0-3.2 2.5-5.2 5.5-5.2.3 0 .7 0 1 .1v2.6c-.2 0-.4-.05-.7-.05-1.5 0-2.7 1.1-2.7 2.6s1.2 2.7 2.7 2.7c1.7 0 2.7-1.1 2.7-3V3h2z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.25 2 11.5c0 1.87.55 3.67 1.58 5.22L2 22l5.45-1.5A9.7 9.7 0 0 0 12 21c5.52 0 10-4.25 10-9.5S17.52 2 12 2zm0 17.2c-1.55 0-3.07-.42-4.4-1.2l-.32-.19-3.23.88.86-3.05-.21-.33a7.5 7.5 0 0 1-1.15-4.01c0-4.14 3.8-7.5 8.45-7.5S20.45 7.36 20.45 11.5 16.65 19.2 12 19.2zm4.55-5.62c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.57.12-.17.25-.65.8-.8.96-.15.17-.3.19-.55.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.3.37-.45.12-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.12-.57-1.36-.78-1.86-.2-.48-.41-.42-.57-.43h-.49c-.17 0-.45.06-.68.32-.23.25-.9.88-.9 2.15 0 1.27.92 2.5 1.05 2.67.12.17 1.81 2.76 4.38 3.87.61.26 1.09.42 1.46.54.61.19 1.17.16 1.61.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" />
    </svg>
  ),
};

const SOCIAL_LABELS = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  whatsapp: 'WhatsApp',
};

function FooterSocial({ className = '', site }) {
  const { social } = site;
  const items = [];

  if (social?.instagram) {
    items.push({ key: 'instagram', href: social.instagram });
  }
  if (social?.facebook) {
    items.push({ key: 'facebook', href: social.facebook });
  }
  if (social?.youtube) {
    items.push({ key: 'youtube', href: social.youtube });
  }
  if (social?.tiktok) {
    items.push({ key: 'tiktok', href: social.tiktok });
  }
  items.push({ key: 'whatsapp', href: whatsappUrl() });

  return (
    <div className={`footer-social${className ? ` ${className}` : ''}`}>
      {items.map(({ key, href }) => (
        <a
          key={key}
          className="footer-social-link"
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={SOCIAL_LABELS[key]}
        >
          {SOCIAL_ICONS[key]}
        </a>
      ))}
    </div>
  );
}

export default function Footer() {
  const { site, ui } = useLanguage();
  const year = new Date().getFullYear();
  const f = ui.footer;

  const barLinks = [
    { to: '/sobre-nosotros', label: f.aboutUs },
    { to: '/paquetes', label: f.packages },
    { to: '/blog', label: f.blog },
    { to: { pathname: '/', hash: 'contacto' }, label: f.contact },
  ];

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container footer-grid">
          <div className="footer-col footer-col--brand">
            <p className="footer-logo">
              Tours <span>Naranja</span>
            </p>
            <p className="footer-text">{f.tagline}</p>
            <ul className="footer-contact-lines">
              <li>
                <span className="footer-contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21s-7-4.5-7-11a7 7 0 1 1 14 0c0 6.5-7 11-7 11z"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    />
                    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.75" />
                  </svg>
                </span>
                {site.location}
              </li>
              <li>
                <span className="footer-contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6.5 4h2.2l1.4 3.4-1.5 1.1a12 12 0 0 0 5.8 5.8l1.1-1.5 3.4 1.4v2.2c0 .9-.7 1.6-1.6 1.7-7.8.5-14-6.7-13.4-14.4C4.9 4.7 5.6 4 6.5 4z"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <a href={whatsappUrl()} target="_blank" rel="noreferrer">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <span className="footer-contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 6.5h16v11H4V6.5z"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinejoin="round"
                    />
                    <path d="M4 7.5l8 6 8-6" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
                  </svg>
                </span>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{f.explore}</h4>
            <nav className="footer-links">
              <Link to="/paquetes">{f.packages}</Link>
              <Link to="/sobre-nosotros">{f.about}</Link>
              <Link to="/crea-tu-plan">{f.customize}</Link>
              <Link to="/blog">{f.blog}</Link>
            </nav>
          </div>

          <div className="footer-col">
            <h4>{f.contact}</h4>
            <nav className="footer-links">
              <Link to={{ pathname: '/', hash: 'contacto' }}>{f.writeUs}</Link>
              <a href={whatsappUrl()} target="_blank" rel="noreferrer">
                {f.whatsapp}
              </a>
            </nav>
            <FooterSocial site={site} />
          </div>
        </div>
      </div>

      <div className="footer-bar-wrap">
        <div className="container">
          <div className="footer-bar">
            <div className="footer-bar-top">
              <Link to="/" className="footer-bar-logo">
                Tours <span>Naranja</span>
              </Link>
              <nav className="footer-bar-nav" aria-label={f.barAria}>
                {barLinks.map((item) => (
                  <Link key={item.label} to={item.to}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="footer-bar-bottom">
              <p className="footer-copy">© {year} Tours Naranja. {f.rights}</p>
              <FooterSocial className="footer-social--bar" site={site} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
