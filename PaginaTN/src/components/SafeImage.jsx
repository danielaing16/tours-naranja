import { useState } from 'react';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80';

/** Normaliza URL: espacios, https, y enlaces de Bing (mediaurl=...) */
export function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  let u = url.trim();
  if (!u) return '';

  // Bing Imágenes: la URL larga no es la foto; la real va en mediaurl=
  if (u.includes('bing.com') && u.includes('mediaurl=')) {
    try {
      const parsed = new URL(u);
      const media = parsed.searchParams.get('mediaurl');
      if (media) u = decodeURIComponent(media);
    } catch {
      /* seguir con u original */
    }
  }

  if (u.startsWith('/')) return u;
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  return u;
}

/**
 * Imagen con fallback si la URL falla (hotlink, 403, enlace a página HTML).
 * referrerPolicy no-referrer ayuda en algunos sitios.
 */
export default function SafeImage({ src, alt, className, showPlaceholder = true }) {
  const [failed, setFailed] = useState(false);
  const normalized = normalizeImageUrl(src);
  const tieneUrlGuardada = Boolean(normalized);

  // Sin URL en BD → placeholder genérico (solo catálogo vacío)
  if (!tieneUrlGuardada) {
    if (!showPlaceholder) return null;
    return (
      <img
        className={className}
        src={PLACEHOLDER}
        alt={alt || ''}
        loading="lazy"
      />
    );
  }

  // Hay URL pero no cargó → NO sustituir por Unsplash (confundía con “guardó por defecto”)
  if (failed) {
    return (
      <div className={`safe-image-missing ${className || ''}`} role="img" aria-label={alt}>
        <span>Imagen no disponible</span>
        <small>La URL está guardada pero el sitio no permite mostrarla aquí.</small>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={normalized}
      alt={alt || ''}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      onLoad={() => setFailed(false)}
    />
  );
}

/** Vista previa en admin: muestra aviso si la URL no carga */
export function AdminImagePreview({ url }) {
  const [failed, setFailed] = useState(false);
  const normalized = normalizeImageUrl(url);

  if (!normalized) return null;

  return (
    <div className="admin-img-preview-wrap">
      {!failed && (
        <img
          src={normalized}
          alt="Vista previa"
          className="admin-img-preview"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          onLoad={() => setFailed(false)}
        />
      )}
      {failed && (
        <p className="form-error admin-img-error">
          No se pudo cargar esta URL. Muchas páginas web <strong>bloquean</strong> usar su imagen en
          otro sitio. Usa un enlace <strong>directo</strong> a la imagen (termina en .jpg, .png, .webp)
          o servicios como Unsplash, Imgur o sube la foto a Supabase Storage.
        </p>
      )}
    </div>
  );
}
