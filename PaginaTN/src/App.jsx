import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import './App.css';
import './admin-pages.css';
import './home-motion.css';
import './page-motion.css';
import './responsive.css';

export default function App() {
  return <RouterProvider router={router} />;
}
