import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoMark from '../../components/LogoMark';
import { apiUrl } from '../../lib/apiUrl.js';
import { setAdminSession } from '../../utils/adminApi';

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="admin-login-field-icon">
      <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 5.5 10 10.5l6.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="admin-login-field-icon">
      <rect x="4.5" y="9" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 9V6.5a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="admin-login-eye">
      <path d="M2.5 10s2.5-5 7.5-5 7.5 5 7.5 5-2.5 5-7.5 5-7.5-5-7.5-5z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const res = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo iniciar sesión');

      setAdminSession(data.token, data.admin.email);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-split">
        <div className="admin-login-panel admin-login-panel--form">
          <div className="admin-login-form-inner">
            <Link to="/" className="admin-login-brand">
              <LogoMark size={36} />
              <span>
                Tours <strong>Naranja</strong>
              </span>
            </Link>

            <div className="admin-login-intro">
              <span className="admin-login-eyebrow">Acceso interno</span>
              <h1>Panel administrador</h1>
              <p>Acceso solo para personal autorizado de Tours Naranja.</p>
            </div>

            <form className="admin-login-form" onSubmit={handleSubmit}>
              {error && (
                <p className="admin-login-error" role="alert">
                  {error}
                </p>
              )}

              <div className="admin-login-field">
                <input
                  id="admin-email"
                  type="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
                <label htmlFor="admin-email">Correo</label>
                <MailIcon />
              </div>

              <div className="admin-login-field admin-login-field--password">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <label htmlFor="admin-password">Contraseña</label>
                <LockIcon />
                <button
                  type="button"
                  className="admin-login-eye-btn"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <EyeIcon />
                </button>
              </div>

              <button type="submit" className="admin-login-submit" disabled={cargando}>
                {cargando ? 'Entrando…' : 'Ingresar'}
              </button>
            </form>
          </div>
        </div>

        <aside className="admin-login-panel admin-login-panel--visual" aria-hidden="true">
          <div className="admin-login-visual-bg" />
          <div className="admin-login-visual-content">
            <span className="admin-login-visual-badge">Gestión</span>
            <h2>Administra paquetes, blog y contactos</h2>
            <p>Panel centralizado para el equipo de Tours Naranja en Montería.</p>
            <ul className="admin-login-visual-list">
              <li>Paquetes turísticos</li>
              <li>Artículos del blog</li>
              <li>Mensajes de clientes</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
