import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminFetch } from '../../utils/adminApi';

function StatIcon({ children, tone }) {
  return <span className={`admin-stat-icon admin-stat-icon--${tone}`}>{children}</span>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ paquetesActivos: 0, contactos: 0, paquetesTotal: 0 });
  const [cargando, setCargando] = useState(true);

  const displayName = useMemo(() => {
    const email = sessionStorage.getItem('adminEmail') || '';
    if (!email) return 'Administrador';
    const local = email.split('@')[0];
    return local.charAt(0).toUpperCase() + local.slice(1);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const [resPaq, resCon] = await Promise.all([
          adminFetch('/api/admin/paquetes'),
          adminFetch('/api/admin/contactos'),
        ]);
        const paquetes = await resPaq.json();
        const contactos = await resCon.json();
        const lista = Array.isArray(paquetes) ? paquetes : [];
        setStats({
          paquetesTotal: lista.length,
          paquetesActivos: lista.filter((p) => p.activo).length,
          contactos: Array.isArray(contactos) ? contactos.length : 0,
        });
      } catch {
        setStats({ paquetesActivos: 0, contactos: 0, paquetesTotal: 0 });
      } finally {
        setCargando(false);
      }
    }
    load();
  }, []);

  return (
    <div className="admin-dashboard admin-animate-page">
      <header className="admin-dashboard-hero admin-animate-hero">
        <div className="admin-dashboard-hero-copy">
          <span className="admin-dashboard-eyebrow">Panel de control</span>
          <h1>Bienvenido, {displayName}</h1>
          <p>Resumen de paquetes y mensajes de Tours Naranja.</p>
        </div>
      </header>

      {cargando ? (
        <p className="admin-dashboard-loading admin-animate-pulse">Cargando resumen…</p>
      ) : (
        <div className="admin-stats">
          <article className="admin-stat-card admin-stat-card--orange">
            <StatIcon tone="orange">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </StatIcon>
            <div className="admin-stat-body">
              <strong className="admin-stat-value">{stats.paquetesActivos}</strong>
              <span className="admin-stat-label">Paquetes activos</span>
              <span className="admin-stat-meta">Publicados en catálogo</span>
            </div>
          </article>

          <article className="admin-stat-card admin-stat-card--teal">
            <StatIcon tone="teal">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 7h14v10H5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M8 11h8M8 14h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </StatIcon>
            <div className="admin-stat-body">
              <strong className="admin-stat-value">{stats.paquetesTotal}</strong>
              <span className="admin-stat-label">Total paquetes</span>
              <span className="admin-stat-meta">Incluye inactivos</span>
            </div>
          </article>

          <article className="admin-stat-card admin-stat-card--green">
            <StatIcon tone="green">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6.5h16v11H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M4 7.5 12 13l8-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </StatIcon>
            <div className="admin-stat-body">
              <strong className="admin-stat-value">{stats.contactos}</strong>
              <span className="admin-stat-label">Mensajes de contacto</span>
              <span className="admin-stat-meta">Recibidos desde el sitio</span>
            </div>
          </article>
        </div>
      )}

      <section className="admin-dashboard-section">
        <h2>Acciones rápidas</h2>
        <div className="admin-quick-actions">
          <Link to="/admin/paquetes" className="admin-quick-action">
            <span className="admin-quick-action-title">Gestionar paquetes</span>
            <span className="admin-quick-action-desc">Crear, editar y publicar rutas turísticas</span>
          </Link>
          <Link to="/admin/contactos" className="admin-quick-action">
            <span className="admin-quick-action-title">Ver contactos</span>
            <span className="admin-quick-action-desc">Revisar mensajes enviados por clientes</span>
          </Link>
          <Link to="/admin/blog" className="admin-quick-action">
            <span className="admin-quick-action-title">Administrar blog</span>
            <span className="admin-quick-action-desc">Artículos e historias del sitio</span>
          </Link>
          <Link to="/admin/galeria" className="admin-quick-action">
            <span className="admin-quick-action-title">Galería del inicio</span>
            <span className="admin-quick-action-desc">Video y fotos de «Experiencias en imágenes»</span>
          </Link>
        </div>
      </section>

      <aside className="admin-dashboard-note">
        <span className="admin-dashboard-note-badge">Nota</span>
        <p>
          El blog se gestiona en Admin → Blog. Usa «Importar JSON base» la primera vez para cargar los
          artículos desde <code>backend/data/blog-posts.json</code>.
        </p>
      </aside>
    </div>
  );
}
