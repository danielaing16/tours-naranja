import { useLanguage } from '../i18n/LanguageContext';

export default function TrustStrip() {
  const { site } = useLanguage();
  return (
    <section className="trust-strip" aria-label="Por qué Tours Naranja">
      <div className="container trust-strip-inner">
        {site.trust.map((item) => (
          <div key={item.label} className="trust-item">
            <span className="trust-label">{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
