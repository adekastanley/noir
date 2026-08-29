export interface MaterialStudy {
  id: string;
  name: string;
  weight: string;
  origin: string;
  description: string;
  tag: string;
  image: string;
}

export const MATERIAL_STUDIES: MaterialStudy[] = [
  {
    id: 'mat-01',
    name: '3-Layer Bonded Japanese Ripstop',
    weight: '280 GSM',
    origin: 'Okayama, Japan',
    description: 'A breathable microporous membrane laminated between high-tenacity nylon ripstop. Impervious to wind and 20,000mm water columns while maintaining a silent matte hand.',
    tag: 'Technical Membrane',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mat-02',
    name: 'Double-Faced Biella Virgin Wool',
    weight: '520 GSM',
    origin: 'Piedmont, Italy',
    description: 'Two separate woven layers of fine 19.5-micron merino wool joined by internal connective threads, delivering structural rigidity without requiring synthetic bonding adhesives.',
    tag: 'Architectural Natural',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mat-03',
    name: 'Raw Mongolian Cashmere (Grade-A)',
    weight: '16.5 Micron / 7-Gauge',
    origin: 'Inner Mongolia / Hawick, Scotland',
    description: 'Harvested exclusively through gentle spring combing. Spun into 2-ply high-twist yarns that provide exceptional thermal weight-to-warmth ratios with zero chemical sizing.',
    tag: 'Pure Luxury',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80'
  }
];

export interface AtelierPrinciple {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

export const ATELIER_PRINCIPLES: AtelierPrinciple[] = [
  {
    number: '01',
    title: 'FORM FOLLOWING RESTRAINT',
    subtitle: 'Eliminating the Unnecessary',
    description: 'We strip away superficial branding, exposed drawstrings, and extraneous details. Proportions, seams, and silhouettes create presence through quiet confidence.'
  },
  {
    number: '02',
    title: 'UNCOMPROMISING MATERIALITY',
    subtitle: 'The Tactile Priority',
    description: 'Every garment begins at the raw yarn. We collaborate directly with artisanal heritage mills across Japan, Italy, and Scotland to engineer fabrics designed to age with dignity.'
  },
  {
    number: '03',
    title: 'GENERATIONAL LONGEVITY',
    subtitle: 'Permanent Archival Pieces',
    description: 'We release modular, timeless collections rather than chasing fast-paced seasonal cycles. Fully repairable construction, generous seam allowances, and lifetime atelier service.'
  }
];

export interface FAQItem {
  question: string;
  answer: string;
  category: 'shipping' | 'sizing' | 'materials' | 'atelier';
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How do Noir Atelier garments fit?',
    answer: 'Our silhouettes are designed with architectural, deliberate ease. Most pieces feature relaxed or oversized cuts that drape naturally. If you prefer a more tailored traditional fit, we recommend selecting one size down from your usual standard size. Detailed dimensional measurements are available on each product page.',
    category: 'sizing'
  },
  {
    question: 'What are your worldwide shipping and delivery terms?',
    answer: 'We provide complimentary carbon-neutral DHL Express shipping worldwide on all orders over €250 ($270 USD / £210 GBP). Delivery takes 2–4 business days across Europe and North America, and 3–5 business days for Asia and Oceania. All shipments include insured tracking and signature upon delivery.',
    category: 'shipping'
  },
  {
    question: 'Where are Noir Atelier pieces manufactured?',
    answer: 'We manufacture exclusively with small heritage artisan workshops specializing in specific crafts: technical outerwear in Okayama (Japan), structured wools and tailoring in Biella and Florence (Italy), knitwear in Hawick (Scotland), and leather goods in Scandicci (Tuscany).',
    category: 'atelier'
  },
  {
    question: 'What is your return and exchange policy?',
    answer: 'We offer complimentary 30-day returns and exchanges for all unworn items in their original packaging with tags intact. A pre-printed return label is included inside your archival presentation box.',
    category: 'shipping'
  }
];
