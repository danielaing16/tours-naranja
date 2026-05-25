import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Paquetes from './pages/Paquetes';
import PaqueteDetalle from './pages/PaqueteDetalle';
import CreaTuPlan from './pages/CreaTuPlan';
import PlanResultado from './pages/PlanResultado';
import Blog from './pages/Blog';
import BlogDetalle from './pages/BlogDetalle';
import Contacto from './pages/Contacto';
import SobreNosotros from './pages/SobreNosotros';
import AdminRoute from './components/AdminRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPaquetes from './pages/admin/AdminPaquetes';
import AdminBlog from './pages/admin/AdminBlog';
import AdminContactos from './pages/admin/AdminContactos';
import AdminGaleria from './pages/admin/AdminGaleria';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'paquetes', element: <Paquetes /> },
      { path: 'paquetes/:id', element: <PaqueteDetalle /> },
      { path: 'crea-tu-plan', element: <CreaTuPlan /> },
      { path: 'crea-tu-plan/resultado', element: <PlanResultado /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogDetalle /> },
      { path: 'contacto', element: <Contacto /> },
      { path: 'sobre-nosotros', element: <SobreNosotros /> },
    ],
  },
  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'paquetes', element: <AdminPaquetes /> },
      { path: 'blog', element: <AdminBlog /> },
      { path: 'galeria', element: <AdminGaleria /> },
      { path: 'contactos', element: <AdminContactos /> },
    ],
  },
]);
