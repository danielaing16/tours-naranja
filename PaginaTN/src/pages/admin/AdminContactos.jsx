import { useEffect, useState } from 'react';
import { adminFetch } from '../../utils/adminApi';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

function fmtFecha(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminContactos() {
  const [rows, setRows] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminFetch('/api/admin/contactos')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setRows(Array.isArray(data) ? data : []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="admin-page admin-animate-page">
      <AdminPageHeader
        eyebrow="Bandeja"
        title="Mensajes de contacto"
        subtitle="Consultas enviadas desde el formulario del sitio público."
        action={
          !cargando && (
            <span className="admin-count-badge">
              {rows.length} mensaje{rows.length === 1 ? '' : 's'}
            </span>
          )
        }
      />

      {cargando && <p className="admin-page-loading admin-animate-pulse">Cargando mensajes…</p>}
      {error && <p className="form-error">{error}</p>}

      {!cargando && !error && (
        <div className="admin-message-list">
          {rows.length === 0 ? (
            <p className="admin-list-empty">No hay mensajes aún.</p>
          ) : (
            rows.map((r, i) => (
              <article
                key={r.id}
                className="admin-message-card admin-animate-item"
                style={{ '--admin-i': Math.min(i, 14) }}
              >
                <header className="admin-message-head">
                  <div>
                    <h3>{r.nombre}</h3>
                    <a href={`mailto:${r.email}`} className="admin-message-email">
                      {r.email}
                    </a>
                  </div>
                  <time className="admin-message-date">{fmtFecha(r.created_at)}</time>
                </header>
                <p className="admin-message-body">{r.mensaje}</p>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}
