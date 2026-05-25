import { Link } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import HomePresentation from '../components/home/HomePresentation';
import HomeGallery from '../components/home/HomeGallery';
import HomeWhyUs from '../components/home/HomeWhyUs';
import HomeHowItWorks from '../components/home/HomeHowItWorks';
import HomeOurExperience from '../components/home/HomeOurExperience';
import HomeLocation from '../components/home/HomeLocation';
import Reveal from '../components/ui/Reveal';
import { PageLoading } from '../components/ui/PageState';
import { useLanguage } from '../i18n/LanguageContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchPaquetesDestacados } from '../services/paquetesService';

export default function Home() {
  const { site, ui } = useLanguage();
  const { data: destacados, loading: loadingP } = useAsyncData(() => fetchPaquetesDestacados(3), []);
  const { hero } = site;

  return (
    <div className="home-page">
      <section className="hero hero--cover hero--home" aria-label={hero.imageAlt}>
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${hero.image})` }}
          aria-hidden="true"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container hero-content hero-content--centered hero-content--dynamic">
          <p className="hero-overline hero-anim hero-anim--1">{hero.overline}</p>
          <h1 className="hero-title">
            <span className="hero-title-line hero-anim hero-anim--2">{hero.titleLine1}</span>
            <span className="hero-title-highlight hero-anim hero-anim--3">{hero.titleHighlight}</span>
          </h1>
          <p className="hero-lead hero-anim hero-anim--4">{hero.subtitle}</p>
          <Link to="/paquetes" className="btn btn-primary btn-hero btn-hero-pulse">
            {hero.cta}
          </Link>
        </div>
      </section>

      <HomePresentation />

      <section className="home-packages">
        <div className="container section">
          <Reveal>
            <header className="home-packages-head">
              <div className="home-packages-head-text">
                <span className="home-packages-eyebrow">{ui.home.packagesEyebrow}</span>
                <h2 className="home-packages-title">{ui.home.packagesTitle}</h2>
                <p className="home-packages-sub">{ui.home.packagesSub}</p>
              </div>
              <Link to="/paquetes" className="btn-ver-mas">
                {ui.home.verMas}
              </Link>
            </header>
          </Reveal>
          {loadingP ? (
            <PageLoading message={ui.home.loadingPackages} />
          ) : (destacados ?? []).length === 0 ? (
            <p className="hint">{ui.home.noPackages}</p>
          ) : (
            <div className="grid-3 home-packages-grid">
              {destacados.map((p, i) => (
                <Reveal key={p.id} variant="scale" delay={i * 90}>
                  <PackageCard p={p} accent={i} variant="overlay" />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <HomeGallery />
      <HomeWhyUs />
      <HomeHowItWorks />
      <HomeOurExperience />
      <HomeLocation />
    </div>
  );
}
