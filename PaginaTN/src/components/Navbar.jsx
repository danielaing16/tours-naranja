import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import LangSwitcher from './LangSwitcher';
import LogoMark from './LogoMark';

export default function Navbar({ onOpenChat }) {
  const { ui } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/', label: ui.nav.home, end: true, scrollTop: true },
    { to: '/paquetes', label: ui.nav.packages },
    { to: '/sobre-nosotros', label: ui.nav.about },
    { to: '/crea-tu-plan', label: ui.nav.customize },
    { to: '/blog', label: ui.nav.blog },
    { to: { pathname: '/', hash: 'contacto' }, label: ui.nav.contact },
  ];

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleNavClick(link) {
    closeMenu();
    if (link.scrollTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <header className="navbar navbar--premium navbar--fixed">
      <div className="nav-shell">
        <NavLink to="/" className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <LogoMark size={34} className="nav-brand-icon" />
          <span className="nav-brand-text nav-brand-text--stacked">
            <span className="nav-brand-line">Tours</span>
            <span className="nav-brand-accent">Naranja</span>
          </span>
        </NavLink>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? ui.nav.closeMenu : ui.nav.openMenu}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-panel${menuOpen ? ' nav-panel--open' : ''}`}>
          <nav className="nav-menu" aria-label="Principal">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
                onClick={() => handleNavClick(l)}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <LangSwitcher />
            <button
              type="button"
              className="nav-help"
              onClick={() => {
                closeMenu();
                onOpenChat();
              }}
              aria-label={ui.nav.faq}
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4" />
                <path
                  d="M10 14v-.5M10 11c0-1.5 2-1.5 2-3a2 2 0 0 0-4 0"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
