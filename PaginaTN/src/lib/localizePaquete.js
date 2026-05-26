import {
  INCLUYE_ITEM_EN,
  INTERESES_EN,
  resolvePaqueteCatalog,
  translateDestinoNombre,
} from '../i18n/paquetesCatalog.en.js';

function translateIntereses(intereses) {
  if (Array.isArray(intereses)) {
    return intereses.map((item) => {
      const parts = String(item).split(/\s+/);
      if (parts.length === 1) return INTERESES_EN[item] || item;
      return parts.map((w) => INTERESES_EN[w] || w).join(' ');
    });
  }
  if (typeof intereses === 'string' && intereses.trim()) {
    return intereses
      .split(/[,·]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((phrase) => {
        const mapped = INTERESES_EN[phrase];
        if (mapped) return mapped;
        return phrase
          .split(/\s+/)
          .map((w) => INTERESES_EN[w] || w)
          .join(' ');
      })
      .join(' · ');
  }
  return intereses;
}

function translateIncluyeList(incluye, catalog, isOfficial) {
  if (!Array.isArray(incluye)) return incluye;
  if (isOfficial && catalog?.incluye?.length) return catalog.incluye;
  return incluye.map((item) => INCLUYE_ITEM_EN[item] || item);
}

/** Usa texto EN de BD solo si es distinto del español (evita copias en español en *_en). */
function pickEn(dbEn, catalogEn, esFallback) {
  const db = dbEn?.trim();
  const es = esFallback?.trim();
  if (catalogEn && (!db || (es && db === es))) return catalogEn;
  return db || catalogEn || esFallback;
}

/**
 * Devuelve el paquete con textos en inglés cuando lang === 'en'.
 * Prioridad: catálogo oficial (id o nombre) → campos *_en válidos → mapas de ítems.
 */
export function localizePaquete(paquete, lang) {
  if (!paquete || lang !== 'en') return paquete;

  const catalog = resolvePaqueteCatalog(paquete);
  const isOfficial = Boolean(catalog);

  const nombre = pickEn(paquete.nombre_en, catalog?.nombre, paquete.nombre);
  const descripcion_corta = pickEn(
    paquete.descripcion_corta_en,
    catalog?.descripcion_corta,
    paquete.descripcion_corta
  );
  const descripcion_larga = pickEn(
    paquete.descripcion_larga_en,
    catalog?.descripcion_larga,
    paquete.descripcion_larga
  );

  let incluye = paquete.incluye;
  if (Array.isArray(paquete.incluye_en) && paquete.incluye_en.length > 0 && !isOfficial) {
    incluye = paquete.incluye_en;
  } else if (catalog?.incluye?.length) {
    incluye = catalog.incluye;
  }
  incluye = translateIncluyeList(incluye, catalog, isOfficial);

  const destinos = paquete.destinos
    ? {
        ...paquete.destinos,
        nombre: translateDestinoNombre(paquete.destinos.nombre),
      }
    : paquete.destinos;

  const intereses = catalog?.intereses?.length
    ? catalog.intereses
    : translateIntereses(paquete.intereses);

  return {
    ...paquete,
    nombre,
    descripcion_corta,
    descripcion_larga,
    descripcion: descripcion_corta || paquete.descripcion,
    incluye,
    destinos,
    intereses,
  };
}
