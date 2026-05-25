import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { whatsappUrl } from '../constants/contacto';
import { fetchJson } from '../lib/fetchJson';
import { useLanguage } from '../i18n/LanguageContext';

const WHATSAPP_URL = whatsappUrl('Hola, tengo una consulta sobre Tours Naranja');

export default function Chatbot({ open, onClose }) {
  const { ui } = useLanguage();
  const c = ui.chatbot;
  const [messages, setMessages] = useState([
    { from: 'bot', text: c.welcome },
  ]);
  const [faq, setFaq] = useState([]);
  const [cargandoFaq, setCargandoFaq] = useState(true);
  const [errorFaq, setErrorFaq] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    fetchJson('/api/faq')
      .then((data) => {
        const items = (Array.isArray(data) ? data : []).map((f) => ({
          id: f.id,
          label: f.pregunta,
          respuesta: f.respuesta,
        }));
        setFaq(items);
        setErrorFaq('');
      })
      .catch((e) => {
        setFaq([]);
        setErrorFaq(e.message || c.errorLoad);
      })
      .finally(() => setCargandoFaq(false));
  }, [open, c.errorLoad]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function pickFaq(item) {
    setMessages((m) => [
      ...m,
      { from: 'user', text: item.label },
      { from: 'bot', text: item.respuesta },
    ]);
  }

  if (!open) return null;

  const hayConversacion = messages.length > 1;

  return (
    <div className="chat-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={c.ariaLabel}>
      <div className="chat-panel" onClick={(e) => e.stopPropagation()}>
        <header className="chat-header">
          <div className="chat-header-brand">
            <span className="chat-avatar" aria-hidden>
              TN
            </span>
            <div className="chat-header-text">
              <strong>{c.title}</strong>
              <span className="chat-header-sub">{c.subtitle}</span>
            </div>
          </div>
          <button type="button" className="chat-close" onClick={onClose} aria-label={c.close}>
            ×
          </button>
        </header>

        <div className="chat-body">
          <section
            className={`chat-conversation${hayConversacion ? ' chat-conversation--active' : ''}`}
            aria-live="polite"
          >
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={`${msg.from}-${i}`} className={`chat-bubble-wrap ${msg.from}`}>
                  <p className={`chat-bubble ${msg.from}`}>{msg.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </section>

          <section className="chat-faq-section" aria-labelledby="chat-faq-heading">
            <div className="chat-faq-head">
              <h2 id="chat-faq-heading" className="chat-faq-title">
                {c.faqTitle}
              </h2>
              <p className="chat-faq-intro">{c.faqIntro}</p>
            </div>

            <div className="chat-faq-grid">
              {cargandoFaq && <p className="chat-hint">{c.loading}</p>}
              {errorFaq && (
                <p className="chat-hint chat-hint-error" role="alert">
                  {errorFaq}
                </p>
              )}
              {!cargandoFaq &&
                !errorFaq &&
                faq.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="chat-faq-item"
                    onClick={() => pickFaq(f)}
                  >
                    <span className="chat-faq-item-q">{f.label}</span>
                    <span className="chat-faq-item-arrow" aria-hidden>
                      →
                    </span>
                  </button>
                ))}
              {!cargandoFaq && !errorFaq && faq.length === 0 && (
                <p className="chat-hint">{c.empty}</p>
              )}
            </div>
          </section>
        </div>

        <footer className="chat-footer">
          <p className="chat-footer-note">{c.footerNote}</p>
          <div className="chat-footer-actions">
            <Link to="/crea-tu-plan" className="btn btn-outline chat-btn-secondary" onClick={onClose}>
              {c.customize}
            </Link>
            <a className="btn btn-primary chat-btn-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              {c.whatsapp}
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function ChatFab({ onOpen }) {
  const { ui } = useLanguage();
  return (
    <button type="button" className="chat-fab" onClick={onOpen} aria-label={ui.chatbot.openFab}>
      <span className="chat-fab-icon" aria-hidden>
        💬
      </span>
      <span className="chat-fab-label">{ui.chatbot.fabLabel}</span>
    </button>
  );
}
