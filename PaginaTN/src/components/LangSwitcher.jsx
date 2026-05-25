import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function LangSwitcher() {
  const { lang, setLang, ui } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function handlePointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  function pick(next) {
    setLang(next);
    setOpen(false);
  }

  return (
    <div className="nav-lang-wrap" ref={rootRef}>
      <button
        type="button"
        className={`nav-lang${open ? ' is-open' : ''}`}
        aria-label={`${ui.nav.langLabel}: ${lang === 'es' ? ui.nav.langEs : ui.nav.langEn}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="nav-lang-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M2 10h16M10 2c2.5 2.8 3.8 5.6 4 8s-1.5 5.2-4 8M10 2c-2.5 2.8-3.8 5.6-4 8s1.5 5.2 4 8"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
        <span>{lang.toUpperCase()}</span>
        <svg className="nav-chevron" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <ul className="nav-lang-menu" role="listbox" aria-label={ui.nav.langLabel}>
          <li role="option" aria-selected={lang === 'es'}>
            <button type="button" className={`nav-lang-option${lang === 'es' ? ' is-active' : ''}`} onClick={() => pick('es')}>
              {ui.nav.langEs}
            </button>
          </li>
          <li role="option" aria-selected={lang === 'en'}>
            <button type="button" className={`nav-lang-option${lang === 'en' ? ' is-active' : ''}`} onClick={() => pick('en')}>
              {ui.nav.langEn}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
