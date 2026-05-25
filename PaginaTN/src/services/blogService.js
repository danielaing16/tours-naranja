import { fetchJson } from '../lib/fetchJson';
import { blogPosts as mockPosts } from '../data/mockData';

function mapPost(row) {
  if (!row) return row;
  return {
    ...row,
    imagen: row.imagen_url || row.imagen || '',
    extracto: row.extracto || '',
    fecha: row.fecha || '',
  };
}

/** Listado público (solo publicados) */
export async function fetchBlogPosts() {
  try {
    const data = await fetchJson('/api/blog');
    const list = Array.isArray(data) ? data.map(mapPost) : [];
    if (list.length > 0) return list;
  } catch {
    /* fallback si la BD está vacía o el backend no responde */
  }
  return mockPosts;
}

/** Artículo por slug (público) */
export async function fetchBlogPostBySlug(slug) {
  try {
    const data = await fetchJson(`/api/blog/${encodeURIComponent(slug)}`);
    if (data?.slug) return mapPost(data);
  } catch (e) {
    if (!/404|no encontrado/i.test(e.message)) {
      const fallback = mockPosts.find((b) => b.slug === slug);
      if (fallback) return fallback;
      throw e;
    }
  }
  return mockPosts.find((b) => b.slug === slug) ?? null;
}
