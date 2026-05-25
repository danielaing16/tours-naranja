import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={`plan-dropdown-chevron${open ? ' is-open' : ''}`}
    >
      <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="plan-dropdown-check">
      <path d="M5.5 10.2 8.4 13 14.5 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChipRemove({ label, onClick }) {
  return (
    <button type="button" className="plan-chip-remove" onClick={onClick} aria-label={label}>
      ×
    </button>
  );
}

export default function DestinationPicker({
  destinos,
  selected,
  onToggle,
  ayudaElegir,
  onAyudaElegir,
  loading,
  error,
}) {
  const { ui } = useLanguage();
  const d = ui.plan.dropdown;
  const [open, setOpen] = useState(false);
  const [opensAbove, setOpensAbove] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const MOBILE_QUERY = '(max-width: 960px)';

  function isMobileViewport() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  function updatePanelLayout() {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel || !open || isMobileViewport()) return;

    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 16;
    const spaceAbove = rect.top - 16;
    const openUp = spaceBelow < 220 && spaceAbove > spaceBelow;

    setOpensAbove(openUp);
    panel.style.maxHeight = `${Math.max(160, Math.min(340, openUp ? spaceAbove : spaceBelow))}px`;
  }

  useEffect(() => {
    function handlePointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('touchstart', handlePointerDown, { passive: true });
    }
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    if (!isMobileViewport()) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    updatePanelLayout();
    const frame = requestAnimationFrame(updatePanelLayout);
    window.addEventListener('resize', updatePanelLayout);
    window.addEventListener('scroll', updatePanelLayout, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', updatePanelLayout);
      window.removeEventListener('scroll', updatePanelLayout, true);
      if (panelRef.current) {
        panelRef.current.style.maxHeight = '';
      }
      setOpensAbove(false);
    };
  }, [open, destinos.length]);

  useEffect(() => {
    if (!open) return undefined;
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const selectedNames = destinos.filter((item) => selected.includes(item.id)).map((item) => item.nombre);

  let triggerText = d.placeholder;
  if (ayudaElegir) triggerText = d.helpSelected;
  else if (selected.length === 1) triggerText = selectedNames[0];
  else if (selected.length > 1) triggerText = d.multi.replace('{n}', String(selected.length));

  return (
    <div className="plan-dropdown" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`plan-dropdown-trigger${open ? ' is-open' : ''}${selected.length || ayudaElegir ? ' has-value' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="plan-destinos-listbox"
        onClick={() => !loading && setOpen((v) => !v)}
        disabled={loading}
      >
        <span className="plan-dropdown-trigger-text">{loading ? d.loading : triggerText}</span>
        <ChevronIcon open={open} />
      </button>

      {error && (
        <p className="plan-field-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (selected.length > 0 || ayudaElegir) && (
        <div className="plan-dropdown-chips" aria-live="polite">
          <p className="plan-selection-hint">{d.changeHint}</p>
          {ayudaElegir ? (
            <span className="plan-dropdown-chip plan-dropdown-chip--help">
              {d.helpChip}
              <ChipRemove label={d.removeHelp} onClick={onAyudaElegir} />
            </span>
          ) : (
            destinos
              .filter((item) => selected.includes(item.id))
              .map((item) => (
                <span key={item.id} className="plan-dropdown-chip">
                  {item.nombre}
                  <ChipRemove
                    label={d.removeDestino.replace('{name}', item.nombre)}
                    onClick={() => onToggle(item.id)}
                  />
                </span>
              ))
          )}
        </div>
      )}

      {open && !loading && !error && (
        <>
          <button
            type="button"
            className="plan-dropdown-backdrop"
            aria-label={d.close}
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            id="plan-destinos-listbox"
            className={`plan-dropdown-panel${opensAbove ? ' plan-dropdown-panel--above' : ''}`}
            role="listbox"
            aria-multiselectable="true"
            aria-label={d.available}
          >
            <p className="plan-dropdown-panel-title">{d.available}</p>
            <ul className="plan-dropdown-list">
              {destinos.map((item) => {
                const isSelected = selected.includes(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`plan-dropdown-option${isSelected ? ' is-selected' : ''}`}
                      onClick={() => onToggle(item.id)}
                    >
                      <span className="plan-dropdown-option-main">
                        <strong>{item.nombre}</strong>
                        {item.descripcion_corta && <span>{item.descripcion_corta}</span>}
                      </span>
                      <span className="plan-dropdown-option-mark">{isSelected && <CheckIcon />}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="plan-dropdown-footer">
              <button
                type="button"
                className={`plan-dropdown-help${ayudaElegir ? ' is-active' : ''}`}
                onClick={() => {
                  onAyudaElegir();
                  if (ayudaElegir) setOpen(false);
                }}
              >
                {ayudaElegir ? d.helpBtnActive : d.helpBtn}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
