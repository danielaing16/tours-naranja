import { Navigate } from 'react-router-dom';
import { getAdminToken } from '../utils/adminApi';

export default function AdminRoute({ children }) {
  if (!getAdminToken()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
