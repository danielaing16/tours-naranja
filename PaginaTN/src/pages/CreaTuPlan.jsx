import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DestinationPicker from '../components/form/DestinationPicker';
import FormSelect from '../components/form/FormSelect';
import Reveal from '../components/ui/Reveal';
import { useLanguage } from '../i18n/LanguageContext';
import { fetchJson } from '../lib/fetchJson';

const INTEREST_IDS = [0, 1, 2, 3, 4, 5];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="page-minimal-cta-icon">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CreaTuPlan() {
  const navigate = useNavigate();
  const { site, ui } = useLanguage();
  const p = ui.plan;
  const [destinos, setDestinos] = useState([]);
  const [destinosSeleccionados, setDestinosSeleccionados] = useState([]);
  const [ayudaElegir, setAyudaElegir] = useState(false);
  const [cargandoDestinos, setCargandoDestinos] = useState(true);
  const [errorDestinos, setErrorDestinos] = useState('');

  const [presupuesto, setPresupuesto] = useState('');
  const [dias, setDias] = useState('');
  const [personas, setPersonas] = useState('2');
  const [tipoViaje, setTipoViaje] = useState('pareja');
  const [intereses, setIntereses] = useState([]);
  const [necesitaTransporte, setNecesitaTransporte] = useState('');
  const [hospedaje, setHospedaje] = useState('');
  const [gastronomiaAliados, setGastronomiaAliados] = useState('no');
  const [detallesAdicionales, setDetallesAdicionales] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchJson('/api/destinos')
      .then((data) => {
        setDestinos(Array.isArray(data) ? data : []);
        setErrorDestinos('');
      })
      .catch((e) => {
        setDestinos([]);
        setErrorDestinos(e.message || p.errorDestinosLoad);
      })
      .finally(() => setCargandoDestinos(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps -- carga única al montar
  }, []);

  // Ajustar automáticamente el número de personas según el tipo de viaje.
  // - Viaje solo  → siempre 1 persona.
  // - Pareja      → siempre 2 personas.
  useEffect(() => {
    if (tipoViaje === 'solo' && personas !== '1') {
      setPersonas('1');
    } else if (tipoViaje === 'pareja' && personas !== '2') {
      setPersonas('2');
    }
  }, [tipoViaje, personas]);

  function getPeopleOptions() {
    if (tipoViaje === 'solo') {
      return [{ value: '1', label: p.people1 }];
    }
    if (tipoViaje === 'pareja') {
      return [{ value: '2', label: p.people2 }];
    }
    // Familia / amigos: se permiten todos los tamaños de grupo.
    return [
      { value: '1', label: p.people1 },
      { value: '2', label: p.people2 },
      { value: '3', label: p.people3 },
      { value: '4', label: p.people4 },
      { value: '5+', label: p.people5 },
    ];
  }

  function toggleDestino(id) {
    setAyudaElegir(false);
    setDestinosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleAyudaElegir() {
    setAyudaElegir((prev) => {
      const next = !prev;
      if (next) setDestinosSeleccionados([]);
      return next;
    });
  }

  function toggleInteres(index) {
    setIntereses((prev) =>
      prev.includes(index) ? prev.filter((x) => x !== index) : [...prev, index]
    );
  }

  function buildFormulario() {
    return {
      destinosSeleccionados,
      ayudaElegir,
      presupuesto,
      dias: parseInt(dias, 10),
      personas,
      tipoViaje,
      intereses: intereses.map((i) => p.interests[i]),
      necesitaTransporte,
      hospedaje,
      gastronomiaAliados,
      detallesAdicionales,
    };
  }

  function validateClient() {
    if (!ayudaElegir && destinosSeleccionados.length === 0) {
      return p.errorDestinos;
    }
    if (!presupuesto || Number(presupuesto) <= 0) return p.errorBudget;
    const diasNum = parseInt(dias, 10);
    if (!dias || diasNum < 1 || diasNum > 14) return p.errorDays;
    if (intereses.length === 0) return p.errorInterests;
    if (!necesitaTransporte || !hospedaje || !gastronomiaAliados) {
      return p.errorExtras;
    }
    return '';
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validateClient();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError('');
    navigate('/crea-tu-plan/resultado', { state: buildFormulario() });
  }

  return (
    <div className="plan-page page-motion">
      <section className="plan-main">
        <div className="container section">
          <Reveal variant="scale">
            <header className="page-minimal-header plan-header">
              <div className="page-minimal-header-copy">
                <span className="page-minimal-badge">{p.badge}</span>
                <h1 className="page-minimal-title">{p.title}</h1>
                <p className="page-minimal-sub">{p.subtitle}</p>
              </div>
              <Link to="/paquetes" className="page-minimal-cta page-minimal-cta--ghost">
                {p.viewPackages}
                <ArrowIcon />
              </Link>
            </header>
          </Reveal>

          <Reveal variant="up" delay={50}>
            <aside className="plan-intro" aria-labelledby="plan-how-title">
              <h2 id="plan-how-title" className="plan-intro-title">
                {p.howItWorksTitle}
              </h2>
              <p className="plan-intro-lead">{p.howItWorksIntro}</p>
              <ul className="plan-intro-list">
                {p.howItWorksSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </aside>
          </Reveal>

          <div className="plan-layout">
            <form className="plan-form" onSubmit={handleSubmit} noValidate>
              <section className="plan-form-section">
                <div className="plan-form-section-head">
                  <span className="plan-form-step">01</span>
                  <div>
                    <h2>{p.step1Title}</h2>
                    <p>{p.step1Sub}</p>
                  </div>
                </div>
                <div className="plan-field">
                  <label id="destinos-label">{p.destinationsLabel}</label>
                  <DestinationPicker
                    destinos={destinos}
                    selected={destinosSeleccionados}
                    onToggle={toggleDestino}
                    ayudaElegir={ayudaElegir}
                    onAyudaElegir={toggleAyudaElegir}
                    loading={cargandoDestinos}
                    error={errorDestinos}
                  />
                </div>
              </section>

              <section className="plan-form-section">
                <div className="plan-form-section-head">
                  <span className="plan-form-step">02</span>
                  <div>
                    <h2>{p.step2Title}</h2>
                    <p>{p.step2Sub}</p>
                  </div>
                </div>

                <div className="plan-field">
                  <label htmlFor="presupuesto">{p.budgetLabel}</label>
                  <p className="plan-field-hint">{p.budgetHint}</p>
                  <div className="plan-input-wrap plan-input-wrap--currency">
                    <span className="plan-input-prefix" aria-hidden="true">
                      $
                    </span>
                    <input
                      id="presupuesto"
                      className="plan-input"
                      type="number"
                      min="0"
                      placeholder="1.500.000"
                      value={presupuesto}
                      onChange={(e) => setPresupuesto(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="plan-field">
                  <label htmlFor="dias">{p.daysLabel}</label>
                  <input
                    id="dias"
                    className="plan-input"
                    type="number"
                    min="1"
                    max="14"
                    placeholder={p.daysPlaceholder}
                    value={dias}
                    onChange={(e) => setDias(e.target.value)}
                    required
                  />
                </div>

                <div className="plan-field-row plan-field-row--stack-sm">
                  <FormSelect
                    id="tipoViaje"
                    label={p.tripTypeLabel}
                    value={tipoViaje}
                    onChange={(e) => setTipoViaje(e.target.value)}
                    required
                  >
                    <option value="pareja">{p.tripCouple}</option>
                    <option value="familia">{p.tripFamily}</option>
                    <option value="amigos">{p.tripFriends}</option>
                    <option value="solo">{p.tripSolo}</option>
                  </FormSelect>

                  <FormSelect
                    id="personas"
                    label={p.peopleLabel}
                    value={personas}
                    onChange={(e) => setPersonas(e.target.value)}
                    required
                  >
                    {getPeopleOptions().map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </FormSelect>
                </div>

              </section>

              <section className="plan-form-section">
                <div className="plan-form-section-head">
                  <span className="plan-form-step">03</span>
                  <div>
                    <h2>{p.step3Title}</h2>
                    <p>{p.step3Sub}</p>
                  </div>
                </div>
                <div className="plan-pills" role="group" aria-label={p.interestsAria}>
                  {INTEREST_IDS.map((i) => (
                    <button
                      key={i}
                      type="button"
                      className={`plan-pill${intereses.includes(i) ? ' is-active' : ''}`}
                      aria-pressed={intereses.includes(i)}
                      onClick={() => toggleInteres(i)}
                    >
                      {p.interests[i]}
                    </button>
                  ))}
                </div>
                {intereses.length > 0 && (
                  <div className="plan-selected-summary">
                    <p className="plan-selection-hint">{p.changeHint}</p>
                    <div className="plan-dropdown-chips">
                      {intereses.map((i) => (
                        <span key={i} className="plan-dropdown-chip">
                          {p.interests[i]}
                          <button
                            type="button"
                            className="plan-chip-remove"
                            aria-label={p.removeInterest.replace('{name}', p.interests[i])}
                            onClick={() => toggleInteres(i)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="plan-clear-link"
                      onClick={() => setIntereses([])}
                    >
                      {p.clearInterests}
                    </button>
                  </div>
                )}
              </section>

              <section className="plan-form-section">
                <div className="plan-form-section-head">
                  <span className="plan-form-step">04</span>
                  <div>
                    <h2>{p.step4Title}</h2>
                    <p>{p.step4Sub}</p>
                  </div>
                </div>

                <div className="plan-field-row plan-field-row--stack-sm">
                  <FormSelect
                    id="transporte"
                    label={p.transportLabel}
                    value={necesitaTransporte}
                    onChange={(e) => setNecesitaTransporte(e.target.value)}
                    required
                  >
                    <option value="">{p.selectOption}</option>
                    <option value="si">{p.transportYes}</option>
                    <option value="no">{p.transportNo}</option>
                    <option value="parcial">{p.transportPartial}</option>
                  </FormSelect>

                  <FormSelect
                    id="hospedaje"
                    label={p.lodgingLabel}
                    value={hospedaje}
                    onChange={(e) => setHospedaje(e.target.value)}
                    required
                  >
                    <option value="">{p.selectOption}</option>
                    <option value="si">{p.lodgingYes}</option>
                    <option value="no">{p.lodgingNo}</option>
                    <option value="ya_tengo">{p.lodgingHave}</option>
                  </FormSelect>
                </div>

                <FormSelect
                  id="gastronomia"
                  label={p.foodLabel}
                  hint={p.foodHint}
                  value={gastronomiaAliados}
                  onChange={(e) => setGastronomiaAliados(e.target.value)}
                  required
                >
                  <option value="si">{p.foodYes}</option>
                  <option value="no">{p.foodNo}</option>
                </FormSelect>

                <div className="plan-field">
                  <label htmlFor="detalles">{p.detailsLabel}</label>
                  <textarea
                    id="detalles"
                    className="plan-textarea"
                    rows={4}
                    placeholder={p.detailsPlaceholder}
                    value={detallesAdicionales}
                    onChange={(e) => setDetallesAdicionales(e.target.value)}
                  />
                </div>
              </section>

              {formError && (
                <p className="error-msg plan-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="plan-form-submit">
                <button type="submit" className="plan-submit-btn">
                  {p.submit}
                  <ArrowIcon />
                </button>
                <p className="plan-form-note">{p.submitNote}</p>
              </div>
            </form>

            <Reveal delay={120}>
              <aside className="plan-aside">
                <div className="plan-aside-card">
                  <span className="plan-aside-badge">{p.tipsBadge}</span>
                  <h2>{p.tipsTitle}</h2>
                  <ul className="plan-aside-list">
                    {p.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                  <p className="plan-aside-foot">{site.location}</p>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
