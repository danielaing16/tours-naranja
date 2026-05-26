/** Traducciones al inglés de paquetes oficiales y textos comunes */

export const DESTINOS_EN = {
  'Tuchín - Resguardo Zenú': 'Tuchín — Zenú Cultural Reserve',
  'Tuchín – Resguardo Zenú': 'Tuchín — Zenú Cultural Reserve',
  'Montería - Río Sinú': 'Montería — Sinú River',
  'Montería – Río Sinú': 'Montería — Sinú River',
  'Ruta Córdoba y Caribe': 'Córdoba & Caribbean Route',
  Lorica: 'Lorica',
  Montería: 'Montería',
};

export const INTERESES_EN = {
  Cultura: 'Culture',
  Naturaleza: 'Nature',
  Aventura: 'Adventure',
  Gastronomía: 'Gastronomy',
  Relax: 'Relaxation',
  Fotografía: 'Photography',
  Artesanías: 'Handicrafts',
};

/** Ítems «incluye» frecuentes (español → inglés) */
export const INCLUYE_ITEM_EN = {
  'Recorrido en catamarán': 'Catamaran tour',
  'Navegación río Sinú': 'Sinú River navigation',
  'Navegación Río Sinú': 'Sinú River navigation',
  'Refrigerio en Lorica': 'Refreshment in Lorica',
  'Almuerzo Doña Sara': 'Lunch at Doña Sara',
  'Alojamiento Hotel AIMARAWA': 'Stay at Hotel AIMARAWA',
  'Entrada resguardo Zenú': 'Zenú reserve entrance',
  'Transporte ida y vuelta': 'Round-trip transport',
  'Recorrido cultural y artesanal': 'Cultural and craft tour',
  'Visita comunidades Zenú': 'Visit to Zenú communities',
};

/** Paquetes oficiales por id (producción suele usar 5, 6, 7) */
export const PAQUETES_EN_BY_ID = {
  5: {
    key: 'zenu',
    nombre: 'Zenú Cultural Reserve Tour',
    descripcion_corta: '1 day · From $290,000 · Price varies by origin and group size',
    descripcion_larga:
      'One-day cultural experience at the Zenú Reserve in Tuchín. Departure from Montería or Lorica (transport varies by origin).\n\nINCLUDES:\n• Zenú reserve entrance\n• Round-trip transport\n• Cultural and craft tour\n• Visit to Zenú communities\n\nRates and transport tables apply by group size. Final price confirmed via WhatsApp.',
    incluye: [
      'Zenú reserve entrance',
      'Round-trip transport',
      'Cultural and craft tour',
      'Visit to Zenú communities',
    ],
    intereses: ['Culture', 'Handicrafts'],
  },
  6: {
    key: 'sinu',
    nombre: 'Sinú River Nautical Tour',
    descripcion_corta: '$450,000 per person · 2 days / 1 night',
    descripcion_larga:
      'Two-day, one-night nautical tour along the Sinú River route: Montería, San Pelayo, Lorica, San Bernardo del Viento, San Antero.\n\nINCLUDES:\n• Catamaran tour\n• Sinú River navigation\n• Refreshment in Lorica\n• Lunch at Doña Sara restaurant\n• Stay at Hotel AIMARAWA\n\nPrice: $450,000 per person. Final details via WhatsApp.',
    incluye: [
      'Catamaran tour',
      'Sinú River navigation',
      'Refreshment in Lorica',
      'Lunch at Doña Sara',
      'Stay at Hotel AIMARAWA',
    ],
    intereses: ['Nature', 'Gastronomy', 'Relaxation'],
  },
  7: {
    key: 'caribe',
    nombre: 'Córdoba & Caribbean Route',
    descripcion_corta: '3 days / 2 nights · Price depends on group and itinerary',
    descripcion_larga:
      'Regional route over 3 days and 2 nights: Montería, Lorica, San Antero, Cispatá Bay, Sanguaré, Cartagena.\n\nINCLUDES:\n• Land and sea transport (as per route)\n• Regional tour\n• Ecotourism experience\n• Boat navigation\n• Cultural and natural destinations\n\nFinal quote via WhatsApp.',
    incluye: [
      'Land and sea transport (as per route)',
      'Regional tour',
      'Ecotourism experience',
      'Boat navigation',
      'Lunch in Lorica (reference $80,000 p/p)',
    ],
    intereses: ['Nature', 'Culture', 'Adventure'],
  },
};

/** Mismo contenido por clave (por si el id en BD no es 5/6/7) */
export const PAQUETES_EN_BY_KEY = {
  zenu: PAQUETES_EN_BY_ID[5],
  sinu: PAQUETES_EN_BY_ID[6],
  caribe: PAQUETES_EN_BY_ID[7],
};

export function paqueteCatalogKey(nombre = '') {
  const n = String(nombre).toLowerCase();
  if (n.includes('zenú') || n.includes('zenu') || n.includes('resguardo')) return 'zenu';
  if (n.includes('náutico') || n.includes('nautico') || n.includes('sinú') || n.includes('sinu'))
    return 'sinu';
  if (n.includes('córdoba') || n.includes('cordoba') || n.includes('caribe')) return 'caribe';
  return null;
}

export function resolvePaqueteCatalog(paquete) {
  if (!paquete) return null;
  const byId = PAQUETES_EN_BY_ID[paquete.id] ?? PAQUETES_EN_BY_ID[Number(paquete.id)];
  if (byId) return byId;
  const key = paqueteCatalogKey(paquete.nombre);
  return key ? PAQUETES_EN_BY_KEY[key] : null;
}

export function translateDestinoNombre(nombre) {
  if (!nombre) return nombre;
  if (DESTINOS_EN[nombre]) return DESTINOS_EN[nombre];
  const norm = nombre.replace(/\s*[–—-]\s*/g, ' - ').trim();
  for (const [es, en] of Object.entries(DESTINOS_EN)) {
    if (es.replace(/\s*[–—-]\s*/g, ' - ').trim() === norm) return en;
  }
  return nombre;
}
