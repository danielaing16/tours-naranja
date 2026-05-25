import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminFetch } from '../../utils/adminApi';
import { AdminImagePreview } from '../../components/SafeImage';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import {
  formVacioBlog,
  formToBlogBody,
  postToForm,
  slugFromTitulo,
} from '../../utils/blogFormHelpers';

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [importando, setImportando] = useState(false);

  async function cargarLista() {
    setCargando(true);
    setError('');
    try {
      const res = await adminFetch('/api/admin/blog');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar');
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarLista();
  }, []);

  function abrirNuevo() {
    setEditId(null);
    setForm({ ...formVacioBlog });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function abrirEditar(id) {
    try {
      const res = await adminFetch(`/api/admin/blog/${id}`);
      const p = await res.json();
      if (!res.ok) throw new Error(p.error || 'No se pudo cargar');
      setEditId(id);
      setForm(postToForm(p));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      alert(e.message);
    }
  }

  function cerrarForm() {
    setForm(null);
    setEditId(null);
  }

  function onTituloChange(titulo) {
    setForm((f) => ({
      ...f,
      titulo,
      slug: editId ? f.slug : slugFromTitulo(titulo),
    }));
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    try {
      const body = formToBlogBody(form);
      const url = editId ? `/api/admin/blog/${editId}` : '/api/admin/blog';
      const method = editId ? 'PUT' : 'POST';
      const res = await adminFetch(url, { method, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');
      cerrarForm();
      await cargarLista();
    } catch (err) {
      alert(err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(id, titulo) {
    if (!window.confirm(`¿Eliminar "${titulo}"? Esta acción no se puede deshacer.`)) return;
    try {
      const res = await adminFetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al eliminar');
      if (editId === id) cerrarForm();
      await cargarLista();
    } catch (e) {
      alert(e.message);
    }
  }

  async function importarJson() {
    if (
      !window.confirm(
        '¿Importar artículos desde blog-posts.json? Los slugs existentes se actualizarán.'
      )
    ) {
      return;
    }
    setImportando(true);
    try {
      const res = await adminFetch('/api/admin/blog/importar-json', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al importar');
      alert(
        `Listo: ${data.insertados} nuevos, ${data.actualizados} actualizados.` +
          (data.errores?.length ? `\nAvisos: ${data.errores.join('\n')}` : '')
      );
      await cargarLista();
    } catch (e) {
      alert(e.message);
    } finally {
      setImportando(false);
    }
  }

  return (
    <div className="admin-page admin-animate-page">
      <AdminPageHeader
        eyebrow="Contenido"
        title="Blog"
        subtitle="Artículos publicados en la web. Edita textos, imágenes y estado de publicación."
        action={
          <div className="admin-head-actions">
            <button type="button" className="btn btn-outline" onClick={importarJson} disabled={importando}>
              {importando ? 'Importando…' : 'Importar JSON base'}
            </button>
            <button type="button" className="btn btn-primary" onClick={abrirNuevo}>
              + Nuevo artículo
            </button>
          </div>
        }
      />

      {form && (
        <form className="admin-form-card admin-animate-item" onSubmit={guardar}>
          <h2 className="admin-form-title">{editId ? 'Editar artículo' : 'Nuevo artículo'}</h2>

          <div className="admin-form-grid">
            <label className="admin-field admin-field--wide">
              Título *
              <input
                type="text"
                value={form.titulo}
                onChange={(e) => onTituloChange(e.target.value)}
                required
              />
            </label>
            <label className="admin-field admin-field--wide">
              Slug (URL) *
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                required
              />
            </label>
            <label className="admin-field admin-field--wide">
              Extracto (resumen en listado)
              <textarea
                rows={2}
                value={form.extracto}
                onChange={(e) => setForm((f) => ({ ...f, extracto: e.target.value }))}
              />
            </label>
            <label className="admin-field admin-field--wide">
              Contenido (párrafos separados con línea en blanco)
              <textarea
                rows={12}
                value={form.contenido}
                onChange={(e) => setForm((f) => ({ ...f, contenido: e.target.value }))}
                required
              />
            </label>
            <label className="admin-field admin-field--wide">
              URL de imagen
              <input
                type="url"
                value={form.imagen_url}
                onChange={(e) => setForm((f) => ({ ...f, imagen_url: e.target.value }))}
                placeholder="https://..."
              />
            </label>
            {form.imagen_url && (
              <div className="admin-field admin-field--wide">
                <AdminImagePreview url={form.imagen_url} />
              </div>
            )}
            <label className="admin-field admin-field--check">
              <input
                type="checkbox"
                checked={form.publicado}
                onChange={(e) => setForm((f) => ({ ...f, publicado: e.target.checked }))}
              />
              Publicado en la web
            </label>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
            <button type="button" className="btn btn-outline" onClick={cerrarForm}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {cargando && <p className="admin-page-loading admin-animate-pulse">Cargando artículos…</p>}
      {error && <p className="form-error">{error}</p>}

      {!cargando && !error && (
        <div className="grid-3 admin-blog-grid">
          {posts.length === 0 ? (
            <p className="admin-list-empty admin-field--wide">
              No hay artículos. Pulsa «Importar JSON base» o crea uno nuevo.
            </p>
          ) : (
            posts.map((b, i) => (
              <article
                key={b.id}
                className="card admin-blog-item admin-animate-item"
                style={{ '--admin-i': Math.min(i, 14) }}
              >
                <AdminImagePreview url={b.imagen_url || b.imagen} />
                <div className="admin-blog-item-body">
                  <span className={`badge${b.publicado ? '' : ' badge--muted'}`}>
                    {b.publicado ? 'Publicado' : 'Borrador'}
                  </span>
                  <h3>{b.titulo}</h3>
                  <p className="admin-blog-extracto">{b.extracto}</p>
                  <span className="hint">/{b.slug}</span>
                  <div className="admin-blog-item-actions">
                    {b.publicado && (
                      <Link to={`/blog/${b.slug}`} className="btn btn-outline btn-sm" target="_blank" rel="noreferrer">
                        Ver en web
                      </Link>
                    )}
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => abrirEditar(b.id)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm admin-btn-danger"
                      onClick={() => eliminar(b.id, b.titulo)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}
