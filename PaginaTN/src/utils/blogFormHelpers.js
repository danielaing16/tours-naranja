import { slugify } from './slugify';

export const formVacioBlog = {
  titulo: '',
  slug: '',
  extracto: '',
  contenido: '',
  imagen_url: '',
  publicado: true,
};

export function postToForm(post) {
  return {
    titulo: post.titulo || '',
    slug: post.slug || '',
    extracto: post.extracto || '',
    contenido: post.contenido || '',
    imagen_url: post.imagen_url || post.imagen || '',
    publicado: post.publicado !== false,
  };
}

export function formToBlogBody(form) {
  return {
    titulo: form.titulo.trim(),
    slug: (form.slug.trim() || slugify(form.titulo)).slice(0, 120),
    extracto: form.extracto.trim(),
    contenido: form.contenido.trim(),
    imagen_url: form.imagen_url.trim() || null,
    publicado: Boolean(form.publicado),
  };
}

export function slugFromTitulo(titulo) {
  return slugify(titulo);
}
