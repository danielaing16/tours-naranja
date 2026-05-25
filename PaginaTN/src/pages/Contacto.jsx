import { Navigate } from 'react-router-dom';

/** Redirige al formulario de contacto en la página de inicio */
export default function Contacto() {
  return <Navigate to={{ pathname: '/', hash: 'contacto' }} replace />;
}
