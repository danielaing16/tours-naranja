import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import SafeImage from '../SafeImage';
import { useLanguage } from '../../i18n/LanguageContext';

export default function HomeHowItWorks() {
  const { site, ui } = useLanguage();
  const { howItWorks } = site;

  return (
    <section className="home-how">
      <div className="home-how-deco home-how-deco--right" aria-hidden="true" />
      <div className="home-how-deco home-how-deco--left" aria-hidden="true" />

      <div className="container">
        <Reveal>
          <header className="home-how-head">
            <span className="home-how-eyebrow">{ui.home.howEyebrow}</span>
            <h2 className="home-how-title">{howItWorks.title}</h2>
            {howItWorks.subtitle && <p className="home-how-lead">{howItWorks.subtitle}</p>}
          </header>
        </Reveal>

        <div className="home-how-timeline">
          {howItWorks.steps.map((step, i) => (
            <Fragment key={step.title}>
              {i > 0 && <span className="home-how-connector home-how-connector--h" aria-hidden="true" />}
              <Reveal delay={i * 120} variant={i % 2 === 0 ? 'left' : 'right'}>
                <article className="home-how-row">
                  <div className="home-how-media">
                    <div className="home-how-photo">
                      <SafeImage src={step.image} alt={step.alt || step.title} />
                    </div>
                  </div>

                  <div className="home-how-body">
                    <span className="home-how-step-label">
                      {ui.home.stepLabel} {step.num}. {step.title}
                    </span>
                    <p className="home-how-text">{step.text}</p>
                    <Link to={step.link} className="home-how-link">
                      {step.linkLabel}
                      <span aria-hidden="true"> ›</span>
                    </Link>
                  </div>
                </article>
              </Reveal>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
