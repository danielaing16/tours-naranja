/**
 * Motor de recomendación — Personaliza tu experiencia
 * Recomienda 1 de los paquetes oficiales en BD o deriva a asesoría humana.
 */

const SCORE_MIN_PAQUETE = 45;
const DIAS_MAX = 14;

/** Días que el cliente pidió en el formulario (fuente única de verdad). */
export function parseDiasSolicitados(valor) {
  const n = parseInt(String(valor ?? '').trim(), 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, DIAS_MAX);
}

const ZENU_ENTRADA_PP = 40_000;
const TRANSPORTE_MONTERIA = { small: 550_000, mid: 850_000, bus: 1_700_000 };
const TRANSPORTE_LORICA = { small: 250_000, mid: 400_000, bus: 750_000 };
const SINU_PP = 450_000;

/** Claves internas por nombre de paquete (parcial) */
function paqueteKey(nombre = '') {
  const n = nombre.toLowerCase();
  if (n.includes('zenú') || n.includes('zenu') || n.includes('cultural')) return 'zenu';
  if (n.includes('náutico') || n.includes('nautico') || n.includes('sinú') || n.includes('sinu'))
    return 'sinu';
  if (n.includes('córdoba') || n.includes('cordoba') || n.includes('caribe')) return 'caribe';
  return 'otro';
}

export function personasToCount(valor) {
  const map = { '1': 1, '2': 2, '3': 3, '4': 4, '5+': 8, '3-4': 4 };
  const n = Number(valor);
  return map[String(valor)] ?? (Number.isFinite(n) && n > 0 ? n : 2);
}

function transporteZenu(personas, origen = 'monteria') {
  const tab = origen === 'lorica' ? TRANSPORTE_LORICA : TRANSPORTE_MONTERIA;
  if (personas <= 4) return tab.small;
  if (personas <= 15) return tab.mid;
  return tab.bus;
}

export function estimarPrecio(paquete, personas, origen = 'monteria') {
  const key = paqueteKey(paquete.nombre);
  const n = personasToCount(personas);

  if (key === 'zenu') {
    return ZENU_ENTRADA_PP * n + transporteZenu(n, origen);
  }
  if (key === 'sinu' || paquete.tipo_precio === 'por_persona') {
    const base = Number(paquete.precio) || SINU_PP;
    return base * n;
  }
  if (key === 'caribe') {
    return null;
  }
  if (paquete.tipo_precio === 'por_persona') {
    return (Number(paquete.precio) || 0) * n;
  }
  return Number(paquete.precio) || null;
}

function inferirOrigenZenu(nombresDestinos = []) {
  const text = nombresDestinos.join(' ').toLowerCase();
  const tieneLorica = text.includes('lorica');
  const tieneMonteria = text.includes('montería') || text.includes('monteria');
  if (tieneLorica && !tieneMonteria) return 'lorica';
  return 'monteria';
}

function destinoHints(nombres = []) {
  const t = nombres.join(' ').toLowerCase();
  return {
    zenu: /tuchín|tuchin|zenú|zenu|resguardo/.test(t),
    sinu: /sinú|sinu|náutico|nautico|catamarán|catamaran/.test(t),
    caribe:
      /caribe|cispatá|cispata|sanguaré|sanguare|cartagena|bahía|bahia/.test(t) ||
      (/san antero/.test(t) && /lorica|montería|monteria/.test(t)),
    monteria: /montería|monteria/.test(t),
    lorica: /lorica/.test(t),
    sanAntero: /san antero/.test(t),
    costa: /san bernardo|bernard|ciénaga|cienaga|tolu|ovejas|turbaco/.test(t),
  };
}

function scorePaquete(paquete, prefs, destinoNombres, personasNum, precioEst) {
  const key = paqueteKey(paquete.nombre);
  const diasPedidos = parseDiasSolicitados(prefs.dias);
  const diasPkg = Number(paquete.dias) || 0;
  const hints = destinoHints(destinoNombres);
  let score = 0;

  const diffDias = Math.abs(diasPedidos - diasPkg);
  if (diasPedidos > 0) {
    if (diffDias === 0) score += 30;
    else if (diffDias === 1) score += 15;
    else if (diffDias === 2) score += 5;
  } else {
    score += 10;
  }

  if (!prefs.ayudaElegir && destinoNombres.length > 0) {
    if (key === 'zenu' && (hints.zenu || hints.lorica || (hints.monteria && !hints.sinu))) score += 25;
    if (key === 'sinu' && (hints.sinu || (hints.monteria && diasPedidos >= 2))) score += 22;
    if (key === 'sinu' && hints.lorica && diasPedidos <= 2) score += 12;
    if (key === 'caribe' && (hints.caribe || hints.sanAntero)) score += 25;
    if (key === 'sinu' && hints.sanAntero && diasPedidos <= 2) score += 10;
  } else if (prefs.ayudaElegir) {
    if (key === 'zenu' && diasPedidos === 1) score += 15;
    if (key === 'sinu' && diasPedidos === 2) score += 15;
    if (key === 'caribe' && diasPedidos >= 3) score += 15;
  }

  const interesesUser = Array.isArray(prefs.intereses) ? prefs.intereses : [];
  const interesesPkg = Array.isArray(paquete.intereses) ? paquete.intereses : [];
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  for (const iu of interesesUser) {
    const a = norm(iu);
    if (interesesPkg.some((ip) => norm(ip) === a || norm(ip).includes(a) || a.includes(norm(ip)))) {
      score += 10;
    }
    if (iu === 'Fotografía' && ['Cultura', 'Naturaleza'].some((x) => interesesPkg.includes(x)))
      score += 3;
  }

  const presupuesto = Number(prefs.presupuesto);
  if (presupuesto > 0 && precioEst != null && precioEst > 0) {
    if (precioEst <= presupuesto) score += 25;
    else if (precioEst <= presupuesto * 1.2) score += 10;
    else score -= 15;
  } else if (presupuesto > 0 && precioEst == null && key === 'caribe') {
    score += 5;
  }

  if (prefs.tipoViaje === 'familia' && paquete.apto_ninos === false) score -= 30;

  if (key === 'zenu' && diasPedidos >= 3) score -= 10;
  if (key === 'caribe' && diasPedidos === 1) score -= 10;

  return Math.max(0, score);
}

export async function generarPlan(supabase, body) {
  const diasSolicitados = parseDiasSolicitados(body.dias);
  const prefs = {
    destinosSeleccionados: body.destinosSeleccionados || [],
    ayudaElegir: Boolean(body.ayudaElegir),
    presupuesto: body.presupuesto,
    dias: diasSolicitados,
    personas: body.personas,
    tipoViaje: body.tipoViaje,
    intereses: body.intereses || [],
    necesitaTransporte: body.necesitaTransporte,
    hospedaje: body.hospedaje,
    gastronomiaAliados: body.gastronomiaAliados,
    detallesAdicionales: body.detallesAdicionales || '',
    origenSalida: body.origenSalida,
  };

  const personasNum = personasToCount(prefs.personas);

  let destinoNombres = [];
  if (prefs.destinosSeleccionados.length > 0) {
    const { data: destinos } = await supabase
      .from('destinos')
      .select('id, nombre')
      .in('id', prefs.destinosSeleccionados);
    destinoNombres = (destinos || []).map((d) => d.nombre);
  }

  const origenZenu =
    prefs.origenSalida === 'lorica' || prefs.origenSalida === 'monteria'
      ? prefs.origenSalida
      : inferirOrigenZenu(destinoNombres);

  const { data: paquetes, error: errPaq } = await supabase
    .from('paquetes')
    .select('*')
    .eq('activo', true)
    .eq('visible_web', true);

  if (errPaq) throw errPaq;
  const lista = paquetes || [];
  if (lista.length === 0) {
    const { lista: complementos, aviso: aliadosAviso } = await buscarComplementos(
      supabase,
      prefs,
      prefs.destinosSeleccionados || []
    );
    const plan = generarPlanPersonalizado(
      prefs,
      personasNum,
      destinoNombres,
      complementos,
      null,
      0,
      origenZenu,
      aliadosAviso
    );
    return {
      ...plan,
      mensaje:
        'No hay paquetes oficiales activos; esta propuesta personalizada la confirma un asesor.',
    };
  }

  const ranked = lista
    .map((p) => {
      const precioEst = estimarPrecio(p, prefs.personas, origenZenu);
      const score = scorePaquete(p, prefs, destinoNombres, personasNum, precioEst);
      return { paquete: p, score, precioEst };
    })
    .sort((a, b) => b.score - a.score);

  const mejor = ranked[0];
  const { lista: complementos, aviso: aliadosAviso } = await buscarComplementos(
    supabase,
    prefs,
    prefs.destinosSeleccionados || []
  );

  if (!mejor || mejor.score < SCORE_MIN_PAQUETE) {
    return generarPlanPersonalizado(
      prefs,
      personasNum,
      destinoNombres,
      complementos,
      mejor?.paquete || null,
      mejor?.score ?? 0,
      origenZenu,
      aliadosAviso
    );
  }

  const { paquete, score, precioEst } = mejor;
  const itinerarioRaw = Array.isArray(paquete.itinerario) ? paquete.itinerario : [];
  const itinerario = normalizarItinerario(
    itinerarioRaw.length > 0
      ? itinerarioRaw.slice(0, diasSolicitados)
      : plantillaItinerarioOficial(diasSolicitados),
    diasSolicitados
  );

  let precioNota =
    'Precio orientativo. Confirmación final y disponibilidad por WhatsApp.';
  if (precioEst == null) {
    precioNota =
      'Este tour requiere cotización según grupo e itinerario. Contáctanos por WhatsApp.';
  }

  return {
    tipo: 'paquete_oficial',
    paquete,
    paqueteId: paquete.id,
    score,
    precio_estimado: precioEst,
    precio_nota: precioNota,
    origen_salida: paqueteKey(paquete.nombre) === 'zenu' ? origenZenu : null,
    personas: personasNum,
    presupuesto: Number(prefs.presupuesto) || null,
    titulo: `Tu plan sugerido — ${paquete.nombre}`,
    subtitulo: buildSubtitulo(prefs),
    dias_solicitados: diasSolicitados,
    itinerario,
    dias: itinerario,
    aliados: agruparAliados(complementos),
    complementos,
    aliados_aviso: aliadosAviso,
    mensaje:
      'Según tus respuestas, este paquete oficial de Tours Naranja encaja mejor contigo.',
    alternativas: ranked.slice(1, 3).map((r) => ({
      id: r.paquete.id,
      nombre: r.paquete.nombre,
      score: r.score,
    })),
    preferencias: prefs,
    fromApi: true,
  };
}

function buildSubtitulo(prefs) {
  const parts = [];
  if (Array.isArray(prefs.intereses) && prefs.intereses.length) {
    parts.push(prefs.intereses.join(' · '));
  }
  if (prefs.tipoViaje) parts.push(`Viaje: ${prefs.tipoViaje}`);
  return parts.join(' · ') || 'Experiencia personalizada Tours Naranja';
}

function enriquecerComplemento(fila) {
  const dest = fila.destinos || null;
  const municipio = fila.municipio || dest?.municipio || dest?.nombre || null;
  const partesUbicacion = [fila.direccion, municipio].filter(Boolean);
  return {
    ...fila,
    destino_id: fila.destino_id ?? dest?.id ?? null,
    destino_nombre: dest?.nombre || null,
    municipio,
    ubicacion: partesUbicacion.length ? partesUbicacion.join(' · ') : dest?.nombre || null,
  };
}

/**
 * Aliados (hoteles/restaurantes) SOLO del destino que eligió el cliente.
 * Requiere complementos.destino_id = destinos.id del formulario.
 * La IA no consulta la BD; solo este motor.
 */
async function buscarComplementos(supabase, prefs, destinoIds = []) {
  const quiere =
    prefs.hospedaje === 'si' || prefs.gastronomiaAliados === 'si' || prefs.necesitaTransporte === 'parcial';
  if (!quiere) return { lista: [], aviso: null };

  const tipos = [];
  if (prefs.hospedaje === 'si') tipos.push('hotel');
  if (prefs.gastronomiaAliados === 'si') tipos.push('restaurante');

  const ids = (destinoIds || []).map((id) => Number(id)).filter((id) => id > 0);

  if (ids.length === 0) {
    return {
      lista: [],
      aviso:
        'Para sugerir hoteles o restaurantes aliados, selecciona al menos un destino en el formulario.',
    };
  }

  let q = supabase
    .from('complementos')
    .select('*, destinos(id, nombre, municipio, descripcion_corta)')
    .eq('activo', true)
    .in('destino_id', ids);

  if (tipos.length) q = q.in('tipo', tipos);

  const { data, error } = await q.order('nombre', { ascending: true }).limit(12);
  if (error) {
    console.warn('[complementos]', error.message);
    return { lista: [], aviso: 'No se pudieron cargar aliados en este momento.' };
  }

  const lista = (data || []).map(enriquecerComplemento);

  let aviso = null;
  if (lista.length === 0 && (prefs.hospedaje === 'si' || prefs.gastronomiaAliados === 'si')) {
    aviso =
      'Aún no hay hoteles o restaurantes aliados registrados para el destino seleccionado. Un asesor te confirma opciones en esa zona por WhatsApp.';
  }

  return { lista, aviso };
}

function agruparAliados(complementos = []) {
  return {
    hoteles: complementos.filter((c) => c.tipo === 'hotel'),
    restaurantes: complementos.filter((c) => c.tipo === 'restaurante'),
    otros: complementos.filter((c) => c.tipo !== 'hotel' && c.tipo !== 'restaurante'),
  };
}

function plantillaItinerarioOficial(cantidad) {
  return Array.from({ length: cantidad }, (_, i) => ({
    dia: i + 1,
    titulo: `Día ${i + 1}`,
    actividad: 'Actividad según paquete oficial Tours Naranja.',
    actividades: ['Actividad según paquete oficial Tours Naranja.'],
  }));
}

function normalizarItinerario(items, diasSolicitados) {
  const base = (items || []).slice(0, diasSolicitados).map((d, i) => ({
    dia: d.dia ?? i + 1,
    titulo: d.titulo || `Día ${d.dia ?? i + 1}`,
    actividad: d.actividad || d.actividades?.[0] || 'Actividad por confirmar con asesor.',
    actividades: Array.isArray(d.actividades)
      ? d.actividades
      : [d.actividad || 'Actividad por confirmar con asesor.'],
    hotel: d.hotel || null,
    restaurante: d.restaurante || null,
  }));

  while (base.length < diasSolicitados) {
    const n = base.length + 1;
    base.push({
      dia: n,
      titulo: `Día ${n}`,
      actividad: 'Actividad por confirmar con asesor Tours Naranja.',
      actividades: ['Actividad por confirmar con asesor Tours Naranja.'],
      hotel: null,
      restaurante: null,
    });
  }

  return base;
}

const ACTIVIDADES_DESTINO = {
  zenu: 'Experiencia cultural en el Resguardo Zenú (Tuchín): recorrido, artesanía y encuentro con la comunidad.',
  sinu: 'Tour náutico por el Río Sinú: catamarán, paisaje fluvial y paradas acordadas con guía local.',
  caribe: 'Recorrido Ruta Córdoba y Caribe: litoral, manglares o destinos costeros según temporada.',
  monteria: 'Montería: gastronomía cordobesa, ciudad y logística de salida o regreso.',
  lorica: 'Lorica y zona cercana: costa, paseo local y conexión con tu ruta.',
  sanAntero: 'San Antero / litoral: playa y ambiente caribeño según disponibilidad.',
};

function mapAliado(complemento) {
  if (!complemento) return null;
  return {
    nombre: complemento.nombre,
    descripcion: complemento.descripcion || null,
    precio_referencia: complemento.precio_referencia ?? null,
    convenio: complemento.convenio || null,
    ubicacion: complemento.ubicacion || null,
    direccion: complemento.direccion || null,
    municipio: complemento.municipio || null,
    destino_nombre: complemento.destino_nombre || null,
  };
}

function plantillasPorDestino(destinoNombres, intereses, prefs) {
  const hints = destinoHints(destinoNombres);
  const foco = intereses.length ? intereses.join(', ') : 'experiencias locales';
  const principal = destinoNombres[0] || 'Córdoba';
  const plantillas = [];

  if (hints.costa || /san bernardo|bernard/i.test(principal.toLowerCase())) {
    plantillas.push({
      titulo: 'Costa y llegada',
      actividad: `Recorrido por ${principal}: playa, paseo local y panorámicas del litoral cordobés.`,
    });
    plantillas.push({
      titulo: 'Naturaleza y mar',
      actividad: `Mañana de naturaleza en ${principal} con enfoque en ${foco}. Tarde libre o mirador.`,
    });
  }

  if (hints.zenu) {
    plantillas.push({
      titulo: 'Cultura Zenú',
      actividad: ACTIVIDADES_DESTINO.zenu,
    });
  }
  if (hints.sinu) {
    plantillas.push({
      titulo: 'Río Sinú',
      actividad: ACTIVIDADES_DESTINO.sinu,
    });
  }
  if (hints.caribe) {
    plantillas.push({
      titulo: 'Ruta Caribe',
      actividad: ACTIVIDADES_DESTINO.caribe,
    });
  }

  if (plantillas.length === 0 && destinoNombres.length > 0) {
    destinoNombres.forEach((nombre, idx) => {
      plantillas.push({
        titulo: idx === 0 ? 'Exploración principal' : `Día en ${nombre}`,
        actividad: `Experiencia en ${nombre} con enfoque en ${foco}.`,
      });
    });
  }

  if (plantillas.length === 0) {
    plantillas.push({
      titulo: 'Propuesta Tours Naranja',
      actividad: 'Itinerario coordinado con asesor según temporada y disponibilidad.',
    });
  }

  if (prefs.detallesAdicionales?.trim()) {
    plantillas[0].actividad = `${plantillas[0].actividad} Notas: ${prefs.detallesAdicionales.trim()}`;
  }

  return plantillas;
}

function construirItinerarioPersonalizado(prefs, destinoNombres, complementos) {
  const diasSolicitados = parseDiasSolicitados(prefs.dias);
  const intereses = Array.isArray(prefs.intereses) ? prefs.intereses : [];
  const plantillas = plantillasPorDestino(destinoNombres, intereses, prefs);
  const { hoteles, restaurantes } = agruparAliados(complementos);

  const itinerario = [];
  for (let i = 0; i < diasSolicitados; i += 1) {
    const plantilla = plantillas[i] || plantillas[plantillas.length - 1];
    const actividades = [plantilla.actividad];

    if (i === 0 && prefs.necesitaTransporte === 'si') {
      actividades.unshift('Traslado coordinado por Tours Naranja.');
    }
    if (i === diasSolicitados - 1 && diasSolicitados > 1) {
      actividades.push('Cierre del viaje y confirmación final con asesor.');
    }

    const hotel = prefs.hospedaje === 'si' ? hoteles[i % Math.max(hoteles.length, 1)] : null;
    const restaurante =
      prefs.gastronomiaAliados === 'si'
        ? restaurantes[i % Math.max(restaurantes.length, 1)]
        : null;

    if (hotel) {
      const donde = hotel.ubicacion ? ` — ${hotel.ubicacion}` : '';
      actividades.push(`Hospedaje sugerido: ${hotel.nombre}${donde}.`);
    }
    if (restaurante) {
      const donde = restaurante.ubicacion ? ` — ${restaurante.ubicacion}` : '';
      actividades.push(`Gastronomía aliada: ${restaurante.nombre}${donde}.`);
    }

    itinerario.push({
      dia: i + 1,
      titulo: plantilla.titulo,
      actividad: actividades.join(' '),
      actividades,
      hotel: mapAliado(hotel),
      restaurante: mapAliado(restaurante),
    });
  }

  return { diasSolicitados, itinerario };
}

function estimarPrecioPersonalizado(prefs, personasNum, complementos, paqueteCercano, origenZenu) {
  let extra = 0;
  for (const c of complementos) {
    if (c.precio_referencia) extra += Number(c.precio_referencia);
  }

  if (paqueteCercano) {
    const base = estimarPrecio(paqueteCercano, prefs.personas, origenZenu);
    if (base != null) {
      const orientativo = Math.round(base * 0.9) + extra;
      return {
        precio: orientativo,
        nota:
          'Precio orientativo a partir del paquete más cercano y complementos; confirmación por WhatsApp.',
      };
    }
  }

  if (extra > 0) {
    return {
      precio: extra,
      nota: 'Suma referencial de complementos aliados; el tour base se cotiza con asesor.',
    };
  }

  return {
    precio: null,
    nota: 'Cotización final por WhatsApp según grupo, fechas y disponibilidad.',
  };
}

/**
 * Plan propio del cliente: no se inserta en tabla paquetes.
 * Solo propuesta en pantalla (+ historial opcional en planes_generados).
 */
export function generarPlanPersonalizado(
  prefs,
  personasNum,
  destinoNombres,
  complementos = [],
  paqueteCercano = null,
  score = 0,
  origenZenu = 'monteria',
  aliadosAviso = null
) {
  const { diasSolicitados, itinerario } = construirItinerarioPersonalizado(
    prefs,
    destinoNombres,
    complementos
  );
  const { precio, nota } = estimarPrecioPersonalizado(
    prefs,
    personasNum,
    complementos,
    paqueteCercano,
    origenZenu
  );

  const destinosTexto =
    destinoNombres.length > 0 ? destinoNombres.join(' · ') : 'A definir con asesor';

  return {
    tipo: 'plan_personalizado',
    paquete: null,
    paqueteId: null,
    paquete_cercano: paqueteCercano
      ? { id: paqueteCercano.id, nombre: paqueteCercano.nombre, score }
      : null,
    score: 0,
    precio_estimado: precio,
    precio_nota: nota,
    personas: personasNum,
    presupuesto: Number(prefs.presupuesto) || null,
    dias_solicitados: diasSolicitados,
    titulo: `Tu plan personalizado — ${diasSolicitados} día${diasSolicitados !== 1 ? 's' : ''}`,
    subtitulo: buildSubtitulo(prefs),
    destinos_resumen: destinosTexto,
    itinerario,
    dias: itinerario,
    aliados: agruparAliados(complementos),
    complementos,
    aliados_aviso: aliadosAviso,
    mensaje:
      'Armamos una propuesta solo para ti según tus destinos e intereses. No es un paquete del catálogo: un asesor confirma precio y fechas por WhatsApp.',
    alternativas: [],
    preferencias: prefs,
    es_propuesta_cliente: true,
    fromApi: true,
  };
}

/** @deprecated Usar generarPlanPersonalizado — alias para compatibilidad */
function respuestaAsesoria(prefs, personasNum, mensaje, paqueteCercano, score, complementos) {
  const plan = generarPlanPersonalizado(
    prefs,
    personasNum,
    [],
    complementos,
    paqueteCercano,
    score,
    'monteria'
  );
  return { ...plan, mensaje };
}
