const fmt = (n, lang) => {
  if (n == null || Number.isNaN(Number(n))) return null;
  return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n);
};

function bullet(text) {
  return text ? `• ${text}` : null;
}

function section(title) {
  return ['', `--- ${title} ---`];
}

function formatAliadoLine(item, lang, w) {
  if (!item?.nombre) return null;
  const parts = [item.nombre];
  if (item.destino_nombre) {
    parts.push(`${w.inDestination}: ${item.destino_nombre}`);
  }
  if (item.ubicacion) parts.push(item.ubicacion);
  const price = fmt(item.precio_referencia, lang);
  if (price) parts.push(`${w.refPrice}: ${price}`);
  return bullet(parts.join(' · '));
}

function mapTipoPlan(plan, w) {
  if (plan.tipo === 'paquete_oficial') return w.typeOfficial;
  if (plan.tipo === 'asesoria') return w.typeAdvisory;
  if (plan.tipo === 'plan_personalizado') return w.typeCustom;
  return plan.tipo || w.typeCustom;
}

function mapPersonas(prefs, plan, planForm) {
  const key = prefs.personas;
  const labels = {
    '1': planForm.people1,
    '2': planForm.people2,
    '3': planForm.people3,
    '4': planForm.people4,
    '5+': planForm.people5,
  };
  const label = labels[key] || key;
  if (plan.personas != null && label) return `${label} (${plan.personas})`;
  return label || (plan.personas != null ? String(plan.personas) : null);
}

function mapTripType(prefs, planForm) {
  const map = {
    pareja: planForm.tripCouple,
    familia: planForm.tripFamily,
    amigos: planForm.tripFriends,
    solo: planForm.tripSolo,
  };
  return map[prefs.tipoViaje] || prefs.tipoViaje;
}

function mapTransport(prefs, planForm) {
  const map = {
    si: planForm.transportYes,
    no: planForm.transportNo,
    parcial: planForm.transportPartial,
  };
  return map[prefs.necesitaTransporte] || prefs.necesitaTransporte;
}

function mapLodging(prefs, planForm) {
  const map = {
    si: planForm.lodgingYes,
    no: planForm.lodgingNo,
    ya_tengo: planForm.lodgingHave,
  };
  return map[prefs.hospedaje] || prefs.hospedaje;
}

function mapFood(prefs, planForm) {
  const map = { si: planForm.foodYes, no: planForm.foodNo };
  return map[prefs.gastronomiaAliados] || prefs.gastronomiaAliados;
}

function formatDay(day, lang, w) {
  const header = day.titulo
    ? `${w.day} ${day.dia}: ${day.titulo}`
    : `${w.day} ${day.dia}`;
  const lines = [header];
  const actividades = day.actividades?.length ? day.actividades : [day.actividad].filter(Boolean);
  for (const act of actividades) {
    lines.push(`  - ${act}`);
  }
  if (day.hotel?.nombre) {
    lines.push(`  ${w.hotel}: ${day.hotel.nombre}`);
  }
  if (day.restaurante?.nombre) {
    lines.push(`  ${w.restaurant}: ${day.restaurante.nombre}`);
  }
  return lines;
}

/**
 * Mensaje estructurado para WhatsApp al asesor (incluye aliados e itinerario).
 */
export function buildWhatsappPlanMessage(plan, lang, w, planForm) {
  const prefs = plan.preferencias || {};
  const lines = [w.greeting];

  lines.push(...section(w.sectionSummary));
  lines.push(
    bullet(`${w.planType}: ${mapTipoPlan(plan, w)}`),
    bullet(`${w.title}: ${plan.titulo}`),
    plan.subtitulo ? bullet(`${w.subtitle}: ${plan.subtitulo}`) : null,
    plan.paquete?.nombre ? bullet(`${w.package}: ${plan.paquete.nombre}`) : null,
    plan.precio_estimado != null
      ? bullet(`${w.estimated}: ${fmt(plan.precio_estimado, lang)}`)
      : bullet(`${w.estimated}: ${w.priceOnRequest}`),
    (plan.diasSolicitados ?? prefs.dias)
      ? bullet(`${w.days}: ${plan.diasSolicitados ?? prefs.dias}`)
      : null,
    mapPersonas(prefs, plan, planForm)
      ? bullet(`${w.people}: ${mapPersonas(prefs, plan, planForm)}`)
      : null,
    (plan.presupuesto ?? prefs.presupuesto)
      ? bullet(`${w.budget}: ${fmt(plan.presupuesto ?? prefs.presupuesto, lang)}`)
      : null,
    plan.destinos_resumen ? bullet(`${w.destinations}: ${plan.destinos_resumen}`) : null,
    prefs.ayudaElegir ? bullet(`${w.helpChoose}: ${w.yes}`) : null
  );

  lines.push(...section(w.sectionTrip));
  lines.push(
    prefs.intereses?.length ? bullet(`${w.interests}: ${prefs.intereses.join(', ')}`) : null,
    mapTripType(prefs, planForm) ? bullet(`${w.tripType}: ${mapTripType(prefs, planForm)}`) : null,
    mapTransport(prefs, planForm)
      ? bullet(`${w.transport}: ${mapTransport(prefs, planForm)}`)
      : null,
    mapLodging(prefs, planForm) ? bullet(`${w.lodging}: ${mapLodging(prefs, planForm)}`) : null,
    mapFood(prefs, planForm) ? bullet(`${w.foodAllies}: ${mapFood(prefs, planForm)}`) : null
  );

  const aliados = plan.aliados || {};
  const hoteles = aliados.hoteles || [];
  const restaurantes = aliados.restaurantes || [];
  const otros = aliados.otros || [];

  lines.push(...section(w.sectionAllies));
  if (plan.aliados_aviso) {
    lines.push(bullet(`${w.alliesNotice}: ${plan.aliados_aviso}`));
  }
  if (hoteles.length) {
    lines.push(w.hotels);
    for (const h of hoteles) lines.push(formatAliadoLine(h, lang, w));
  }
  if (restaurantes.length) {
    lines.push(w.restaurants);
    for (const r of restaurantes) lines.push(formatAliadoLine(r, lang, w));
  }
  if (otros.length) {
    lines.push(w.extras);
    for (const o of otros) lines.push(formatAliadoLine(o, lang, w));
  }
  if (!hoteles.length && !restaurantes.length && !otros.length && !plan.aliados_aviso) {
    lines.push(w.noAllies);
  }

  const listaDias = plan.itinerario?.length ? plan.itinerario : plan.dias || [];
  if (listaDias.length) {
    lines.push(...section(w.sectionItinerary));
    for (const day of listaDias) {
      lines.push(...formatDay(day, lang, w));
    }
  }

  if (prefs.detallesAdicionales) {
    lines.push(...section(w.sectionNotes));
    lines.push(prefs.detallesAdicionales);
  }

  if (plan.mensaje) {
    lines.push(bullet(`${w.systemMessage}: ${plan.mensaje}`));
  }
  if (plan.mensaje_ia) {
    lines.push(bullet(`${w.aiMessage}: ${plan.mensaje_ia}`));
  }
  if (plan.nota) {
    lines.push(bullet(`${w.priceNote}: ${plan.nota}`));
  }
  if (plan.alternativas?.length) {
    lines.push(
      bullet(
        `${w.alternatives}: ${plan.alternativas.map((a) => a.nombre).join(' · ')}`
      )
    );
  }
  if (plan.paquete_cercano?.nombre) {
    lines.push(bullet(`${w.nearPackage}: ${plan.paquete_cercano.nombre}`));
  }

  lines.push('', w.closing);

  return lines.filter((line) => line != null).join('\n');
}
