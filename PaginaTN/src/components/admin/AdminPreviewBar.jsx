import { useNavigate } from 'react-router-dom';
import { clearAdminPreview, getAdminPreviewLabel, getAdminPreviewReturn } from '../../utils/adminPreview';

export default function AdminPreviewBar() {
  const navigate = useNavigate();
  const returnTo = getAdminPreviewReturn();

  if (!returnTo) return null;

  function handleBack() {
    const target = returnTo;
    clearAdminPreview();
    navigate(target);
  }

  return (
    <div className="admin-preview-bar" role="region" aria-label="Vista previa administrador">
      <div className="admin-preview-bar-inner container">
        <span className="admin-preview-bar-text">
          <span className="admin-preview-bar-dot" aria-hidden="true" />
          Vista previa — así lo verán los visitantes en el sitio
        </span>
        <button type="button" className="admin-preview-bar-btn" onClick={handleBack}>
          ← {getAdminPreviewLabel()}
        </button>
      </div>
    </div>
  );
}
