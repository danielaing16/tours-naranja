import { useLanguage } from '../../i18n/LanguageContext';
import Reveal from '../ui/Reveal';

function PinIcon() {
  return (
    <svg className="home-presentation-bar-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.25" fill="currentColor" />
    </svg>
  );
}

export default function HomePresentation() {
  const { site, ui } = useLanguage();
  const { presentation } = site;
  const h = ui.home;

  return (
    <section className="home-presentation" aria-label={h.presentationAria}>
      <Reveal variant="scale" className="home-presentation-reveal">
        <div className="home-presentation-inner">
          <div className="home-presentation-layout">
            <div className="home-presentation-about home-pres-anim home-pres-anim--1">
              <PinIcon />
              <div className="home-presentation-seg-text">
                <span className="home-presentation-seg-label">{h.presentationWho}</span>
                <span className="home-presentation-seg-value home-presentation-seg-value--about">
                  {presentation.title}
                </span>
              </div>
            </div>

            <div className="home-presentation-bar">
              <div className="home-presentation-seg home-pres-anim home-pres-anim--2">
                <div className="home-presentation-seg-text">
                  <span className="home-presentation-seg-label">{h.presentationLocal}</span>
                  <span className="home-presentation-seg-value">{presentation.line1}</span>
                </div>
              </div>

              <div className="home-presentation-seg home-pres-anim home-pres-anim--3">
                <div className="home-presentation-seg-text">
                  <span className="home-presentation-seg-label">{h.presentationExperiences}</span>
                  <span className="home-presentation-seg-value">{presentation.line2}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
