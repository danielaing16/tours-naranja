import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function ContactForm({ compact = false }) {
  const { ui } = useLanguage();
  const t = ui.contactForm;
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setExito('');
    setError('');

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, mensaje }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t.errorSend);
      }

      setExito(data.mensaje || t.success);
      setNombre('');
      setEmail('');
      setMensaje('');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  const formClass = compact ? 'home-contact-form' : 'contact-form';

  return (
    <form className={formClass} onSubmit={handleSubmit}>
      {exito && (
        <p className="form-success" role="status">
          {exito}
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className={compact ? 'home-contact-field' : 'field'}>
        <label htmlFor={compact ? 'contact-nombre' : 'nombre'}>{t.name}</label>
        <input
          id={compact ? 'contact-nombre' : 'nombre'}
          type="text"
          placeholder={t.namePlaceholder}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className={compact ? 'home-contact-field' : 'field'}>
        <label htmlFor={compact ? 'contact-email' : 'email'}>{t.email}</label>
        <input
          id={compact ? 'contact-email' : 'email'}
          type="email"
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={compact ? 'home-contact-field' : 'field'}>
        <label htmlFor={compact ? 'contact-mensaje' : 'mensaje'}>{t.message}</label>
        <textarea
          id={compact ? 'contact-mensaje' : 'mensaje'}
          rows={compact ? 4 : 5}
          placeholder={t.messagePlaceholder}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          required
        />
      </div>

      <button type="submit" className={compact ? 'home-contact-submit' : 'btn btn-primary btn-block'} disabled={enviando}>
        {enviando ? t.sending : t.submit}
      </button>
    </form>
  );
}
