import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import LogoMark from '../../components/LogoMark';
import { clearAdminSession } from '../../utils/adminApi';

const links = [
  {
    to: '/admin',
    label: 'Dashboard',
    end: true,
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2.5" y="2.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="11" y="2.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="2.5" y="11" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="11" y="11" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    to: '/admin/paquetes',
    label: 'Paquetes',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3.5 6.5 10 3.5l6.5 3v7L10 16.5l-6.5-3v-7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M10 3.5v13M3.5 6.5 10 9.5l6.5-3" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    to: '/admin/galeria',
    label: 'Galería inicio',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/admin/blog',
    label: 'Blog',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M5 4.5h10v11H5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M7.5 8h5M7.5 11h5M7.5 14h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/admin/contactos',
    label: 'Contactos',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3.5 5.5h13v9h-13z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M3.5 6.5 10 11l6.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem('adminEmail') || 'Administrador';

  function handleLogout() {
    clearAdminSession();
    navigate('/admin/login');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar admin-animate-sidebar">
        <div className="admin-sidebar-brand">
          <LogoMark size={32} />
          <span>
            Tours <strong>Naranja</strong>
          </span>
        </div>

        <p className="admin-sidebar-user">{email}</p>

        <nav className="admin-sidebar-nav" aria-label="Administración">
          {links.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `admin-nav admin-animate-nav${isActive ? ' active' : ''}`}
              style={{ '--admin-i': i }}
            >
              <span className="admin-nav-icon">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <button type="button" className="admin-nav logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
