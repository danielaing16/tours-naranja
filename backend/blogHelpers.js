/** Normaliza fila blog_posts para el frontend */
export function mapBlogRow(row) {
  if (!row) return null;
  const fecha = row.created_at
    ? new Date(row.created_at).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    extracto: row.extracto || '',
    contenido: row.contenido || '',
    imagen_url: row.imagen_url || null,
    imagen: row.imagen_url || null,
    publicado: Boolean(row.publicado),
    created_at: row.created_at,
    fecha,
  };
}

export function slugify(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

export function blogBodyFromRequest(body) {
  const titulo = body.titulo?.trim();
  if (!titulo) return { error: 'El título es obligatorio.' };

  const slug = (body.slug?.trim() || slugify(titulo)).slice(0, 120);
  if (!slug) return { error: 'El slug no es válido.' };

  return {
    ok: true,
    fila: {
      titulo,
      slug,
      extracto: body.extracto?.trim() || null,
      contenido: body.contenido?.trim() || null,
      imagen_url: body.imagen_url?.trim() || null,
      publicado: body.publicado !== false && body.publicado !== 'false',
    },
  };
}
