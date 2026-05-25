import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminFetch } from '../../utils/adminApi';
import { AdminImagePreview } from '../../components/SafeImage';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { consumeAdminPreviewEditId, setAdminPreviewReturn } from '../../utils/adminPreview';
import {
  INTERESES_OPCIONES,
  formVacioPaquete,
  paqueteToForm,
  formToPaqueteBody,
} from '../../utils/paqueteFormHelpers';

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export default function AdminPaquetes() {
  const navigate = useNavigate();
  const [paquetes, setPaquetes] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  async function cargarLista() {
    setCargando(true);
    setError('');
    try {
      const res = await adminFetch('/api/admin/paquetes');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar');
      setPaquetes(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarLista();
    fetch('/api/destinos')
      .then((r) => r.json())
      .then((data) => setDestinos(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const pendingId = consumeAdminPreviewEditId();
    if (pendingId) abrirEditar(pendingId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function irVistaPrevia(id, { restoreEdit = false } = {}) {
    setAdminPreviewReturn('/admin/paquetes', {
      editId: restoreEdit ? id : undefined,
      label: 'Volver a paquetes',
    });
    navigate(`/paquetes/${id}`);
  }

  function irVistaPreviaCatalogo() {
    setAdminPreviewReturn('/admin/paquetes', { label: 'Volver a paquetes' });
    navigate('/paquetes');
  }

  function abrirNuevo() {
    setEditId(null);
    setForm({ ...formVacioPaquete });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function abrirEditar(id) {
    try {
      const res = await adminFetch(`/api/admin/paquetes/${id}`);
      const p = await res.json();
      if (!res.ok) throw new Error(p.error || 'No se pudo cargar');
      setEditId(id);
      setForm(paqueteToForm(p));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      alert(e.message);
    }
  }

  function toggleInteres(nombre) {
    setForm((f) => ({
      ...f,
      intereses: f.intereses.includes(nombre)
        ? f.intereses.filter((x) => x !== nombre)
        : [...f.intereses, nombre],
    }));
  }

  async function subirImagenLocal(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setSubiendoImagen(true);
    try {
      const body = new FormData();
      body.append('imagen', file);
      const res = await adminFetch('/api/admin/upload/paquete-imagen', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo subir la imagen');
      setForm((f) => ({ ...f, imagen_url: data.url }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSubiendoImagen(false);
    }
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    try {
      const body = formToPaqueteBody(form);
      const url = editId ? `/api/admin/paquetes/${editId}` : '/api/admin/paquetes';
      const method = editId ? 'PUT' : 'POST';

      const res = await adminFetch(url, { method, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');

      setForm(null);
      setEditId(null);
      await cargarLista();
    } catch (err) {
      alert(err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function desactivar(id, nombre) {
    if (!window.confirm(`¿Desactivar "${nombre}"? Dejará de verse en la web pública.`)) return;
    try {
      const res = await adminFetch(`/api/admin/paquetes/${id}/desactivar`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al desactivar');
      await cargarLista();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="admin-page admin-animate-page">
      <AdminPageHeader
        eyebrow="Gestión"
        title="Paquetes"
        subtitle="Catálogo para la web, fichas de detalle y motor de recomendación."
        action={
          !form && (
            <div className="admin-toolbar">
              <button type="button" className="admin-btn admin-btn--line" onClick={irVistaPreviaCatalogo}>
                Previa catálogo
              </button>
              <button type="button" className="admin-btn admin-btn--fill" onClick={abrirNuevo}>
                Nuevo paquete
              </button>
            </div>
          )
        }
      />

      {form && (
        <div className="admin-form-card admin-animate-scale-in">
          <h2>{editId ? `Editar paquete #${editId}` : 'Nuevo paquete'}</h2>
          <p className="hint" style={{ marginBottom: 16 }}>
            Completa todos los campos posibles. Los intereses y el itinerario alimentan el motor de
            recomendación futuro.
          </p>

          <form className="form-card" onSubmit={guardar}>
            <h3 className="admin-form-section">Información básica</h3>
            <div className="field">
              <label>Nombre *</label>
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Descripción corta (catálogo)</label>
              <input
                value={form.descripcion_corta}
                onChange={(e) => setForm({ ...form, descripcion_corta: e.target.value })}
                placeholder="Una línea para la tarjeta en /paquetes"
              />
            </div>
            <div className="field">
              <label>Descripción larga (ficha detalle)</label>
              <textarea
                rows={4}
                value={form.descripcion_larga}
                onChange={(e) => setForm({ ...form, descripcion_larga: e.target.value })}
                placeholder="Texto completo del paquete"
              />
            </div>

            <h3 className="admin-form-section">Precio y duración</h3>
            <div className="field-row">
              <div className="field">
                <label>Precio (COP) *</label>
                <input
                  type="number"
                  min="0"
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Tipo de precio</label>
                <select
                  value={form.tipo_precio}
                  onChange={(e) => setForm({ ...form, tipo_precio: e.target.value })}
                >
                  <option value="total">Total del grupo</option>
                  <option value="por_persona">Por persona</option>
                </select>
              </div>
              <div className="field">
                <label>Días *</label>
                <input
                  type="number"
                  min="1"
                  value={form.dias}
                  onChange={(e) => setForm({ ...form, dias: e.target.value })}
                  required
                />
              </div>
            </div>

            <h3 className="admin-form-section">Ubicación y público</h3>
            <div className="field-row">
              <div className="field">
                <label>Destino</label>
                <select
                  value={form.destino_id}
                  onChange={(e) => setForm({ ...form, destino_id: e.target.value })}
                >
                  <option value="">Sin destino</option>
                  {destinos.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field checks">
              <label className="check-item">
                <input
                  type="checkbox"
                  checked={form.apto_ninos}
                  onChange={(e) => setForm({ ...form, apto_ninos: e.target.checked })}
                />
                Apto para niños (familias)
              </label>
              <label className="check-item">
                <input
                  type="checkbox"
                  checked={form.incluye_transporte}
                  onChange={(e) => setForm({ ...form, incluye_transporte: e.target.checked })}
                />
                Incluye transporte en el paquete
              </label>
            </div>

            <h3 className="admin-form-section">Intereses (Personaliza tu experiencia)</h3>
            <p className="hint">Marca los que apliquen a este paquete. Deben coincidir con los del formulario del turista.</p>
            <div className="checks">
              {INTERESES_OPCIONES.map((i) => (
                <label key={i} className="check-item">
                  <input
                    type="checkbox"
                    checked={form.intereses.includes(i)}
                    onChange={() => toggleInteres(i)}
                  />
                  {i}
                </label>
              ))}
            </div>

            <h3 className="admin-form-section">Qué incluye / no incluye</h3>
            <div className="field">
              <label>Incluye (una línea por ítem)</label>
              <textarea
                rows={4}
                value={form.incluyeText}
                onChange={(e) => setForm({ ...form, incluyeText: e.target.value })}
                placeholder={'Guía bilingüe\nAlmuerzo típico\nEntrada museo'}
              />
            </div>
            <div className="field">
              <label>No incluye (una línea por ítem)</label>
              <textarea
                rows={3}
                value={form.noIncluyeText}
                onChange={(e) => setForm({ ...form, noIncluyeText: e.target.value })}
                placeholder={'Vuelos\nPropinas'}
              />
            </div>

            <h3 className="admin-form-section">Itinerario</h3>
            <div className="field">
              <label>Día a día (una línea por día)</label>
              <textarea
                rows={5}
                value={form.itinerarioText}
                onChange={(e) => setForm({ ...form, itinerarioText: e.target.value })}
                placeholder={'Día 1: Llegada y city tour\nDía 2: Río Sinú\nDía 3: Gastronomía local'}
              />
              <p className="hint">Formato: Día 1: actividad — o solo el texto de la actividad por línea.</p>
            </div>

            <h3 className="admin-form-section">Imagen y publicación</h3>
            <div className="field">
              <label>Subir foto desde tu PC</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={subirImagenLocal}
                disabled={subiendoImagen}
              />
              <p className="hint">
                Elige la foto descargada (.jpg, .png). Se guarda en el sitio y se usa en el catálogo. Luego pulsa
                Guardar en el paquete.
              </p>
              {subiendoImagen && <p className="hint">Subiendo imagen…</p>}
            </div>
            <div className="field">
              <label>Ruta de imagen (automática o manual)</label>
              <input
                type="text"
                value={form.imagen_url}
                onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
                placeholder="/paquetes/mi-foto.jpg"
              />
              <p className="hint">
                Opcional: también puedes pegar un enlace web directo si ya está en internet.
              </p>
              <AdminImagePreview url={form.imagen_url} />
            </div>
            <div className="field checks">
              <label className="check-item">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                />
                Activo en sistema
              </label>
              <label className="check-item">
                <input
                  type="checkbox"
                  checked={form.visible_web}
                  onChange={(e) => setForm({ ...form, visible_web: e.target.checked })}
                />
                Visible en catálogo público (/paquetes)
              </label>
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn--fill" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Guardar'}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--line"
                onClick={() => {
                  setForm(null);
                  setEditId(null);
                }}
              >
                Cancelar
              </button>
              {editId && (
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={() => irVistaPrevia(editId, { restoreEdit: true })}
                >
                  Previa web
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {error && <p className="form-error">{error}</p>}
      {cargando && <p className="admin-page-loading admin-animate-pulse">Cargando paquetes…</p>}

      {!cargando && !error && (
        <div className="admin-list">
          {paquetes.length === 0 ? (
            <p className="admin-list-empty">No hay paquetes. Crea uno con «Nuevo paquete».</p>
          ) : (
            paquetes.map((p, i) => (
              <article
                key={p.id}
                className="admin-list-item admin-animate-item"
                style={{ '--admin-i': Math.min(i, 14) }}
              >
                <div className="admin-list-item-main">
                  <span className="admin-list-item-id">#{p.id}</span>
                  <div>
                    <h3>{p.nombre}</h3>
                    <p>
                      {p.destinos?.nombre || 'Sin destino'} · {p.dias} días
                      {Array.isArray(p.intereses) && p.intereses.length > 0
                        ? ` · ${p.intereses.slice(0, 2).join(', ')}${p.intereses.length > 2 ? '…' : ''}`
                        : ''}
                    </p>
                  </div>
                </div>
                <div className="admin-list-item-meta">
                  <span className="admin-list-item-price">{fmt(p.precio)}</span>
                  <span className={`admin-tag${p.activo ? ' admin-tag--on' : ''}`}>
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="admin-segment" role="group" aria-label={`Acciones ${p.nombre}`}>
                  <button type="button" className="admin-segment-btn" onClick={() => abrirEditar(p.id)}>
                    Editar
                  </button>
                  <button type="button" className="admin-segment-btn" onClick={() => irVistaPrevia(p.id)}>
                    Previa
                  </button>
                  {p.activo && (
                    <button
                      type="button"
                      className="admin-segment-btn admin-segment-btn--warn"
                      onClick={() => desactivar(p.id, p.nombre)}
                    >
                      Desactivar
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}
