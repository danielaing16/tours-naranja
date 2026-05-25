/** Site content — English */
export default {
  name: 'Tours Naranja',
  location: 'Montería, Córdoba, Colombia',
  email: 'toursnaranjasas@gmail.com',
  showDevBanner: false,

  social: {
    instagram: 'https://www.instagram.com/toursnaranja/',
    facebook: '',
    youtube: '',
    tiktok: '',
  },

  hero: {
    overline: 'LOCAL AGENCY · CÓRDOBA, COLOMBIA',
    titleLine1: 'Experience Córdoba with',
    titleHighlight: 'real adventures',
    subtitle:
      'Cultural routes, nature and authentic cuisine from Montería. A cultural journey that connects us with the region.',
    image: '/hero-home.png',
    imageAlt: 'Lodging and nature in Córdoba — Tours Naranja',
    cta: 'View Packages',
  },

  presentation: {
    title: 'Tours Naranja',
    line1: 'We are a local operator in Montería: we design tour packages and tailor-made experiences across Córdoba.',
    line2: 'Culture, nature and real food — with direct advice and carefully managed groups.',
  },

  gallery: {
    title: 'Experiences in images',
    subtitle:
      'Real moments from our tours across Córdoba. Culture, nature and cuisine with local operators.',
    videoUrl: '/galeria/experiencias.mp4',
    videoPoster: '/galeria/poster.jpg',
    items: [
      {
        type: 'image',
        src: '/galeria/1-naturaleza-rio.jpg',
        alt: 'Nature and river in Córdoba',
        caption: 'Nature and river',
      },
      {
        type: 'image',
        src: '/galeria/2-aventura-cordoba.jpg',
        alt: 'Adventure in Córdoba',
        caption: 'Adventure in Córdoba',
      },
      {
        type: 'image',
        src: '/galeria/3-rutas-patrimonio.jpg',
        alt: 'Heritage routes',
        caption: 'Heritage routes',
      },
      {
        type: 'image',
        src: '/galeria/4-sabores-cordobesos.jpg',
        alt: 'Cordoban cuisine',
        caption: 'Cordoban flavors',
      },
    ],
    highlights: [
      { label: 'Heritage', icon: 'heritage' },
      { label: 'Gastronomy', icon: 'food' },
      { label: 'Nature', icon: 'nature' },
      { label: 'Groups', icon: 'groups' },
      { label: 'Adventure', icon: 'adventure' },
    ],
  },

  whyUs: {
    title: 'Why choose us?',
    items: [
      {
        icon: '◆',
        title: 'Personalized attention',
        text: 'You speak with a real advisor on WhatsApp. We adjust dates, group size and pace with you.',
        link: { pathname: '/', hash: 'contacto' },
        linkLabel: 'Talk to us',
      },
      {
        icon: '◆',
        title: 'Safety',
        text: 'Trusted providers, proven routes and clear coordination before departure.',
        link: '/paquetes',
        linkLabel: 'View packages',
      },
      {
        icon: '◆',
        title: 'Experience',
        text: 'Years touring Córdoba with local travelers and visitors from other cities.',
        link: '/sobre-nosotros',
        linkLabel: 'About us',
      },
      {
        icon: '◆',
        title: 'Local guides',
        text: 'Those who accompany you know the history, land and cuisine of the area.',
        link: '/paquetes',
        linkLabel: 'Explore routes',
      },
    ],
  },

  howItWorks: {
    title: 'How it works',
    subtitle:
      'Booking your experience in Córdoba is simple. We guide you every step, from choosing a plan to confirming on WhatsApp.',
    steps: [
      {
        num: '01',
        title: 'Choose',
        text: 'Browse featured packages or tell us what you want: days, budget and interests.',
        link: '/paquetes',
        linkLabel: 'View packages',
        image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80',
        alt: 'Travelers exploring a cultural destination',
      },
      {
        num: '02',
        title: 'Customize',
        text: 'We fine-tune the plan with you and confirm availability. Book and pay via WhatsApp.',
        link: '/crea-tu-plan',
        linkLabel: 'Customize trip',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
        alt: 'Gastronomic and personalized experience',
      },
    ],
  },

  ourExperience: {
    title: 'Our experience',
    subtitle: 'What we have built in the region',
    stats: [
      { value: '50+', label: 'Trips organized' },
      { value: '12+', label: 'Events and group outings' },
      { value: '8+', label: 'Projects with local partners' },
    ],
    cta: 'Learn our story',
    ctaLink: '/sobre-nosotros',
  },

  paquetesPage: {
    eyebrow: 'Catalog',
    title: 'Tour packages',
    subtitle:
      'Routes through Montería and the Cordoban Caribbean. Ready to book or as a base for your custom trip.',
    ctaTitle: "Can't find what you're looking for?",
    ctaText: 'Tell us dates, group and interests and we will build a proposal with you.',
    ctaWhatsapp: 'WhatsApp',
    ctaPersonaliza: 'Customize trip',
  },

  contactSection: {
    title: "Let's talk about your trip",
    subtitle: 'Write to us or coordinate your experience via WhatsApp with a local advisor in Montería.',
    backgroundImage: '/contacto-fondo.png',
    hours: 'Mon – Sat, 8:00 a.m. – 9:00 p.m.',
  },

  about: {
    eyebrow: 'About us',
    title: 'About Tours Naranja',
    subtitle: 'Local operator in Montería. Authentic tourism across Córdoba and the Cordoban Caribbean.',
    yearsValue: '+5',
    yearsLabel: 'years of experience',
    intro:
      'Tours Naranja was born with a simple idea: show Córdoba authentically, without empty promises. We work with local guides, trusted restaurants and routes we know because we travel them every week.',
    ctaHeader: 'Contact',
    ctaTitle: 'Ready to discover Córdoba?',
    ctaText: 'Explore our packages or write to us to build a tailor-made experience.',
    ctaPaquetes: 'View packages',
    ctaContacto: 'Contact',
    sections: [
      {
        heading: 'Our story',
        body: 'For over 5 years we have accompanied travelers through the historic center, Cordoban cuisine and nature experiences. We started with small groups and today we coordinate ready-made packages and custom plans.',
      },
      {
        heading: 'Events and projects',
        body: 'We have supported corporate outings, cultural tours and partnerships with local entrepreneurs. Each project adds to the offer you see in the catalog.',
      },
      {
        heading: 'Commitment',
        body: 'Responsible tourism, clear prices and direct communication. If a destination is unavailable, we tell you — we do not sell what we cannot deliver.',
      },
    ],
    values: ['Local operator', 'Transparency', 'Cared-for groups', 'Córdoba first'],
  },
};
