import { planMock } from '../data/mockData';
import { apiUrl } from '../lib/apiUrl.js';

/**
 * Llama al motor real en el backend.
 * @param {object} prefs — datos del formulario Personaliza
 */
export async function fetchPlanFromApi(prefs) {
  const res = await fetch(apiUrl('/api/planes/generar'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prefs),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'No se pudo generar el plan');
  return mapApiPlan(data);
}

function mapApiPlan(data) {
  const paquete = data.paquete || null;
  const precioMostrar =
    data.precio_estimado != null ? data.precio_estimado : paquete?.precio ?? null;

  return {
    tipo: data.tipo,
    titulo: data.titulo,
    subtitulo: data.subtitulo,
    personas: data.personas,
    presupuesto: data.presupuesto,
    paquete: paquete
      ? { ...paquete, precio: precioMostrar ?? paquete.precio }
      : null,
    paqueteId: data.paqueteId,
    diasSolicitados:
      data.dias_solicitados ??
      (Number.isFinite(Number(data.preferencias?.dias))
        ? Number(data.preferencias.dias)
        : null),
    itinerario: data.itinerario || data.dias || [],
    dias: data.itinerario || data.dias || [],
    aliados: data.aliados || { hoteles: [], restaurantes: [], otros: [] },
    aliados_aviso: data.aliados_aviso || null,
    nota: data.precio_nota || data.mensaje || '',
    mensaje: data.mensaje,
    mensaje_ia: data.mensaje_ia || null,
    gemini: Boolean(data.gemini),
    gemini_personalizado: Boolean(data.gemini_personalizado),
    precio_estimado: data.precio_estimado,
    complementos: data.complementos || [],
    alternativas: data.alternativas || [],
    origen_salida: data.origen_salida,
    paquete_cercano: data.paquete_cercano,
    destinos_resumen: data.destinos_resumen || null,
    es_propuesta_cliente: Boolean(data.es_propuesta_cliente),
    fromApi: true,
    preferencias: data.preferencias,
  };
}

/** Solo si no hay preferencias (entrada directa a resultado sin formulario) */
export function buildPlanFromPreferences(prefs) {
  if (!prefs || typeof prefs !== 'object') {
    return { ...planMock, fromApi: false, tipo: 'preview' };
  }
  return null;
}
