/**
 * Google Gemini — solo redacción, sin inventar paquetes ni precios.
 * Requiere GEMINI_API_KEY en backend/.env (Google AI Studio, plan gratuito).
 */

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

export function geminiDisponible() {
  const key = (process.env.GEMINI_API_KEY || '').trim();
  return key.length > 10;
}

async function generarTexto(prompt, systemInstruction, options = {}) {
  const key = (process.env.GEMINI_API_KEY || '').trim();
  if (!key) return null;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${encodeURIComponent(key)}`;

  const body = {
    systemInstruction: systemInstruction
      ? { parts: [{ text: systemInstruction }] }
      : undefined,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: options.temperature ?? 0.35,
      maxOutputTokens: options.maxOutputTokens ?? 600,
      ...(options.responseMimeType
        ? { responseMimeType: options.responseMimeType }
        : {}),
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error?.message || res.statusText;
    throw new Error(`Gemini: ${msg}`);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  return text || null;
}

const SYSTEM_PLAN = `Eres el asistente de redacción de Tours Naranja (Córdoba, Colombia).
REGLAS ESTRICTAS:
- Solo explicas los datos JSON que te dan. NO inventes paquetes, precios, hoteles ni fechas.
- NO cambies el paquete recomendado ni cifras numéricas.
- Máximo 3 párrafos cortos, tono cálido y profesional, en español.
- Si el tipo es plan_personalizado o asesoria, invita a confirmar por WhatsApp sin prometer disponibilidad.
- Menciona que el precio es orientativo si hay precio_estimado.`;

/**
 * Texto amigable para la página resultado de Personaliza.
 */
const SYSTEM_PERSONALIZA = `Eres el asistente de Personaliza tu experiencia de Tours Naranja (Córdoba, Colombia).
Tu trabajo es PERSONALIZAR el tono del plan para ESTE cliente, usando SOLO el JSON que recibes.

REGLAS ESTRICTAS:
- NO inventes paquetes, hoteles, restaurantes ni destinos que no estén en el JSON.
- NO cambies nombres de aliados (hotel/restaurante): usa exactamente los mismos nombres si aparecen.
- NO inventes precios ni modifiques cifras (precio_estimado, presupuesto, precio_referencia).
- Debes devolver el MISMO número de días que itinerario_base (misma cantidad de elementos en "dias").
- Cada objeto en "dias" debe tener: dia (número), titulo (string), actividades (array de strings, 1 a 3 frases).
- Tono cálido, directo, en español, hablando al cliente (tú/usted según pareja/familia).
- Usa intereses, tipo_viaje, detalles_adicionales y destinos del JSON para personalizar.
- Si tipo es plan_personalizado, invita a confirmar por WhatsApp sin prometer cupos.
- Responde ÚNICAMENTE con JSON válido, sin markdown ni texto extra.`;

function parseJsonGemini(texto) {
  if (!texto) return null;
  const limpio = texto
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  try {
    return JSON.parse(limpio);
  } catch {
    return null;
  }
}

function mergeItinerarioConIa(base = [], iaDias = []) {
  if (!iaDias.length) return base;

  return base.map((diaBase, idx) => {
    const diaIa = iaDias.find((d) => Number(d.dia) === Number(diaBase.dia)) || iaDias[idx];
    if (!diaIa) return diaBase;

    const actividades = Array.isArray(diaIa.actividades)
      ? diaIa.actividades.filter(Boolean).slice(0, 4)
      : diaBase.actividades;

    const actividad =
      actividades?.join(' ') || diaIa.actividad || diaBase.actividad;

    return {
      ...diaBase,
      titulo: diaIa.titulo || diaBase.titulo,
      actividades: actividades?.length ? actividades : diaBase.actividades,
      actividad,
      hotel: diaBase.hotel,
      restaurante: diaBase.restaurante,
    };
  });
}

function payloadParaPersonalizar(resultado) {
  const itinerario = resultado.itinerario || resultado.dias || [];
  return {
    tipo: resultado.tipo,
    titulo: resultado.titulo,
    mensaje_sistema: resultado.mensaje,
    dias_solicitados: resultado.dias_solicitados,
    personas: resultado.personas,
    presupuesto: resultado.presupuesto,
    precio_estimado: resultado.precio_estimado,
    destinos_resumen: resultado.destinos_resumen,
    intereses: resultado.preferencias?.intereses,
    tipo_viaje: resultado.preferencias?.tipoViaje,
    detalles_adicionales: resultado.preferencias?.detallesAdicionales || '',
    hospedaje: resultado.preferencias?.hospedaje,
    gastronomia: resultado.preferencias?.gastronomiaAliados,
    paquete: resultado.paquete
      ? { nombre: resultado.paquete.nombre, descripcion_corta: resultado.paquete.descripcion_corta }
      : null,
    aliados: resultado.aliados,
    itinerario_base: itinerario.map((d) => ({
      dia: d.dia,
      titulo: d.titulo,
      actividades: d.actividades || [d.actividad].filter(Boolean),
      hotel: d.hotel?.nombre || null,
      restaurante: d.restaurante?.nombre || null,
    })),
  };
}

/**
 * Personaliza mensaje + redacción de cada día (itinerario) para este cliente.
 * El motor de reglas sigue eligiendo paquete/aliados; la IA adapta el lenguaje.
 */
export async function personalizarPlanConGemini(resultado) {
  if (!geminiDisponible()) return null;
  if (process.env.GEMINI_PERSONALIZA === 'false') return null;

  const payload = payloadParaPersonalizar(resultado);
  const prompt = `Personaliza este plan para el cliente. Devuelve JSON con esta forma exacta:
{"mensaje":"string","dias":[{"dia":1,"titulo":"string","actividades":["string"]}]}

Datos:\n${JSON.stringify(payload, null, 2)}`;

  try {
    const raw = await generarTexto(prompt, SYSTEM_PERSONALIZA, {
      temperature: 0.45,
      maxOutputTokens: 1400,
      responseMimeType: 'application/json',
    });
    const parsed = parseJsonGemini(raw);
    if (!parsed?.mensaje) {
      const mensajeSolo = await redactarMensajePlan(resultado);
      return mensajeSolo ? { mensaje: mensajeSolo, itinerario: null } : null;
    }

    const base = resultado.itinerario || resultado.dias || [];
    const itinerario =
      Array.isArray(parsed.dias) && parsed.dias.length === base.length
        ? mergeItinerarioConIa(base, parsed.dias)
        : null;

    return {
      mensaje: parsed.mensaje,
      itinerario,
    };
  } catch (err) {
    console.warn('[Gemini personaliza]', err.message);
    const mensajeSolo = await redactarMensajePlan(resultado);
    return mensajeSolo ? { mensaje: mensajeSolo, itinerario: null } : null;
  }
}

export async function redactarMensajePlan(resultado) {
  if (!geminiDisponible()) return null;

  const payload = {
    tipo: resultado.tipo,
    titulo: resultado.titulo,
    mensaje_sistema: resultado.mensaje,
    paquete: resultado.paquete
      ? {
          nombre: resultado.paquete.nombre,
          dias: resultado.paquete.dias,
          descripcion_corta: resultado.paquete.descripcion_corta,
        }
      : null,
    precio_estimado: resultado.precio_estimado,
    precio_nota: resultado.precio_nota,
    personas: resultado.personas,
    presupuesto: resultado.presupuesto,
    origen_salida: resultado.origen_salida,
    intereses: resultado.preferencias?.intereses,
    detalles_adicionales: resultado.preferencias?.detallesAdicionales || '',
    destinos_resumen: resultado.destinos_resumen || null,
    es_propuesta_cliente: resultado.es_propuesta_cliente || false,
    aliados: resultado.aliados || null,
    dias_solicitados: resultado.dias_solicitados || null,
  };

  const prompt = `Redacta el mensaje principal para el cliente según este resultado (JSON):\n${JSON.stringify(payload, null, 2)}`;

  try {
    return await generarTexto(prompt, SYSTEM_PLAN);
  } catch (err) {
    console.warn('[Gemini plan]', err.message);
    return null;
  }
}

const SYSTEM_CHAT = `Eres el asistente web de Tours Naranja.
REGLAS:
- Responde en español, máximo 120 palabras.
- Usa SOLO la lista FAQ proporcionada. Si la pregunta no está cubierta, di amablemente que un asesor atiende por WhatsApp y sugiere "Personaliza tu experiencia" en el menú.
- NO inventes precios, tours ni aliados.
- NO digas que eres ChatGPT ni Gemini.`;

/**
 * Respuesta de chat cuando no hay coincidencia exacta en FAQ.
 */
export async function responderChatConFaq(pregunta, faqLista = []) {
  if (!geminiDisponible()) return null;

  const faqTexto = faqLista
    .slice(0, 15)
    .map((f, i) => `${i + 1}. P: ${f.pregunta}\n   R: ${f.respuesta}`)
    .join('\n\n');

  const prompt = `Pregunta del visitante:\n"${pregunta}"\n\nFAQ oficial:\n${faqTexto || '(vacía)'}`;

  try {
    return await generarTexto(prompt, SYSTEM_CHAT);
  } catch (err) {
    console.warn('[Gemini chat]', err.message);
    return null;
  }
}
