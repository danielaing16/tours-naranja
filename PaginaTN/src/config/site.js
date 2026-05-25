/**
 * Contenido del sitio — editar aquí al cambiar textos, fotos o mapa.
 */
export const site = {
  name: 'Tours Naranja',
  location: 'Montería, Córdoba, Colombia',
  email: 'toursnaranjasas@gmail.com',
  showDevBanner: false,

  /** URLs de redes — deja vacío para ocultar ese icono */
  social: {
    instagram: 'https://www.instagram.com/toursnaranja/',
    facebook: '',
    youtube: '',
    tiktok: '',
  },

  hero: {
    overline: 'AGENCIA LOCAL · CÓRDOBA, COLOMBIA',
    titleLine1: 'Vive Córdoba con',
    titleHighlight: 'experiencias reales',
    subtitle:
      'Rutas culturales, naturaleza y gastronomía auténtica desde Montería. Un viaje cultural que nos conecta con la región.',
    image: '/hero-home.png',
    imageAlt: 'Alojamientos y naturaleza en Córdoba — Tours Naranja',
    cta: 'Ver Paquetes',
  },

  presentation: {
    title: 'Tours Naranja',
    line1: 'Somos un operador local en Montería: diseñamos paquetes turísticos y experiencias a medida por Córdoba.',
    line2: 'Cultura, naturaleza y gastronomía real — con asesoría directa y grupos cuidados.',
  },

  gallery: {
    title: 'Experiencias en imágenes',
    subtitle:
      'Momentos reales de nuestros recorridos por Córdoba. Cultura, naturaleza y gastronomía con operadores locales.',
    /** Video local: PaginaTN/public/galeria/experiencias.mp4 */
    videoUrl: '/galeria/experiencias.mp4',
    videoPoster: '/galeria/poster.jpg', // si no existe, usa la 1ª foto de items
    items: [
      {
        type: 'image',
        src: '/galeria/1-naturaleza-rio.jpg',
        alt: 'Naturaleza y río en Córdoba',
        caption: 'Naturaleza y río',
      },
      {
        type: 'image',
        src: '/galeria/2-aventura-cordoba.jpg',
        alt: 'Aventura en Córdoba',
        caption: 'Aventura en Córdoba',
      },
      {
        type: 'image',
        src: '/galeria/3-rutas-patrimonio.jpg',
        alt: 'Rutas de patrimonio',
        caption: 'Rutas patrimonio',
      },
      {
        type: 'image',
        src: '/galeria/4-sabores-cordobesos.jpg',
        alt: 'Gastronomía cordobesa',
        caption: 'Sabores cordobeses',
      },
    ],
    highlights: [
      { label: 'Patrimonio', icon: 'heritage' },
      { label: 'Gastronomía', icon: 'food' },
      { label: 'Naturaleza', icon: 'nature' },
      { label: 'Grupos', icon: 'groups' },
      { label: 'Aventura', icon: 'adventure' },
    ],
  },

  whyUs: {
    title: '¿Por qué elegirnos?',
    items: [
      {
        icon: '◆',
        title: 'Atención personalizada',
        text: 'Hablas con un asesor real por WhatsApp. Ajustamos fechas, grupo y ritmo contigo.',
        link: '/#contacto',
        linkLabel: 'Hablar con nosotros',
      },
      {
        icon: '◆',
        title: 'Seguridad',
        text: 'Proveedores conocidos, rutas probadas y coordinación clara antes de salir.',
        link: '/paquetes',
        linkLabel: 'Ver paquetes',
      },
      {
        icon: '◆',
        title: 'Experiencia',
        text: 'Años recorriendo Córdoba con viajeros locales y visitantes de otras ciudades.',
        link: '/sobre-nosotros',
        linkLabel: 'Conócenos',
      },
      {
        icon: '◆',
        title: 'Guías locales',
        text: 'Quienes te acompañan conocen la historia, el territorio y la gastronomía de la zona.',
        link: '/paquetes',
        linkLabel: 'Explorar rutas',
      },
    ],
  },

  howItWorks: {
    title: 'Cómo funciona',
    subtitle:
      'Reservar tu experiencia en Córdoba es sencillo. Te acompañamos en cada paso, desde elegir el plan hasta confirmar por WhatsApp.',
    steps: [
      {
        num: '01',
        title: 'Elige',
        text: 'Explora paquetes destacados o cuéntanos qué buscas: días, presupuesto e intereses.',
        link: '/paquetes',
        linkLabel: 'Ver paquetes',
        image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80',
        alt: 'Viajeros explorando un destino cultural',
      },
      {
        num: '02',
        title: 'Personaliza',
        text: 'Afinamos el plan contigo y confirmamos disponibilidad. Reserva y pago por WhatsApp.',
        link: '/crea-tu-plan',
        linkLabel: 'Personalizar viaje',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
        alt: 'Experiencia gastronómica y personalizada',
      },
    ],
  },

  ourExperience: {
    title: 'Nuestra experiencia',
    subtitle: 'Lo que hemos construido en la región',
    stats: [
      { value: '50+', label: 'Viajes organizados' },
      { value: '12+', label: 'Eventos y salidas grupales' },
      { value: '8+', label: 'Proyectos con aliados locales' },
    ],
    cta: 'Conoce nuestra historia',
    ctaLink: '/sobre-nosotros',
  },

  paquetesPage: {
    eyebrow: 'Catálogo',
    title: 'Paquetes turísticos',
    subtitle:
      'Rutas por Montería y el Caribe cordobés. Listas para reservar o como base para armar tu viaje a medida.',
    ctaTitle: '¿No encuentras lo que buscas?',
    ctaText: 'Cuéntanos fechas, grupo e intereses y armamos una propuesta contigo.',
    ctaWhatsapp: 'WhatsApp',
    ctaPersonaliza: 'Personalizar viaje',
  },

  contactSection: {
    title: 'Hablemos de tu viaje',
    subtitle: 'Escríbenos o coordina tu experiencia por WhatsApp con un asesor local en Montería.',
    backgroundImage: '/contacto-fondo.png',
    hours: 'Lun – Sáb, 8:00 a.m. – 9:00 p.m.',
  },

  about: {
    eyebrow: 'Nosotros',
    title: 'Sobre Tours Naranja',
    subtitle: 'Operador local en Montería. Turismo auténtico por Córdoba y el Caribe cordobés.',
    yearsValue: '+5',
    yearsLabel: 'años de experiencia',
    intro:
      'Tours Naranja nació con una idea simple: mostrar Córdoba con autenticidad, sin promesas vacías. Trabajamos con guías locales, restaurantes de confianza y rutas que conocemos porque las recorremos cada semana.',
    ctaHeader: 'Contactar',
    ctaTitle: '¿Listo para conocer Córdoba?',
    ctaText: 'Explora nuestros paquetes o escríbenos para armar una experiencia a tu medida.',
    ctaPaquetes: 'Ver paquetes',
    ctaContacto: 'Contactar',
    sections: [
      {
        heading: 'Nuestra historia',
        body: 'Con más de 5 años acompañamos viajeros por el centro histórico, la gastronomía cordobesa y experiencias de naturaleza. Empezamos con grupos pequeños y hoy coordinamos paquetes listos y planes personalizados.',
      },
      {
        heading: 'Eventos y proyectos',
        body: 'Hemos apoyado salidas corporativas, recorridos culturales y alianzas con emprendedores locales. Cada proyecto suma a la oferta que ves en el catálogo.',
      },
      {
        heading: 'Compromiso',
        body: 'Turismo responsable, precios claros y comunicación directa. Si un destino no está disponible, te lo decimos — no vendemos lo que no podemos cumplir.',
      },
    ],
    values: ['Operador local', 'Transparencia', 'Grupos cuidados', 'Córdoba primero'],
  },
};
