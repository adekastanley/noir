import type { LookbookCampaign } from '../types';

export const LOOKBOOK_CAMPAIGNS: LookbookCampaign[] = [
  {
    id: 'campaign-01',
    title: 'LAND OF SILENCE',
    subtitle: 'EDITION 04 / CONTEMPORARY FORM & MIST',
    season: 'Autumn / Winter',
    location: 'Westfjords, Iceland — 65°45\'N 23°10\'W',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90',
    tagline: 'Sculptural silhouettes against vast elemental stillness.',
    hotspots: [
      {
        id: 'hs-01',
        xPercent: 44,
        yPercent: 38,
        productId: 'noir-02',
        label: 'Alabaster Wool Structured Hoodie',
        detail: 'Double-faced Italian merino wool'
      },
      {
        id: 'hs-02',
        xPercent: 59,
        yPercent: 35,
        productId: 'noir-01',
        label: 'Bekora Technical Shell Jacket',
        detail: 'Bonded 3-layer Japanese membrane'
      }
    ]
  },
  {
    id: 'campaign-02',
    title: 'VOLCANIC DRIFT',
    subtitle: 'FIELD STUDY & ATMOSPHERIC OUTERWEAR',
    season: 'Fall / Winter 2026',
    location: 'Landmannalaugar Geothermal Highlands',
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=2400&q=90',
    tagline: 'Thermal shielding against geothermal vapor and highland frost.',
    hotspots: [
      {
        id: 'hs-03',
        xPercent: 32,
        yPercent: 48,
        productId: 'noir-04',
        label: 'Monolith Cocoon Down Parka',
        detail: '800 Fill Power Goose Down'
      },
      {
        id: 'hs-04',
        xPercent: 68,
        yPercent: 42,
        productId: 'noir-07',
        label: 'Sculptor Double-Breasted Wool Blazer',
        detail: 'Savile Row deconstructed worsted wool'
      }
    ]
  }
];
