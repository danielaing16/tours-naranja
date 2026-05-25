import { normalizeImageUrl } from '../components/SafeImage.jsx';

export const INTERESES_OPCIONES = [
  'Cultura',
  'Naturaleza',
  'Aventura',
  'Gastronomía',
  'Relax',
  'Fotografía',
];

export function arrayToLines(arr) {
  return Array.isArray(arr) ? arr.filter(Boolean).join('\n') : '';
}

export function linesToArray(text) {
  if (!text?.trim()) return [];
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function itinerarioToText(itin) {
  if (!Array.isArray(itin) || itin.length === 0) return '';
  return itin
    .map((d) => {
      const dia = d.dia ?? '';
      const act = d.actividad || '';
      return act ? `Día ${dia}: ${act}` : '';
    })
    .filter(Boolean)
    .join('\n');
}

export function textToItinerario(text) {
  const lines = linesToArray(text);
  return lines.map((line, i) => {
    const m = line.match(/^d[ií]a\s*(\d+)\s*[:.\-–]\s*(.+)$/i);
    if (m) return { dia: Number(m[1]), actividad: m[2].trim() };
    return { dia: i + 1, actividad: line };
  });
}

export const formVacioPaquete = {
  nombre: '',
  descripcion_corta: '',
  descripcion_larga: '',
  precio: '',
  tipo_precio: 'total',
  dias: '',
  destino_id: '',
  intereses: [],
  incluyeText: '',
  noIncluyeText: '',
  itinerarioText: '',
  imagen_url: '',
  incluye_transporte: false,
  apto_ninos: true,
  activo: true,
  visible_web: true,
};

export function paqueteToForm(p) {
  return {
    nombre: p.nombre || '',
    descripcion_corta: p.descripcion_corta || '',
    descripcion_larga: p.descripcion_larga || '',
    precio: String(p.precio ?? ''),
    tipo_precio: p.tipo_precio || 'total',
    dias: String(p.dias ?? ''),
    destino_id: p.destino_id ? String(p.destino_id) : '',
    intereses: Array.isArray(p.intereses) ? [...p.intereses] : [],
    incluyeText: arrayToLines(p.incluye),
    noIncluyeText: arrayToLines(p.no_incluye),
    itinerarioText: itinerarioToText(p.itinerario),
    imagen_url: p.imagen_url || '',
    incluye_transporte: Boolean(p.incluye_transporte),
    apto_ninos: p.apto_ninos !== false,
    activo: p.activo !== false,
    visible_web: p.visible_web !== false,
  };
}

export function formToPaqueteBody(form) {
  return {
    nombre: form.nombre.trim(),
    descripcion_corta: form.descripcion_corta.trim() || null,
    descripcion_larga: form.descripcion_larga.trim() || null,
    precio: Number(form.precio),
    tipo_precio: form.tipo_precio || 'total',
    dias: Number(form.dias),
    destino_id: form.destino_id ? Number(form.destino_id) : null,
    intereses: form.intereses || [],
    incluye: linesToArray(form.incluyeText),
    no_incluye: linesToArray(form.noIncluyeText),
    itinerario: textToItinerario(form.itinerarioText),
    imagen_url: normalizeImageUrl(form.imagen_url) || null,
    incluye_transporte: Boolean(form.incluye_transporte),
    apto_ninos: Boolean(form.apto_ninos),
    activo: Boolean(form.activo),
    visible_web: Boolean(form.visible_web),
  };
}
