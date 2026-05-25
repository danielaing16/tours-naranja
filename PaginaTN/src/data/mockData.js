export const paquetes = [
  {
    id: 1,
    nombre: "Ruta del Patrimonio",
    precio: 420000,
    dias: 3,
    intereses: ["Cultura", "Gastronomía"],
    ritmo: "Relajado",
    imagen: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
    imagen_url: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
    descripcion: "Recorrido por el centro histórico, museos y experiencias gastronómicas locales.",
    descripcion_corta: "Recorrido por el centro histórico, museos y experiencias gastronómicas locales.",
    incluye: ["Guía bilingüe", "Almuerzo típico", "Entrada a museos"],
    destacado: true,
  },
  {
    id: 2,
    nombre: "Aventura en la Montaña",
    precio: 580000,
    dias: 2,
    intereses: ["Aventura", "Naturaleza"],
    ritmo: "Intenso",
    imagen: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    imagen_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    descripcion: "Senderismo, miradores y contacto con la naturaleza de Córdoba.",
    descripcion_corta: "Senderismo, miradores y contacto con la naturaleza de Córdoba.",
    incluye: ["Transporte 4x4", "Equipo básico", "Refrigerio"],
    destacado: true,
  },
  {
    id: 3,
    nombre: "Relax & Café",
    precio: 310000,
    dias: 2,
    intereses: ["Relax", "Gastronomía"],
    ritmo: "Relajado",
    imagen: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    imagen_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    descripcion: "Tour cafetero, spa rural y tarde libre en pueblo patrimonio.",
    descripcion_corta: "Tour cafetero, spa rural y tarde libre en pueblo patrimonio.",
    incluye: ["Degustación de café", "Masaje 30 min"],
    destacado: true,
  },
  {
    id: 4,
    nombre: "Fotografía Urbana",
    precio: 350000,
    dias: 1,
    intereses: ["Fotografía", "Cultura"],
    ritmo: "Moderado",
    imagen: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    imagen_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    descripcion: "Rutas al amanecer y atardecer con puntos icónicos para fotografía.",
    descripcion_corta: "Rutas al amanecer y atardecer con puntos icónicos para fotografía.",
    incluye: ["Guía fotógrafo", "Mapa de spots"],
    destacado: false,
  },
];

/** Respaldo si la API no responde o la BD está vacía (ver backend/data/blog-posts.json) */
export const blogPosts = [
  {
    id: 1,
    slug: "atardecer-monteria",
    titulo: "Atardecer en el río Sinú: una experiencia real en Montería",
    fecha: "12 mayo 2026",
    extracto: "Cómo vivimos un tour al atardecer con viajeros de Medellín: ritmo, seguridad y momentos reales.",
    imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    contenido:
      "Montería se conoce mejor cuando el calor baja y el río Sinú refleja el cielo naranja.\n\nNuestro grupo salió desde el centro histórico a las 4:00 p.m. El guía compartió historias del malecón mientras el sol se ponía.\n\n• Recorrido a pie por puntos clave del centro.\n• Tiempo en el malecón para fotos sin prisa.\n• Recomendaciones de cena con aliados gastronómicos.\n\nPrecio y cupos se confirman por WhatsApp.",
  },
  {
    id: 2,
    slug: "gastronomia-cordobesa",
    titulo: "5 sabores cordobeses que no puedes perderte",
    fecha: "3 mayo 2026",
    extracto: "Desde el mote de queso hasta postres de coco: guía honesta con aliados locales.",
    imagen: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
    contenido:
      "La gastronomía es una de las razones por las que muchos eligen Córdoba.\n\n1. Mote de queso.\n2. Arepa de huevo cordobesa.\n3. Pescado del Sinú.\n4. Dulces de coco.\n5. Jugos tropicales.\n\nEn cada paquete gastronómico incluimos paradas curadas. Indica restricciones alimentarias al reservar.",
  },
  {
    id: 3,
    slug: "familias-cordoba",
    titulo: "Viajar en familia por Córdoba: tips reales",
    fecha: "20 abril 2026",
    extracto: "Ritmo, transporte, hidratación y actividades aptas para niños.",
    imagen: "https://images.unsplash.com/photo-1511895426328-dc8714192050?w=1200&q=80",
    contenido:
      "Viajar con niños en el trópico requiere planificación sencilla.\n\n• Salidas temprano o después de las 3:00 p.m.\n• Bloques de 90 minutos + descanso a la sombra.\n• Transporte con aire en tramos largos.\n\nTours Naranja adapta horarios cuando viajan menores.",
  },
];

export const faqChat = [
  { id: "paquetes", label: "Ver paquetes disponibles", respuesta: "Tenemos 4 paquetes activos desde $310.000. Puedes verlos en la sección Paquetes o usar Crea tu Plan." },
  { id: "reservar", label: "¿Cómo reservo?", respuesta: "Las reservas se coordinan por WhatsApp con un asesor. Te enviamos disponibilidad y forma de pago." },
  { id: "horario", label: "Horario de atención", respuesta: "Lunes a sábado, 8:00 a.m. – 6:00 p.m. Domingos solo emergencias por WhatsApp." },
  { id: "whatsapp", label: "Hablar con asesor", respuesta: "Te redirigimos a WhatsApp para atención personalizada." },
];

export const planMock = {
  titulo: "Tu plan de 3 días en Córdoba",
  subtitulo: "Enfoque cultura y gastronomía · Ritmo relajado",
  personas: 2,
  presupuesto: 500000,
  paquete: paquetes[0],
  dias: [
    { dia: 1, actividad: "Centro histórico y museo regional" },
    { dia: 2, actividad: "Tour gastronómico y tarde libre" },
    { dia: 3, actividad: "Mañana cafetera y cierre del viaje" },
  ],
  nota: "Te queda margen en tu presupuesto para cenas o souvenirs. Plan basado en nuestros paquetes publicados.",
};
