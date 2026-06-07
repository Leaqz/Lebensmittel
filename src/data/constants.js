export const STORE_STYLES = {
  aldi: {
    catalogId: 'aldi',
    name: 'Aldi Süd',
    tagline: 'Einfach gut – einfach günstig',
    emoji: '🔵',
    logoCls: 'aldi-logo',
    textCl: 'text-blue-700',
    borderCl: 'border-blue-200',
    bgCl: 'bg-blue-50',
    badgeCl: 'bg-blue-100 text-blue-700',
    accentHex: '#003087',
  },
  lidl: {
    catalogId: 'lidl',
    name: 'Lidl',
    tagline: 'Qualität ist unser Preis',
    emoji: '🔴',
    logoCls: 'lidl-logo',
    textCl: 'text-red-700',
    borderCl: 'border-red-200',
    bgCl: 'bg-red-50',
    badgeCl: 'bg-red-100 text-red-700',
    accentHex: '#c00000',
  },
  rewe: {
    catalogId: 'rewe',
    name: 'REWE',
    tagline: 'Jeden Tag ein bisschen besser',
    emoji: '🟥',
    logoCls: 'rewe-logo',
    textCl: 'text-rose-700',
    borderCl: 'border-rose-200',
    bgCl: 'bg-rose-50',
    badgeCl: 'bg-rose-100 text-rose-700',
    accentHex: '#cc0000',
  },
  edeka: {
    catalogId: 'edeka',
    name: 'EDEKA',
    tagline: 'Wir lieben Lebensmittel',
    emoji: '🟡',
    logoCls: 'edeka-logo',
    textCl: 'text-red-600',
    borderCl: 'border-yellow-200',
    bgCl: 'bg-yellow-50',
    badgeCl: 'bg-yellow-100 text-yellow-800',
    accentHex: '#e3051a',
  },
};

// Statische Fallback-Filialen wenn Geolocation verweigert wird
export const STATIC_STORES = [
  { ...STORE_STYLES.aldi,  id: 'aldi',  distance: 0.7 },
  { ...STORE_STYLES.lidl,  id: 'lidl',  distance: 1.3 },
  { ...STORE_STYLES.rewe,  id: 'rewe',  distance: 2.5 },
  { ...STORE_STYLES.edeka, id: 'edeka', distance: 4.1 },
];

// Marken-Mapping: Echter Name → bekannter Katalog-Stil
export const BRAND_MAPPINGS = [
  { match: /aldi\s*(s(ü|ue)d|nord)?/i,     catalogId: 'aldi',  displaySuffix: '' },
  { match: /lidl/i,                          catalogId: 'lidl',  displaySuffix: '' },
  { match: /rewe/i,                          catalogId: 'rewe',  displaySuffix: '' },
  { match: /edeka/i,                         catalogId: 'edeka', displaySuffix: '' },
  { match: /penny/i,                         catalogId: 'aldi',  displaySuffix: ' (Discount)' },
  { match: /netto\s*(marken|-)/i,            catalogId: 'aldi',  displaySuffix: ' (Discount)' },
  { match: /netto/i,                         catalogId: 'aldi',  displaySuffix: ' (Discount)' },
  { match: /norma/i,                         catalogId: 'aldi',  displaySuffix: ' (Discount)' },
  { match: /kaufland/i,                      catalogId: 'rewe',  displaySuffix: '' },
  { match: /globus/i,                        catalogId: 'rewe',  displaySuffix: '' },
  { match: /hit\s*markt/i,                   catalogId: 'edeka', displaySuffix: '' },
  { match: /tegut/i,                         catalogId: 'edeka', displaySuffix: '' },
  { match: /spar/i,                          catalogId: 'rewe',  displaySuffix: '' },
  { match: /nahkauf/i,                       catalogId: 'rewe',  displaySuffix: '' },
];

export const AI_PRESETS = {
  balanced:       ['milch', 'eier', 'toastbrot', 'haehnchen', 'spinat', 'aepfel', 'joghurt', 'spaghetti', 'zwiebeln', 'olivenoel', 'karotten', 'bananen'],
  vegan:          ['haferflocken', 'bananen', 'aepfel', 'tomaten_dose', 'zwiebeln', 'kidneybohnen', 'reis', 'spaghetti', 'olivenoel', 'spinat', 'kartoffeln', 'karotten', 'gehaeckte_tomaten'],
  'high-protein': ['haehnchen', 'eier', 'joghurt', 'quark', 'gouda', 'kidneybohnen', 'spinat', 'reis', 'haferflocken', 'lachsfilet', 'griechjoghurt'],
  'low-budget':   ['spaghetti', 'tomaten_dose', 'zwiebeln', 'kidneybohnen', 'reis', 'toastbrot', 'bananen', 'haferflocken', 'kartoffeln', 'eier', 'mehl', 'erbsen'],
  family:         ['milch', 'toastbrot', 'eier', 'haehnchen', 'spaghetti', 'tomaten_frisch', 'gouda', 'aepfel', 'bananen', 'zwiebeln', 'reis', 'butter', 'joghurt', 'kartoffeln', 'karotten', 'paprika'],
};

export const TRANSPORT = { car: 2, transit: 4, bike: 5, walk: 13 };
