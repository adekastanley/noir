import type { Collection } from '../types';

export const COLLECTIONS: Collection[] = [
  {
    id: 'col-01',
    slug: 'edition-04-silent-form',
    title: 'Silent Form',
    season: 'Autumn / Winter',
    year: '2026',
    tagline: 'An architectural enquiry into quiet volume and pure tactility.',
    description: 'Conceived in our Paris studio and realized through historic mills across Okayama, Biella, and Hawick. Pieces designed to shelter the wearer from auditory and visual noise through monolithic structure.',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
    heroQuote: 'When form is reduced to its quietest essence, material speaks with absolute clarity.',
    productIds: ['noir-01', 'noir-02', 'noir-03', 'noir-04', 'noir-05', 'noir-08']
  },
  {
    id: 'col-02',
    slug: 'material-study-wool-cashmere',
    title: 'Material Study: Wool & Cashmere',
    season: 'Permanent Archive',
    year: '2026',
    tagline: 'Uncompromising double-faced textiles and seamless 3D knit architecture.',
    description: 'Sourced from regenerative pastoral farms in Inner Mongolia and spun in the Biella valleys of Northern Italy. Zero chemical coatings, unbleached yarns, and lifetime durability.',
    coverImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1600&q=85',
    productIds: ['noir-02', 'noir-03', 'noir-06', 'noir-07']
  }
];
