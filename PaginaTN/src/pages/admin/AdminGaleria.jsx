import { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminFetch } from '../../utils/adminApi';
import { AdminImagePreview } from '../../components/SafeImage';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const SLOTS = [
  { id: 'video-experiencias', label: 'Video principal', accept: 'video/mp4,video/webm', hint: 'experiencias.mp4' },
  { id: 'poster', label: 'Portada del video (opcional)', accept: 'image/*', hint: 'poster.jpg' },
  { id: 'foto-1', label: 'Foto 1 — Naturaleza y río', accept: 'image/*', hint: '1-naturaleza-rio.jpg' },
  { id: 'foto-2', label: 'Foto 2 — Aventura', accept: 'image/*', hint: '2-aventura-cordoba.jpg' },
  { id: 'foto-3', label: 'Foto 3 — Patrimonio', accept: 'image/*', hint: '3-rutas-patrimonio.jpg' },
  { id: 'foto-4', label: 'Foto 4 — Gastronomía', accept: 'image/*', hint: '4-sabores-cordobesos.jpg' },
];

export default function AdminGaleria() {
  const [subiendo, setSubiendo] = useState(null);
  const [ultimo, setUltimo] = useState(null);

  async function subir(slot, e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setSubiendo(slot);
    try {
      const body = new FormData();
      body.append('slot', slot);
      body.append('archivo', file);
      const res = await adminFetch('/api/admin/upload/galeria', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al subir');
      setUltimo({ slot, url: data.url });
    } catch (err) {
      alert(err.message);
    } finally {
      setSubiendo(null);
    }
  }

  return (
    <div className="admin-page admin-animate-page">
      <AdminPageHeader
        eyebrow="Inicio"
        title="Galería — Experiencias en imágenes"
        subtitle="Sube el video y las 4 fotos de la sección principal. Se guardan con el nombre correcto automáticamente."
        action={
          <Link to="/" className="btn btn-outline" target="_blank" rel="noreferrer">
            Ver inicio
          </Link>
        }
      />

      <p className="hint admin-field--wide">
        También puedes copiar los archivos a mano en{' '}
        <code>PaginaTN/public/galeria/</code> (lee LEEME.txt ahí).
      </p>

      {ultimo && (
        <p className="form-success" role="status">
          Guardado: {ultimo.url} — recarga la página de inicio (Ctrl+F5).
        </p>
      )}

      <div className="admin-galeria-grid">
        {SLOTS.map((slot) => (
          <div key={slot.id} className="admin-form-card admin-galeria-slot">
            <h3>{slot.label}</h3>
            <p className="hint">Se guarda como: {slot.hint}</p>
            <input
              type="file"
              accept={slot.accept}
              disabled={subiendo === slot.id}
              onChange={(e) => subir(slot.id, e)}
            />
            {subiendo === slot.id && <p className="hint">Subiendo…</p>}
            {slot.id !== 'video-experiencias' && (
              <AdminImagePreview url={`/galeria/${slot.hint}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
