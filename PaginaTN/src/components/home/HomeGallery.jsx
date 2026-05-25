import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../SafeImage';
import Reveal from '../ui/Reveal';
import { useLanguage } from '../../i18n/LanguageContext';

const HIGHLIGHT_ICONS = {
  heritage: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20h16M6 20V9l6-4 6 4v11" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M10 20v-5h4v5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  ),
  food: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 4v8M6 4v4M10 4v4M8 12v8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path
        d="M14 4c2 0 3 1.6 3 4.5V20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  ),
  nature: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21V9M12 9C9 9 6.5 7 6 4c3 .5 5 2.5 6 5 1-2.5 3-4.5 6-5-.5 3-3 5-6 5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  ),
  groups: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="16" cy="10" r="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M4.5 19.5c0-2.8 2.5-4.5 4.5-4.5s4.2 1.8 4.5 4.5M13.5 15c2.2 0 4 1.6 4 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  ),
  adventure: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 4 21h16L12 3z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
};

export default function HomeGallery() {
  const { site, ui } = useLanguage();
  const { gallery } = site;
  const items = gallery.items.filter((i) => i.type === 'image');
  const stripItems = useMemo(() => [...items, ...items], [items]);

  if (!items.length) return null;

  const poster = gallery.videoPoster || items[0]?.src;

  return (
    <section className="home-gallery" aria-label={gallery.title}>
      <div className="home-gallery-split">
        <Reveal variant="left" className="home-gallery-col">
          <div className="home-gallery-media">
            <div className="home-gallery-video">
              {gallery.videoUrl ? (
                <video
                  className="home-gallery-video-el"
                  src={gallery.videoUrl}
                  poster={poster}
                  controls
                  playsInline
                  muted
                  autoPlay
                  loop
                  preload="metadata"
                />
              ) : (
                <>
                  <SafeImage src={poster} alt={ui.home.galleryVideoAlt} className="home-gallery-video-poster" />
                  <span className="home-gallery-video-badge" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7L8 5z" />
                    </svg>
                  </span>
                </>
              )}
            </div>

            <div className="home-gallery-strip">
              <div className="home-gallery-strip-track">
                {stripItems.map((item, i) => (
                  <figure key={`${item.src}-${i}`} className="home-gallery-strip-item">
                    <SafeImage src={item.src} alt={item.alt} />
                    {item.caption && <figcaption>{item.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal variant="right" delay={120} className="home-gallery-col">
          <div className="home-gallery-panel">
            <h2 className="home-gallery-panel-title">{gallery.title}</h2>
            <p className="home-gallery-panel-text">{gallery.subtitle}</p>
            <hr className="home-gallery-divider" />
            <ul className="home-gallery-highlights">
              {(gallery.highlights || []).map((item) => (
                <li key={item.label}>
                  <span className="home-gallery-highlight-icon">{HIGHLIGHT_ICONS[item.icon] || HIGHLIGHT_ICONS.heritage}</span>
                  <span className="home-gallery-highlight-label">{item.label}</span>
                </li>
              ))}
            </ul>
            <Link to="/paquetes" className="home-gallery-panel-cta">
              {ui.home.galleryCta}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
