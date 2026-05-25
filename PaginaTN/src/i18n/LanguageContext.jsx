import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { site as siteEs } from '../config/site';
import siteEn from './site.en';
import uiEs from './ui.es';
import uiEn from './ui.en';

const STORAGE_KEY = 'toursnaranja-lang';

const LOCALES = {
  es: { site: siteEs, ui: uiEs },
  en: { site: siteEn, ui: uiEn },
};

const LanguageContext = createContext(null);

function readStoredLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'es') return stored;
  } catch {
    /* ignore */
  }
  return 'es';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang);

  const setLang = useCallback((next) => {
    const value = next === 'en' ? 'en' : 'es';
    setLangState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => {
    const bundle = LOCALES[lang] ?? LOCALES.es;
    return {
      lang,
      setLang,
      site: bundle.site,
      ui: bundle.ui,
    };
  }, [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}

/** Para componentes fuera del provider (p. ej. admin) — siempre español */
export function useLanguageOptional() {
  const ctx = useContext(LanguageContext);
  if (ctx) return ctx;
  return { lang: 'es', setLang: () => {}, site: siteEs, ui: uiEs };
}
