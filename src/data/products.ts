import type { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'noir-01',
    slug: 'bekora-technical-shell-jacket',
    name: 'Bekora Technical Shell Jacket',
    subtitle: 'Bonded Japanese Membrane with Ergonomic Storm Flap',
    category: 'outerwear',
    price: 340,
    compareAtPrice: 390,
    colorName: 'Obsidian Black',
    colorways: [
      { name: 'Obsidian Black', hex: '#121212' },
      { name: 'Basalt Grey', hex: '#3a3a3a' },
      { name: 'Bone Off-White', hex: '#eae6df' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 14,
    isNew: true,
    isFeatured: true,
    images: {
      primary: '/products/1.jpg',
      secondary: '/products/2.jpg',
      detail: '/products/1.jpg',
      flatLay: '/products/2.jpg',
    },
    placeholderColor: '#1a1a1a',
    composition: '100% 3-Layer Japanese Micro-Ripstop Nylon (20,000mm Waterproof / Breathable)',
    origin: 'Hand-assembled in Okayama, Japan',
    description: 'An architectural outerwear statement balancing extreme weather protection with sculptural proportions. Features concealed YKK AquaGuard® zippers, dual chest storm pouches, and articulated drop-shoulder geometry.',
    features: [
      '3-Layer bonded weatherproof membrane with taped seams',
      'Concealed magnetic collar closure and stowable storm hood',
      'Articulated sleeves with laser-cut ventilation apertures',
      'Signature Noir Atelier custom matte gunmetal hardware'
    ],
    careInstructions: [
      'Specialist clean or gentle cold wash cycle',
      'Do not tumble dry',
      'Iron low heat with protective cloth'
    ],
    measurements: {
      fit: 'Architectural',
      modelStats: 'Model is 188cm / 6\'2" wearing size M for an intentional structured silhouette.'
    },
    lookbookId: 'campaign-01'
  },
  {
    id: 'noir-02',
    slug: 'sculptural-heavyweight-wool-hoodie',
    name: 'Alabaster Wool Structured Hoodie',
    subtitle: 'Double-Faced Virgin Wool with Funnel Hood',
    category: 'knitwear',
    price: 260,
    colorName: 'Alabaster Cream',
    colorways: [
      { name: 'Alabaster Cream', hex: '#f0ece1' },
      { name: 'Noir Black', hex: '#161616' },
      { name: 'Heather Moss', hex: '#636b59' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 8,
    isNew: true,
    isFeatured: true,
    images: {
      primary: '/products/3.jpg',
      secondary: '/products/4.jpg',
      detail: '/products/3.jpg',
      flatLay: '/products/4.jpg',
    },
    placeholderColor: '#ebe6dc',
    composition: '80% Double-Faced Merino Wool, 20% Fine Mongolian Cashmere (520 GSM)',
    origin: 'Crafted in Biella, Italy',
    description: 'Engineered for seamless tactile luxury. The structured heavyweight knit holds an architectural cowl collar hood without drawstrings, giving a pristine monolithic drape.',
    features: [
      'Heavyweight 520 GSM thermal double-weave knit',
      'Seamless crossover structured funnel hood',
      'Hidden kangaroo hand pocket with bonded fleece lining',
      'Ribbed internal cuffs with invisible thumbholes'
    ],
    careInstructions: [
      'Dry clean only',
      'Store folded with cedar sachet',
      'Do not hang to preserve knit structure'
    ],
    measurements: {
      fit: 'Oversized',
      modelStats: 'Model is 185cm / 6\'1" wearing size L.'
    },
    lookbookId: 'campaign-01'
  },
  {
    id: 'noir-03',
    slug: 'enzo-boucle-wool-utility-jacket',
    name: 'Enzo Bouclé Wool Field Jacket',
    subtitle: 'Textured Boxy Cut with Dual Accordion Cargo Chests',
    category: 'outerwear',
    price: 380,
    colorName: 'Oatmeal Sand',
    colorways: [
      { name: 'Oatmeal Sand', hex: '#d9d0c1' },
      { name: 'Charcoal Slag', hex: '#2b2c2d' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 5,
    isNew: false,
    isFeatured: true,
    isLimited: true,
    images: {
      primary: '/products/5.jpg',
      secondary: '/products/6.jpg',
      detail: '/products/5.jpg',
      flatLay: '/products/6.jpg',
    },
    placeholderColor: '#d6cdbd',
    composition: '100% Unbleached Virgin Wool Bouclé (680 GSM) with Cupro Bemberg Lining',
    origin: 'Tailored in Porto, Portugal',
    description: 'A study in tactile contrast. Features a structured point collar, hidden horn button placket, and dual dimensional bellows pockets that define the minimalist architectural silhouette.',
    features: [
      'Substantial 680 GSM tactile bouclé wool texture',
      'Dual oversized bellowed front chest pockets with concealed snaps',
      'Fully lined in breathable, anti-static Italian Cupro',
      'Square boxy silhouette designed for modular layering'
    ],
    careInstructions: [
      'Professional dry clean only',
      'Steam gently on reverse'
    ],
    measurements: {
      fit: 'Relaxed',
      modelStats: 'Model is 182cm / 6\'0" wearing size M.'
    },
    lookbookId: 'campaign-01'
  },
  {
    id: 'noir-04',
    slug: 'monolith-oversized-down-parka',
    name: 'Monolith Cocoon Down Parka',
    subtitle: '90/10 White Goose Down with Matte Water-Repellent Shell',
    category: 'outerwear',
    price: 520,
    compareAtPrice: 590,
    colorName: 'Matte Onyx',
    colorways: [
      { name: 'Matte Onyx', hex: '#151515' },
      { name: 'Glacier Chalk', hex: '#e8e8e4' },
      { name: 'Deep Spruce', hex: '#26332d' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 6,
    isNew: true,
    isFeatured: true,
    isLimited: true,
    images: {
      primary: '/products/7.jpg',
      secondary: '/products/8.jpg',
      detail: '/products/7.jpg',
      flatLay: '/products/8.jpg',
    },
    placeholderColor: '#1d1d1d',
    composition: 'Shell: 100% Recycled Matte Nylon. Insulation: 90% RDS Goose Down, 10% Feather (800 Fill Power)',
    origin: 'Assembled in Sapporo, Japan',
    description: 'Designed for sub-zero alpine climates with a cocooning, sculptural cut. Full-length dual-direction zipper, thermal fleece-lined storm pockets, and internal carry harness straps for hands-free transport.',
    features: [
      '800 Fill Power ethically sourced Responsible Down Standard insulation',
      'Integrated internal backpack straps for effortless indoor carrying',
      'Oversized baffle construction eliminating cold thermal spots',
      'Drawcord cinches at hem and storm hood with concealed adjusters'
    ],
    careInstructions: [
      'Professional down wash specialist only',
      'Store uncompressed in provided breathable cotton garment bag'
    ],
    measurements: {
      fit: 'Oversized',
      modelStats: 'Model is 189cm / 6\'2" wearing size L.'
    },
    lookbookId: 'campaign-02'
  },
  {
    id: 'noir-05',
    slug: 'atelier-fluid-wide-leg-trouser',
    name: 'Atelier Fluid Wide-Leg Trouser',
    subtitle: 'Double-Pleated Wool Gabardine with Deep Hem Rise',
    category: 'tailoring',
    price: 280,
    colorName: 'Basalt Charcoal',
    colorways: [
      { name: 'Basalt Charcoal', hex: '#2c2d30' },
      { name: 'Chalk Bone', hex: '#dedad2' },
      { name: 'Ink Noir', hex: '#0f0f10' }
    ],
    sizes: ['28', '30', '32', '34', '36'],
    inStock: true,
    stockCount: 19,
    isNew: false,
    isFeatured: true,
    images: {
      primary: '/products/9.jpg',
      secondary: '/products/10.jpg',
      detail: '/products/9.jpg',
      flatLay: '/products/10.jpg',
    },
    placeholderColor: '#2b2b2b',
    composition: '100% High-Twist Wool Gabardine (420 GSM) with Silk Pocketing',
    origin: 'Crafted in Florence, Italy',
    description: 'An iconic silhouette defined by deep forward inverted pleats, an elongated rise, and an uninterrupted architectural drape that breaks fluidly over sneakers or Chelsea boots.',
    features: [
      'High-rise waist with internal grip waistband and side buckle adjusters',
      'Dual inverted front pleats creating volume through the leg',
      'Unfinished 36" inseam for bespoke tailoring customization',
      'Horn buttons and blind hand-stitched hem finish'
    ],
    careInstructions: [
      'Dry clean only',
      'Press with a damp cloth on medium heat'
    ],
    measurements: {
      fit: 'Relaxed',
      modelStats: 'Model is 186cm / 6\'1" wearing size 32.'
    },
    lookbookId: 'campaign-01'
  },
  {
    id: 'noir-06',
    slug: 'zenith-seamless-mockneck-sweater',
    name: 'Zenith Seamless Mockneck Knit',
    subtitle: '100% Ultrafine 16.5 Micron Cashmere Yarn',
    category: 'knitwear',
    price: 310,
    colorName: 'Sandstone Grey',
    colorways: [
      { name: 'Sandstone Grey', hex: '#bcb7ad' },
      { name: 'Raw Black', hex: '#111111' },
      { name: 'Oat Ecru', hex: '#ece6d8' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 11,
    isNew: false,
    isFeatured: false,
    images: {
      primary: '/products/11.jpg',
      secondary: '/products/12.jpg',
      detail: '/products/11.jpg',
      flatLay: '/products/12.jpg',
    },
    placeholderColor: '#b8b2a7',
    composition: '100% Grade-A Mongolian Cashmere (7-Gauge 2-Ply)',
    origin: 'Knitted in Hawick, Scotland',
    description: 'Knitted using 3D WholeGarment® seamless technology to eliminate bulk at shoulders and neckline. Luxuriously soft against bare skin with a modern 4cm structured mock collar.',
    features: [
      'Zero-waste WholeGarment® seamless knitted construction',
      'Ultra-refined 16.5 micron grade-A cashmere',
      'Structured 4cm stand mock collar that maintains rigidity',
      'Tubular hem and cuff bindings'
    ],
    careInstructions: [
      'Hand wash cold using specialist wool detergent',
      'Dry flat on towel away from direct heat'
    ],
    measurements: {
      fit: 'Tailored',
      modelStats: 'Model is 187cm / 6\'1.5" wearing size M.'
    }
  },
  // {
  //   id: 'noir-07',
  //   slug: 'sculptor-oversized-raw-wool-blazer',
  //   name: 'Sculptor Double-Breasted Wool Blazer',
  //   subtitle: 'Unstructured Shoulder with Drop Peak Lapel',
  //   category: 'tailoring',
  //   price: 490,
  //   colorName: 'Obsidian Noir',
  //   colorways: [
  //     { name: 'Obsidian Noir', hex: '#111111' },
  //     { name: 'Warm Taupe', hex: '#948a7b' }
  //   ],
  //   sizes: ['46', '48', '50', '52', '54'],
  //   inStock: true,
  //   stockCount: 7,
  //   isNew: true,
  //   isFeatured: true,
  //   images: {
  //     primary: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85',
  //     secondary: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85',
  //     detail: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=85',
  //     flatLay: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=85'
  //   },
  //   placeholderColor: '#171717',
  //   composition: '100% Heavyweight English Worsted Wool with Bemberg Half-Lining',
  //   origin: 'Tailored in Savile Row Atelier, London',
  //   description: 'An architectural reinterpretation of formal tailoring. Stripped of shoulder pads to yield an organic, effortless drape while maintaining razor-sharp silhouette lines.',
  //   features: [
  //     'Deconstructed soft shoulder with unpadded architecture',
  //     'Wide sweeping 11cm peak lapel with buttonhole flower loop',
  //     'Concealed jetted hip pockets and dual interior chest welt pockets',
  //     'Genuine unlacquered horn buttons with cross-stitched anchors'
  //   ],
  //   careInstructions: [
  //     'Specialist dry clean only',
  //     'Hang on wide contoured wooden hanger'
  //   ],
  //   measurements: {
  //     fit: 'Architectural',
  //     modelStats: 'Model is 188cm / 6\'2" wearing size 50 (UK 40).'
  //   },
  //   lookbookId: 'campaign-02'
  // },
  // {
  //   id: 'noir-08',
  //   slug: 'modular-geometric-leather-crossbody',
  //   name: 'Modular Geometric Box Bag',
  //   subtitle: 'Vegetable-Tanned Tuscan Calfskin with Matte Clasp',
  //   category: 'objects',
  //   price: 290,
  //   colorName: 'Pure Carbon',
  //   colorways: [
  //     { name: 'Pure Carbon', hex: '#181818' },
  //     { name: 'Natural Vachetta', hex: '#cbb393' }
  //   ],
  //   sizes: ['One Size'],
  //   inStock: true,
  //   stockCount: 16,
  //   isNew: false,
  //   isFeatured: true,
  //   images: {
  //     primary: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
  //     secondary: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85',
  //     detail: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
  //     flatLay: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85'
  //   },
  //   placeholderColor: '#1e1e1e',
  //   composition: 'Full-Grain Tuscan Calfskin with Suede Lambskin Lining',
  //   origin: 'Crafted in Scandicci, Florence',
  //   description: 'Constructed from a single continuous fold of 2.2mm vegetable-tanned leather. Features magnetic Fidlock® closure, detachable bridle strap, and edge-painted raw corners.',
  //   features: [
  //     'Precision bevelled and hand-painted raw edge finishes',
  //     'Modular magnetic German Fidlock® quick-release buckle',
  //     'Internal dual passport and card slip pockets with debossed branding',
  //     'Fits iPhone Pro Max, passport, keys, and everyday EDC essentials'
  //   ],
  //   careInstructions: [
  //     'Wipe with soft damp microfibre cloth',
  //     'Condition bi-annually with natural beeswax balm'
  //   ],
  //   measurements: {
  //     fit: 'Relaxed',
  //     modelStats: 'Dimensions: 21cm (W) x 14cm (H) x 6.5cm (D).'
  //   }
  // },
  // {
  //   id: 'noir-09',
  //   slug: 'solis-heavy-cotton-lounge-pant',
  //   name: 'Solis Structured Cotton Pant',
  //   subtitle: '480 GSM French Terry with Clean Tapered Cuff',
  //   category: 'bottoms',
  //   price: 195,
  //   colorName: 'Dune Bone',
  //   colorways: [
  //     { name: 'Dune Bone', hex: '#e3ded5' },
  //     { name: 'Washed Charcoal', hex: '#373738' },
  //     { name: 'Deep Noir', hex: '#111111' }
  //   ],
  //   sizes: ['XS', 'S', 'M', 'L', 'XL'],
  //   inStock: true,
  //   stockCount: 22,
  //   isNew: false,
  //   isFeatured: false,
  //   images: {
  //     primary: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85',
  //     secondary: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85',
  //     detail: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85',
  //     flatLay: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85'
  //   },
  //   placeholderColor: '#dbd6cb',
  //   composition: '100% GOTS Certified Organic Heavyweight Cotton French Terry (480 GSM)',
  //   origin: 'Crafted in Guimarães, Portugal',
  //   description: 'Elevating lounge essentials to sculptural status. A dense, loopback organic cotton structure that resists bagging at the knees and features clean concealed ankle zip hems.',
  //   features: [
  //     'Ultra-dense 480 GSM loopback organic cotton',
  //     'Concealed inner seam ankle zips for versatile pant taper',
  //     'Thick elasticated waistband with internal woven cotton drawcord',
  //     'Deep pocket bags lined in smooth cotton poplin'
  //   ],
  //   careInstructions: [
  //     'Machine wash cold gentle with similar neutral colors',
  //     'Hang dry in shade'
  //   ],
  //   measurements: {
  //     fit: 'Relaxed',
  //     modelStats: 'Model is 185cm / 6\'1" wearing size M.'
  //   }
  // },
  // {
  //   id: 'noir-10',
  //   slug: 'tor-chunky-lug-leather-boot',
  //   name: 'Tor Sculpted Vibram Lug Boot',
  //   subtitle: 'Waxed Suede Upper with Custom Vibram® Morflex Sole',
  //   category: 'footwear',
  //   price: 430,
  //   colorName: 'Shadow Basalt',
  //   colorways: [
  //     { name: 'Shadow Basalt', hex: '#222222' },
  //     { name: 'Sand Taupe', hex: '#a69986' }
  //   ],
  //   sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
  //   inStock: true,
  //   stockCount: 4,
  //   isNew: true,
  //   isFeatured: true,
  //   isLimited: true,
  //   images: {
  //     primary: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85',
  //     secondary: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=85',
  //     detail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85',
  //     flatLay: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85'
  //   },
  //   placeholderColor: '#1c1c1c',
  //   composition: 'Upper: 100% Waxed Reverse Calf Suede. Sole: Vibram® Custom Megagrip Lug Outsole',
  //   origin: 'Handmade in Civitanova Marche, Italy',
  //   description: 'Substantial yet featherlight on foot thanks to custom Italian foam compounding. Goodyear-welted construction with water-repellent oiled suede finish.',
  //   features: [
  //     'Genuine Goodyear-welted artisanal construction for lifetime resoleability',
  //     'Vibram® custom Morflex lugged sole providing cloud-like traction',
  //     'Calfskin full leather lining with memory orthotic footbed',
  //     'Rear leather pull tab and tonal waxed speed eyelets'
  //   ],
  //   careInstructions: [
  //     'Brush with natural brass suede brush',
  //     'Treat with water-repellent suede protector spray'
  //   ],
  //   measurements: {
  //     fit: 'Tailored',
  //     modelStats: 'Fits true to European size. Take your regular boot size.'
  //   }
  // },
  // {
  //   id: 'noir-11',
  //   slug: 'archetype-raw-silk-camp-shirt',
  //   name: 'Archetype Raw Silk Short-Sleeve',
  //   subtitle: 'Heavyweight Noil Silk with Relaxed Camp Collar',
  //   category: 'tailoring',
  //   price: 240,
  //   colorName: 'Chalk Bone',
  //   colorways: [
  //     { name: 'Chalk Bone', hex: '#ede9df' },
  //     { name: 'Basalt Charcoal', hex: '#2b2c2e' }
  //   ],
  //   sizes: ['S', 'M', 'L', 'XL'],
  //   inStock: true,
  //   stockCount: 15,
  //   isNew: false,
  //   isFeatured: false,
  //   images: {
  //     primary: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1200&q=85',
  //     secondary: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=85',
  //     detail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85',
  //     flatLay: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85'
  //   },
  //   placeholderColor: '#e5e0d4',
  //   composition: '100% Organic Raw Noil Silk (260 GSM)',
  //   origin: 'Crafted in Kyoto, Japan',
  //   description: 'Raw noil silk exhibits an organic, slubbed matte texture akin to fine linen with the thermal regulation and supple drape exclusive to pure silk.',
  //   features: [
  //     'Matte slubbed raw silk with natural moisture-wicking properties',
  //     'One-piece convertible camp collar with top button loop',
  //     'Mother-of-pearl smoky buttons carved from sustainable oyster shells',
  //     'Straight boxy hem with side vent splits for easy tucking or layering'
  //   ],
  //   careInstructions: [
  //     'Hand wash cold or gentle dry clean',
  //     'Dry flat in shade, iron with light steam'
  //   ],
  //   measurements: {
  //     fit: 'Relaxed',
  //     modelStats: 'Model is 184cm / 6\'0" wearing size M.'
  //   }
  // },
  // {
  //   id: 'noir-12',
  //   slug: 'forma-sculptural-silver-cuff',
  //   name: 'Forma 925 Solid Sterling Cuff',
  //   subtitle: 'Brushed Brutalist Architectural Wrist Sculpture',
  //   category: 'objects',
  //   price: 360,
  //   colorName: 'Brushed Silver 925',
  //   colorways: [
  //     { name: 'Brushed Silver 925', hex: '#cfcfcf' },
  //     { name: 'Oxidized Gunmetal', hex: '#404040' }
  //   ],
  //   sizes: ['Small (16cm)', 'Medium (18cm)', 'Large (20cm)'],
  //   inStock: true,
  //   stockCount: 9,
  //   isNew: true,
  //   isFeatured: true,
  //   images: {
  //     primary: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
  //     secondary: 'https://images.unsplash.com/photo-1611591475155-42864299446f?auto=format&fit=crop&w=1200&q=85',
  //     detail: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
  //     flatLay: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85'
  //   },
  //   placeholderColor: '#d6d6d6',
  //   composition: '100% Solid 925 Sterling Silver (Weight: 68g)',
  //   origin: 'Hand-forged in Pforzheim, Germany',
  //   description: 'Forged from a solid ingot of 925 sterling silver, hand-beveled with a brushed satin exterior and mirror-polished interior bearing hallmark laser engravings.',
  //   features: [
  //     'Substantial 68-gram weight with ergonomic anatomical oval contour',
  //     'Hand-applied matte directional satin brush finish',
  //     'Laser engraved with individual serial number and purity hallmarks',
  //     'Presented in a solid anodized aluminium archival presentation box'
  //   ],
  //   careInstructions: [
  //     'Store in provided anti-tarnish velvet pouch',
  //     'Polish periodically with included silver cloth'
  //   ],
  //   measurements: {
  //     fit: 'Architectural',
  //     modelStats: 'Medium accommodates wrists measuring 16.5cm - 18.5cm circumference.'
  //   }
  // }
];
