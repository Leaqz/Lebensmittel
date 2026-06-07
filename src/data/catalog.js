// Reale deutsche Supermarktpreise (Stand 2025)
// Preise in EUR. salePrices = aktuelle Angebotspreise, null = kein Angebot.

export const CATALOG = [
  /* ── MILCHPRODUKTE ── */
  {
    id: 'milch', name: 'Vollmilch 3,5%', detail: '1-L-Packung', category: '🥛 Milchprodukte',
    prices:     { aldi: 1.05, lidl: 1.09, rewe: 1.19, edeka: 1.35 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_m1', name: 'H-Milch 1,5% 1 L',   detail: 'Länger haltbar',    prices: { aldi: 0.89, lidl: 0.92, rewe: 0.99,  edeka: 1.15 } },
      { id: 'alt_m2', name: 'Hafermilch 1 L',       detail: 'Pflanzlich',        prices: { aldi: 1.49, lidl: 1.55, rewe: 1.79,  edeka: 1.99 } },
      { id: 'alt_m3', name: 'Eigenmarke Milch 1 L', detail: 'Günstigste Option', prices: { aldi: 0.79, lidl: 0.82, rewe: 0.89,  edeka: 0.99 } },
    ],
  },
  {
    id: 'hmilch', name: 'H-Milch 1,5%', detail: '6×1-L-Packung', category: '🥛 Milchprodukte',
    prices:     { aldi: 4.89, lidl: 4.99, rewe: 5.49, edeka: 6.29 },
    salePrices: { aldi: null, lidl: 3.99, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: 'Großpackung −1,00 €', rewe: null, edeka: null },
    alternatives: [
      { id: 'alt_hm1', name: 'H-Milch 3,5% 1 L', detail: 'Vollfett', prices: { aldi: 0.95, lidl: 0.99, rewe: 1.09, edeka: 1.25 } },
      { id: 'alt_hm2', name: 'Laktosefreie Milch 1 L', detail: 'Für Laktoseintoleranz', prices: { aldi: 1.19, lidl: 1.25, rewe: 1.49, edeka: 1.79 } },
    ],
  },
  {
    id: 'butter', name: 'Butter 82% Fett', detail: '250-g-Block', category: '🧈 Milchprodukte',
    prices:     { aldi: 1.89, lidl: 1.99, rewe: 2.29, edeka: 2.49 },
    salePrices: { aldi: null, lidl: 1.59, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: 'Angebot −0,40 €', rewe: null, edeka: null },
    alternatives: [
      { id: 'alt_bu1', name: 'Butter gesalzen 250 g',    detail: 'Klassisch',                    prices: { aldi: 1.79, lidl: 1.89, rewe: 2.19, edeka: 2.39 } },
      { id: 'alt_bu2', name: 'Margarine 500 g',           detail: 'Pflanzlich, weniger Fett',      prices: { aldi: 1.29, lidl: 1.35, rewe: 1.59, edeka: 1.79 } },
      { id: 'alt_bu3', name: 'Eigenmarke Butter 250 g',   detail: 'Bestes Preis-Leistungs-Verhältnis', prices: { aldi: 1.49, lidl: 1.55, rewe: 1.79, edeka: 1.99 } },
    ],
  },
  {
    id: 'schlagsahne', name: 'Schlagsahne 30%', detail: '200-ml-Packung', category: '🥛 Milchprodukte',
    prices:     { aldi: 0.69, lidl: 0.72, rewe: 0.89, edeka: 1.05 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_sa1', name: 'Schlagsahne 30% 500 ml', detail: 'Große Packung',    prices: { aldi: 1.39, lidl: 1.45, rewe: 1.79, edeka: 2.09 } },
      { id: 'alt_sa2', name: 'Kochsahne 15% 200 ml',   detail: 'Zum Kochen',       prices: { aldi: 0.59, lidl: 0.62, rewe: 0.79, edeka: 0.95 } },
      { id: 'alt_sa3', name: 'Haferkochcreme 200 ml',   detail: 'Vegan',            prices: { aldi: 1.09, lidl: 1.15, rewe: 1.39, edeka: 1.69 } },
    ],
  },
  {
    id: 'sauerrahm', name: 'Sauerrahm 10%', detail: '200-g-Becher', category: '🥛 Milchprodukte',
    prices:     { aldi: 0.49, lidl: 0.52, rewe: 0.69, edeka: 0.85 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_sr1', name: 'Crème fraîche 30% 150 g', detail: 'Cremiger', prices: { aldi: 0.69, lidl: 0.75, rewe: 0.95, edeka: 1.15 } },
      { id: 'alt_sr2', name: 'Schmand 24% 200 g',        detail: 'Sahniger', prices: { aldi: 0.59, lidl: 0.65, rewe: 0.85, edeka: 1.05 } },
    ],
  },
  {
    id: 'joghurt', name: 'Naturjoghurt 3,5%', detail: '500-g-Becher', category: '🥛 Milchprodukte',
    prices:     { aldi: 0.59, lidl: 0.65, rewe: 0.89, edeka: 1.09 },
    salePrices: { aldi: null, lidl: null, rewe: 0.69,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: '2 für 1,30 €', edeka: null },
    alternatives: [
      { id: 'alt_jo1', name: 'Griechischer Joghurt 10% 500 g', detail: 'Cremiger',                prices: { aldi: 0.99, lidl: 1.05, rewe: 1.29, edeka: 1.59 } },
      { id: 'alt_jo2', name: 'Magerquark 500 g',                detail: 'Weniger Fett, mehr Protein', prices: { aldi: 0.55, lidl: 0.59, rewe: 0.79, edeka: 0.99 } },
      { id: 'alt_jo3', name: 'Sojajoghurt natur 500 g',         detail: 'Vegan',                   prices: { aldi: 0.99, lidl: 1.09, rewe: 1.39, edeka: 1.69 } },
    ],
  },
  {
    id: 'griechjoghurt', name: 'Griechischer Joghurt 10%', detail: '500-g-Becher', category: '🥛 Milchprodukte',
    prices:     { aldi: 0.99, lidl: 1.05, rewe: 1.29, edeka: 1.59 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: 1.19 },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: 'Wochenpreis −0,40 €' },
    alternatives: [
      { id: 'alt_gj1', name: 'Skyr natur 450 g',          detail: 'Sehr proteinreich', prices: { aldi: 1.19, lidl: 1.25, rewe: 1.59, edeka: 1.89 } },
      { id: 'alt_gj2', name: 'Kokos-Joghurt 400 g',       detail: 'Vegan & exotisch',  prices: { aldi: 1.49, lidl: 1.59, rewe: 1.99, edeka: 2.29 } },
    ],
  },
  {
    id: 'quark', name: 'Magerquark', detail: '500-g-Becher', category: '🥛 Milchprodukte',
    prices:     { aldi: 0.55, lidl: 0.59, rewe: 0.79, edeka: 0.99 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_qu1', name: 'Speisequark 40% 250 g', detail: 'Fettreicher',  prices: { aldi: 0.65, lidl: 0.72, rewe: 0.95, edeka: 1.15 } },
      { id: 'alt_qu2', name: 'Sahnequark 500 g',       detail: 'Sehr cremig', prices: { aldi: 0.89, lidl: 0.95, rewe: 1.19, edeka: 1.39 } },
    ],
  },

  /* ── KÄSE ── */
  {
    id: 'gouda', name: 'Gouda jung', detail: '400-g-Block', category: '🧀 Käse',
    prices:     { aldi: 2.49, lidl: 2.65, rewe: 3.29, edeka: 3.89 },
    salePrices: { aldi: null, lidl: 2.09, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: 'Wochenangebot −0,56 €', rewe: null, edeka: null },
    alternatives: [
      { id: 'alt_go1', name: 'Emmentaler 45% 400 g',       detail: 'Milder Geschmack',   prices: { aldi: 2.59, lidl: 2.75, rewe: 3.49, edeka: 3.99 } },
      { id: 'alt_go2', name: 'Eigenmarke Scheibenkäse 400 g', detail: 'Günstigste Option', prices: { aldi: 1.89, lidl: 1.99, rewe: 2.49, edeka: 2.99 } },
      { id: 'alt_go3', name: 'Veganer Käse 200 g',          detail: 'Pflanzlich',          prices: { aldi: 2.29, lidl: 2.39, rewe: 2.99, edeka: 3.49 } },
    ],
  },
  {
    id: 'emmentaler', name: 'Emmentaler 45%', detail: '400-g-Block', category: '🧀 Käse',
    prices:     { aldi: 2.59, lidl: 2.75, rewe: 3.49, edeka: 3.99 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_em1', name: 'Bergkäse 50+ 100 g',  detail: 'Kräftiger Geschmack', prices: { aldi: 1.29, lidl: 1.39, rewe: 1.79, edeka: 2.09 } },
      { id: 'alt_em2', name: 'Tilsiter 45% 400 g',  detail: 'Würzig-mild',         prices: { aldi: 2.29, lidl: 2.39, rewe: 2.99, edeka: 3.59 } },
    ],
  },
  {
    id: 'mozzarella', name: 'Mozzarella', detail: '125-g-Kugel', category: '🧀 Käse',
    prices:     { aldi: 0.69, lidl: 0.72, rewe: 0.99, edeka: 1.19 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_mz1', name: 'Büffelmozzarella 125 g', detail: 'Originaler Geschmack',  prices: { aldi: 1.49, lidl: 1.59, rewe: 1.99, edeka: 2.49 } },
      { id: 'alt_mz2', name: 'Mozzarella gerieben 150 g', detail: 'Praktisch zum Backen', prices: { aldi: 0.99, lidl: 1.05, rewe: 1.39, edeka: 1.69 } },
    ],
  },
  {
    id: 'frischkaese', name: 'Frischkäse Natur', detail: '200-g-Becher', category: '🧀 Käse',
    prices:     { aldi: 0.79, lidl: 0.85, rewe: 1.09, edeka: 1.35 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_fk1', name: 'Frischkäse Kräuter 200 g', detail: 'Mit Kräutern', prices: { aldi: 0.89, lidl: 0.95, rewe: 1.19, edeka: 1.49 } },
      { id: 'alt_fk2', name: 'Hüttenkäse 200 g',          detail: 'Proteinreich',  prices: { aldi: 0.99, lidl: 1.05, rewe: 1.35, edeka: 1.59 } },
    ],
  },

  /* ── EIER ── */
  {
    id: 'eier', name: 'Eier Freilandhaltung', detail: '10 Stück (M/L)', category: '🥚 Eier',
    prices:     { aldi: 2.49, lidl: 2.59, rewe: 2.99, edeka: 3.29 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: 2.79 },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: 'Angebot −0,50 €' },
    alternatives: [
      { id: 'alt_ei1', name: 'Eier Bodenhaltung 10 Stk',         detail: 'Günstiger',             prices: { aldi: 1.99, lidl: 2.09, rewe: 2.49, edeka: 2.79 } },
      { id: 'alt_ei2', name: 'Bio-Eier Freilandhaltung 6 Stk',  detail: 'Zertifiziert biologisch', prices: { aldi: 2.29, lidl: 2.39, rewe: 2.89, edeka: 3.19 } },
      { id: 'alt_ei3', name: 'Eier Freilandhaltung 6 Stk',      detail: 'Kleinere Packung',       prices: { aldi: 1.49, lidl: 1.59, rewe: 1.89, edeka: 2.09 } },
    ],
  },
  {
    id: 'eier_bio', name: 'Bio-Eier Freilandhaltung', detail: '6 Stück (M/L)', category: '🥚 Eier',
    prices:     { aldi: 2.29, lidl: 2.39, rewe: 2.89, edeka: 3.19 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_eb1', name: 'Bio-Eier 10 Stk', detail: 'Größere Packung', prices: { aldi: 3.79, lidl: 3.99, rewe: 4.79, edeka: 5.29 } },
    ],
  },

  /* ── BACKWAREN ── */
  {
    id: 'toastbrot', name: 'Toastbrot', detail: '500-g-Packung', category: '🍞 Backwaren',
    prices:     { aldi: 0.99, lidl: 1.05, rewe: 1.39, edeka: 1.59 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_tb1', name: 'Vollkorntoast 500 g',        detail: 'Mehr Ballaststoffe',  prices: { aldi: 1.09, lidl: 1.15, rewe: 1.49, edeka: 1.79 } },
      { id: 'alt_tb2', name: 'Sandwich-Toastbrot 750 g',   detail: 'Größere Packung',     prices: { aldi: 1.29, lidl: 1.39, rewe: 1.79, edeka: 1.99 } },
      { id: 'alt_tb3', name: 'Eigenmarke Toastbrot 500 g', detail: 'Günstigste Option',   prices: { aldi: 0.79, lidl: 0.82, rewe: 0.99, edeka: 1.15 } },
    ],
  },
  {
    id: 'vollkorntoast', name: 'Vollkorntoast', detail: '500-g-Packung', category: '🍞 Backwaren',
    prices:     { aldi: 1.09, lidl: 1.15, rewe: 1.49, edeka: 1.79 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_vt1', name: 'Dinkeltoast 500 g',      detail: 'Bekömmlicher',          prices: { aldi: 1.29, lidl: 1.35, rewe: 1.69, edeka: 1.99 } },
      { id: 'alt_vt2', name: 'Eiweißbrot 500 g',       detail: 'Proteinreich, Low-Carb', prices: { aldi: 1.79, lidl: 1.89, rewe: 2.29, edeka: 2.79 } },
    ],
  },
  {
    id: 'schwarzbrot', name: 'Schwarzbrot / Vollkornbrot', detail: '500-g-Laib', category: '🍞 Backwaren',
    prices:     { aldi: 1.19, lidl: 1.25, rewe: 1.79, edeka: 2.09 },
    salePrices: { aldi: 0.99, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: 'Aktionspreis −0,20 €', lidl: null, rewe: null, edeka: null },
    alternatives: [
      { id: 'alt_sb1', name: 'Roggenmischbrot 500 g', detail: 'Milder Geschmack', prices: { aldi: 1.09, lidl: 1.15, rewe: 1.65, edeka: 1.89 } },
      { id: 'alt_sb2', name: 'Bauernbrot 750 g',       detail: 'Traditionell',    prices: { aldi: 1.49, lidl: 1.59, rewe: 2.09, edeka: 2.49 } },
    ],
  },
  {
    id: 'broetchen', name: 'Brötchen', detail: '6er-Packung (aufbacken)', category: '🥐 Backwaren',
    prices:     { aldi: 0.89, lidl: 0.92, rewe: 1.19, edeka: 1.39 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_br1', name: 'Vollkornbrötchen 6er',    detail: 'Mehr Ballaststoffe',  prices: { aldi: 0.99, lidl: 1.05, rewe: 1.39, edeka: 1.59 } },
      { id: 'alt_br2', name: 'Sesam-Brötchen 6er',      detail: 'Nussiger Geschmack',  prices: { aldi: 0.99, lidl: 1.05, rewe: 1.29, edeka: 1.49 } },
    ],
  },
  {
    id: 'knaeckebrot', name: 'Knäckebrot', detail: '250-g-Packung', category: '🍞 Backwaren',
    prices:     { aldi: 0.89, lidl: 0.95, rewe: 1.19, edeka: 1.49 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_kb_1', name: 'Knäckebrot Roggen 250 g',     detail: 'Traditionell',   prices: { aldi: 0.89, lidl: 0.95, rewe: 1.19, edeka: 1.49 } },
      { id: 'alt_kb_2', name: 'Reiswaffeln leicht gesalzen', detail: 'Leichte Option', prices: { aldi: 0.79, lidl: 0.85, rewe: 1.09, edeka: 1.35 } },
    ],
  },

  /* ── FLEISCH & FISCH ── */
  {
    id: 'haehnchen', name: 'Hähnchenbrust', detail: '500-g-Packung', category: '🥩 Fleisch & Fisch',
    prices:     { aldi: 3.99, lidl: 3.79, rewe: 4.99, edeka: 5.49 },
    salePrices: { aldi: 3.19, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: '20% günstiger diese Woche', lidl: null, rewe: null, edeka: null },
    alternatives: [
      { id: 'alt_hh1', name: 'Hähnchenschenkel 1 kg', detail: 'Mehr Geschmack',  prices: { aldi: 2.99, lidl: 2.79, rewe: 3.99, edeka: 4.49 } },
      { id: 'alt_hh2', name: 'Putenbrust 400 g',       detail: 'Mageres Geflügel', prices: { aldi: 3.49, lidl: 3.59, rewe: 4.49, edeka: 4.99 } },
      { id: 'alt_hh3', name: 'Tofu extra fest 400 g',  detail: 'Vegane Alternative', prices: { aldi: 1.99, lidl: 2.09, rewe: 2.49, edeka: 2.99 } },
    ],
  },
  {
    id: 'hackfleisch', name: 'Rinderhackfleisch', detail: '500 g', category: '🥩 Fleisch & Fisch',
    prices:     { aldi: 3.49, lidl: 3.29, rewe: 4.49, edeka: 4.99 },
    salePrices: { aldi: null, lidl: 2.99, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: 'Nur heute −0,30 €', rewe: null, edeka: null },
    alternatives: [
      { id: 'alt_hf1', name: 'Gemischtes Hackfleisch 500 g', detail: 'Schwein & Rind', prices: { aldi: 2.99, lidl: 2.89, rewe: 3.79, edeka: 4.29 } },
      { id: 'alt_hf2', name: 'Putenhack 400 g',              detail: 'Weniger Fett',   prices: { aldi: 2.79, lidl: 2.89, rewe: 3.49, edeka: 3.99 } },
      { id: 'alt_hf3', name: 'Veganes Hackfleisch 300 g',    detail: 'Pflanzlich',      prices: { aldi: 2.49, lidl: 2.59, rewe: 2.99, edeka: 3.49 } },
    ],
  },
  {
    id: 'schweineschnitzel', name: 'Schweineschnitzel', detail: '500-g-Packung', category: '🥩 Fleisch & Fisch',
    prices:     { aldi: 3.29, lidl: 3.19, rewe: 4.49, edeka: 4.99 },
    salePrices: { aldi: null, lidl: null, rewe: 3.49,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: 'Frischetheke −1,00 €', edeka: null },
    alternatives: [
      { id: 'alt_ss1', name: 'Schweinekotelett 500 g', detail: 'Mit Knochen',       prices: { aldi: 2.79, lidl: 2.69, rewe: 3.79, edeka: 4.29 } },
      { id: 'alt_ss2', name: 'Kalbsschnitzel 400 g',   detail: 'Zarter Geschmack',  prices: { aldi: 5.49, lidl: 5.29, rewe: 7.49, edeka: 8.49 } },
    ],
  },
  {
    id: 'bratwurst', name: 'Bratwurst', detail: '400-g-Packung (4 Stk)', category: '🌭 Fleisch & Fisch',
    prices:     { aldi: 2.29, lidl: 2.19, rewe: 2.99, edeka: 3.49 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_bw1', name: 'Thüringer Rostbratwurst 400 g', detail: 'Traditionell',     prices: { aldi: 2.49, lidl: 2.39, rewe: 3.29, edeka: 3.79 } },
      { id: 'alt_bw2', name: 'Vegane Bratwurst 300 g',        detail: 'Pflanzlich',        prices: { aldi: 2.49, lidl: 2.59, rewe: 3.19, edeka: 3.69 } },
    ],
  },
  {
    id: 'lachsfilet', name: 'Lachsfilet', detail: '300-g-Packung', category: '🐟 Fisch',
    prices:     { aldi: 4.49, lidl: 4.29, rewe: 5.99, edeka: 6.99 },
    salePrices: { aldi: null, lidl: 3.99, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: 'Fischangebot −0,30 €', rewe: null, edeka: null },
    alternatives: [
      { id: 'alt_lf1', name: 'Tiefkühl-Lachsfilet 400 g', detail: 'Günstiger',          prices: { aldi: 3.99, lidl: 3.79, rewe: 4.99, edeka: 5.79 } },
      { id: 'alt_lf2', name: 'Pangasiusfilet 400 g',       detail: 'Milder weißer Fisch', prices: { aldi: 2.99, lidl: 2.89, rewe: 3.99, edeka: 4.59 } },
      { id: 'alt_lf3', name: 'Kabeljaufilet 400 g',        detail: 'Zart & mager',        prices: { aldi: 3.49, lidl: 3.39, rewe: 4.69, edeka: 5.29 } },
    ],
  },
  {
    id: 'thunfisch', name: 'Thunfisch in Öl', detail: '185-g-Dose', category: '🐟 Fisch',
    prices:     { aldi: 1.19, lidl: 1.25, rewe: 1.59, edeka: 1.89 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_tf1', name: 'Thunfisch in Wasser 185 g',  detail: 'Weniger Kalorien',   prices: { aldi: 1.09, lidl: 1.15, rewe: 1.49, edeka: 1.79 } },
      { id: 'alt_tf2', name: 'Sardinen in Öl 120 g',       detail: 'Reich an Omega-3',   prices: { aldi: 0.99, lidl: 1.05, rewe: 1.35, edeka: 1.65 } },
    ],
  },

  /* ── GEMÜSE ── */
  {
    id: 'kartoffeln', name: 'Kartoffeln festkochend', detail: '1,5-kg-Netz', category: '🥔 Gemüse',
    prices:     { aldi: 1.29, lidl: 1.19, rewe: 1.49, edeka: 1.79 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_kf1', name: 'Kartoffeln mehlig 2,5 kg',         detail: 'Für Brei & Suppen', prices: { aldi: 1.79, lidl: 1.69, rewe: 1.99, edeka: 2.39 } },
      { id: 'alt_kf2', name: 'Drillinge (Kleine Kartoffeln) 750 g', detail: 'Schnell gar',    prices: { aldi: 1.49, lidl: 1.55, rewe: 1.89, edeka: 2.19 } },
    ],
  },
  {
    id: 'zwiebeln', name: 'Zwiebeln', detail: '1-kg-Netz', category: '🧅 Gemüse',
    prices:     { aldi: 0.79, lidl: 0.75, rewe: 0.99, edeka: 1.19 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_zw1', name: 'Rote Zwiebeln 1 kg',    detail: 'Milder, süßer',      prices: { aldi: 0.99, lidl: 0.95, rewe: 1.29, edeka: 1.49 } },
      { id: 'alt_zw2', name: 'Lauchzwiebeln Bund',    detail: 'Frischer Geschmack', prices: { aldi: 0.69, lidl: 0.72, rewe: 0.89, edeka: 0.99 } },
    ],
  },
  {
    id: 'karotten', name: 'Karotten', detail: '1-kg-Beutel', category: '🥕 Gemüse',
    prices:     { aldi: 0.89, lidl: 0.85, rewe: 1.09, edeka: 1.29 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_kr1', name: 'Babykarotten 300 g',    detail: 'Zum Snacken',       prices: { aldi: 0.89, lidl: 0.95, rewe: 1.19, edeka: 1.39 } },
      { id: 'alt_kr2', name: 'Karotten-Netz 2,5 kg',  detail: 'Großpackung',       prices: { aldi: 1.99, lidl: 1.89, rewe: 2.29, edeka: 2.79 } },
    ],
  },
  {
    id: 'brokkoli', name: 'Brokkoli', detail: '500-g-Kopf', category: '🥦 Gemüse',
    prices:     { aldi: 0.99, lidl: 0.95, rewe: 1.29, edeka: 1.59 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_bk1', name: 'TK-Brokkoli 750 g',     detail: 'Länger haltbar',        prices: { aldi: 1.09, lidl: 1.15, rewe: 1.45, edeka: 1.75 } },
      { id: 'alt_bk2', name: 'Blumenkohl 1 Kopf',      detail: 'Milder',                prices: { aldi: 1.29, lidl: 1.19, rewe: 1.59, edeka: 1.89 } },
    ],
  },
  {
    id: 'paprika', name: 'Paprika rot', detail: '3er-Packung', category: '🫑 Gemüse',
    prices:     { aldi: 1.79, lidl: 1.69, rewe: 1.99, edeka: 2.29 },
    salePrices: { aldi: null, lidl: 1.39, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: 'Gemüse-Angebot −0,30 €', rewe: null, edeka: null },
    alternatives: [
      { id: 'alt_pa1', name: 'Paprika gemischt 3er Pck.', detail: 'Rot, Gelb, Grün',    prices: { aldi: 1.89, lidl: 1.79, rewe: 2.09, edeka: 2.49 } },
      { id: 'alt_pa2', name: 'Paprika TK 500 g',          detail: 'Praktische Streifen', prices: { aldi: 1.49, lidl: 1.55, rewe: 1.79, edeka: 2.09 } },
    ],
  },
  {
    id: 'tomaten_frisch', name: 'Rispentomaten', detail: '500-g-Schale', category: '🍅 Gemüse',
    prices:     { aldi: 1.49, lidl: 1.39, rewe: 1.69, edeka: 1.99 },
    salePrices: { aldi: null, lidl: null, rewe: 1.29,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: 'Saisonangebot −0,40 €', edeka: null },
    alternatives: [
      { id: 'alt_to1', name: 'Cherrytomaten 250 g',       detail: 'Süßer Geschmack', prices: { aldi: 1.29, lidl: 1.35, rewe: 1.59, edeka: 1.89 } },
      { id: 'alt_to2', name: 'Dosentomaten gehackt 400 g', detail: 'Für Saucen',    prices: { aldi: 0.49, lidl: 0.55, rewe: 0.69, edeka: 0.85 } },
    ],
  },
  {
    id: 'gurke', name: 'Salatgurke', detail: '1 Stück', category: '🥒 Gemüse',
    prices:     { aldi: 0.59, lidl: 0.55, rewe: 0.79, edeka: 0.99 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_gu1', name: 'Snackgurken 500 g',       detail: 'Klein & knackig',  prices: { aldi: 0.99, lidl: 0.95, rewe: 1.29, edeka: 1.49 } },
      { id: 'alt_gu2', name: 'Gewürzgurken 720-ml-Glas', detail: 'Eingelegt',       prices: { aldi: 0.89, lidl: 0.95, rewe: 1.29, edeka: 1.59 } },
    ],
  },
  {
    id: 'zucchini', name: 'Zucchini', detail: '2er-Pack (~500 g)', category: '🥒 Gemüse',
    prices:     { aldi: 0.79, lidl: 0.75, rewe: 0.99, edeka: 1.29 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_zc1', name: 'Aubergine 1 Stk',  detail: 'Mediterran',       prices: { aldi: 0.89, lidl: 0.85, rewe: 1.09, edeka: 1.39 } },
      { id: 'alt_zc2', name: 'Kürbis 1 kg',       detail: 'Saisonal, herbstlich', prices: { aldi: 0.99, lidl: 0.95, rewe: 1.29, edeka: 1.59 } },
    ],
  },
  {
    id: 'blumenkohl', name: 'Blumenkohl', detail: '1 Kopf (~800 g)', category: '🥦 Gemüse',
    prices:     { aldi: 1.29, lidl: 1.19, rewe: 1.59, edeka: 1.89 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_bk_1', name: 'TK-Blumenkohl 750 g',  detail: 'Immer verfügbar', prices: { aldi: 1.09, lidl: 1.15, rewe: 1.45, edeka: 1.75 } },
      { id: 'alt_bk_2', name: 'Romanesco 1 Kopf',     detail: 'Nussiger Geschmack', prices: { aldi: 1.49, lidl: 1.39, rewe: 1.89, edeka: 2.29 } },
    ],
  },
  {
    id: 'champignons', name: 'Champignons weiß', detail: '500-g-Schale', category: '🍄 Gemüse',
    prices:     { aldi: 1.49, lidl: 1.39, rewe: 1.89, edeka: 2.19 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_ch1', name: 'Champignons 250 g',     detail: 'Kleinere Packung',  prices: { aldi: 0.79, lidl: 0.75, rewe: 0.99, edeka: 1.19 } },
      { id: 'alt_ch2', name: 'Champignons Dose 400 g', detail: 'Länger haltbar',   prices: { aldi: 0.79, lidl: 0.85, rewe: 1.09, edeka: 1.35 } },
    ],
  },
  {
    id: 'knoblauch', name: 'Knoblauch', detail: '3er-Netz', category: '🧄 Gemüse',
    prices:     { aldi: 0.69, lidl: 0.65, rewe: 0.89, edeka: 1.09 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_kn1', name: 'Knoblauchpaste 75 g',  detail: 'Praktisch & schnell', prices: { aldi: 0.79, lidl: 0.85, rewe: 1.09, edeka: 1.35 } },
      { id: 'alt_kn2', name: 'Knoblauchgranulat 50 g', detail: 'Lange haltbar',     prices: { aldi: 0.59, lidl: 0.65, rewe: 0.89, edeka: 1.09 } },
    ],
  },
  {
    id: 'spinat', name: 'Babyspinat', detail: '200-g-Beutel', category: '🥬 Salat & Blattgemüse',
    prices:     { aldi: 1.39, lidl: 1.29, rewe: 1.69, edeka: 1.99 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: 1.49 },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: 'Frischepreis −0,50 €' },
    alternatives: [
      { id: 'alt_sp1', name: 'TK-Spinat gehackt 750 g', detail: 'Länger haltbar',    prices: { aldi: 1.09, lidl: 1.15, rewe: 1.39, edeka: 1.69 } },
      { id: 'alt_sp2', name: 'Rucola 100 g',             detail: 'Pfeffrig, aromatisch', prices: { aldi: 0.99, lidl: 1.05, rewe: 1.29, edeka: 1.49 } },
    ],
  },
  {
    id: 'eisbergsalat', name: 'Eisbergsalat', detail: '1 Kopf', category: '🥬 Salat & Blattgemüse',
    prices:     { aldi: 0.59, lidl: 0.55, rewe: 0.79, edeka: 0.99 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_el1', name: 'Feldsalat 100 g',     detail: 'Nussiger Geschmack',   prices: { aldi: 1.19, lidl: 1.25, rewe: 1.49, edeka: 1.79 } },
      { id: 'alt_el2', name: 'Lollo Rosso 1 Kopf',  detail: 'Dekorativ & lecker',   prices: { aldi: 0.89, lidl: 0.85, rewe: 1.09, edeka: 1.35 } },
    ],
  },
  {
    id: 'lauch', name: 'Lauchstange', detail: '1 Stück (~500 g)', category: '🌿 Gemüse',
    prices:     { aldi: 0.69, lidl: 0.65, rewe: 0.89, edeka: 1.09 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_la1', name: 'Porree TK 750 g', detail: 'Immer verfügbar', prices: { aldi: 1.09, lidl: 1.15, rewe: 1.45, edeka: 1.75 } },
    ],
  },

  /* ── OBST ── */
  {
    id: 'aepfel', name: 'Äpfel Elstar / Gala', detail: '1-kg-Beutel', category: '🍎 Obst',
    prices:     { aldi: 1.79, lidl: 1.75, rewe: 1.99, edeka: 2.49 },
    salePrices: { aldi: null, lidl: null, rewe: 1.59,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: 'Preis der Woche −0,40 €', edeka: null },
    alternatives: [
      { id: 'alt_ae1', name: 'Äpfel Braeburn 1 kg', detail: 'Herber Geschmack', prices: { aldi: 1.69, lidl: 1.65, rewe: 1.89, edeka: 2.29 } },
      { id: 'alt_ae2', name: 'Birnen 1 kg',           detail: 'Süße Alternative', prices: { aldi: 1.89, lidl: 1.79, rewe: 2.09, edeka: 2.59 } },
    ],
  },
  {
    id: 'bananen', name: 'Bananen', detail: '1-kg-Bund', category: '🍌 Obst',
    prices:     { aldi: 1.19, lidl: 1.09, rewe: 1.39, edeka: 1.59 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_ba1', name: 'Bananen lose, ca. 5 Stk.', detail: 'Nach Gewicht',  prices: { aldi: 0.99, lidl: 0.95, rewe: 1.19, edeka: 1.39 } },
      { id: 'alt_ba2', name: 'Clementinen 1 kg',          detail: 'Saisonal',      prices: { aldi: 1.49, lidl: 1.39, rewe: 1.69, edeka: 1.99 } },
    ],
  },
  {
    id: 'orangen', name: 'Orangen', detail: '1,5-kg-Netz', category: '🍊 Obst',
    prices:     { aldi: 1.99, lidl: 1.89, rewe: 2.29, edeka: 2.79 },
    salePrices: { aldi: null, lidl: 1.49, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: 'Saftige Orangen −0,40 €', rewe: null, edeka: null },
    alternatives: [
      { id: 'alt_or1', name: 'Mandarinen 1,5 kg Netz', detail: 'Einfach zu schälen', prices: { aldi: 1.79, lidl: 1.69, rewe: 2.09, edeka: 2.59 } },
      { id: 'alt_or2', name: 'Blutorangen 1 kg',        detail: 'Fruchtig-herber Geschmack', prices: { aldi: 1.89, lidl: 1.79, rewe: 2.19, edeka: 2.69 } },
    ],
  },
  {
    id: 'erdbeeren', name: 'Erdbeeren', detail: '500-g-Schale', category: '🍓 Obst',
    prices:     { aldi: 1.99, lidl: 1.89, rewe: 2.49, edeka: 2.99 },
    salePrices: { aldi: null, lidl: null, rewe: 1.79,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: 'Saisonpreis −0,70 €', edeka: null },
    alternatives: [
      { id: 'alt_er1', name: 'TK-Erdbeeren 750 g',     detail: 'Das ganze Jahr verfügbar', prices: { aldi: 1.49, lidl: 1.55, rewe: 1.89, edeka: 2.29 } },
      { id: 'alt_er2', name: 'Heidelbeeren 250 g',      detail: 'Antioxidantien-reich',    prices: { aldi: 1.49, lidl: 1.39, rewe: 1.79, edeka: 2.09 } },
    ],
  },
  {
    id: 'trauben', name: 'Weintrauben hell', detail: '500-g-Schale', category: '🍇 Obst',
    prices:     { aldi: 1.79, lidl: 1.69, rewe: 2.19, edeka: 2.69 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_tr1', name: 'Weintrauben dunkel 500 g', detail: 'Kernlos & süß', prices: { aldi: 1.79, lidl: 1.69, rewe: 2.19, edeka: 2.69 } },
    ],
  },
  {
    id: 'zitronen', name: 'Zitronen', detail: '500-g-Netz (4 Stk)', category: '🍋 Obst',
    prices:     { aldi: 0.89, lidl: 0.85, rewe: 1.09, edeka: 1.39 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_zi1', name: 'Limetten 500 g Netz',    detail: 'Exotische Note',    prices: { aldi: 0.99, lidl: 0.95, rewe: 1.19, edeka: 1.49 } },
      { id: 'alt_zi2', name: 'Zitronensaft 200 ml',    detail: 'Praktisch & frisch', prices: { aldi: 0.79, lidl: 0.85, rewe: 1.09, edeka: 1.35 } },
    ],
  },
  {
    id: 'kiwi', name: 'Kiwi', detail: '6er-Netz', category: '🥝 Obst',
    prices:     { aldi: 0.99, lidl: 0.95, rewe: 1.29, edeka: 1.59 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_ki1', name: 'Kiwi einzeln',        detail: 'Pro Stück',        prices: { aldi: 0.25, lidl: 0.25, rewe: 0.35, edeka: 0.45 } },
    ],
  },

  /* ── NUDELN & REIS ── */
  {
    id: 'spaghetti', name: 'Spaghetti No. 5', detail: '500-g-Packung', category: '🍝 Nudeln',
    prices:     { aldi: 0.79, lidl: 0.85, rewe: 1.09, edeka: 1.29 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_sps1', name: 'Vollkornspaghetti 500 g',    detail: 'Mehr Ballaststoffe',  prices: { aldi: 0.99, lidl: 1.05, rewe: 1.39, edeka: 1.59 } },
      { id: 'alt_sps2', name: 'Penne Rigate 500 g',          detail: 'Andere Form',         prices: { aldi: 0.79, lidl: 0.82, rewe: 1.05, edeka: 1.25 } },
      { id: 'alt_sps3', name: 'Eigenmarke Nudeln 500 g',     detail: 'Günstigste Option',   prices: { aldi: 0.59, lidl: 0.62, rewe: 0.79, edeka: 0.95 } },
    ],
  },
  {
    id: 'penne', name: 'Penne Rigate', detail: '500-g-Packung', category: '🍝 Nudeln',
    prices:     { aldi: 0.79, lidl: 0.82, rewe: 1.05, edeka: 1.25 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_pe1', name: 'Fusilli 500 g',          detail: 'Für dicke Saucen', prices: { aldi: 0.79, lidl: 0.82, rewe: 1.05, edeka: 1.25 } },
      { id: 'alt_pe2', name: 'Rigatoni 500 g',          detail: 'Groß & röhrig',   prices: { aldi: 0.79, lidl: 0.85, rewe: 1.09, edeka: 1.29 } },
    ],
  },
  {
    id: 'reis', name: 'Basmati-Reis', detail: '1-kg-Packung', category: '🍚 Reis & Getreide',
    prices:     { aldi: 1.79, lidl: 1.85, rewe: 2.49, edeka: 2.89 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_re1', name: 'Parboiled Reis 1 kg',          detail: 'Körniger',          prices: { aldi: 1.49, lidl: 1.55, rewe: 1.99, edeka: 2.29 } },
      { id: 'alt_re2', name: 'Eigenmarke Langkornreis 1 kg', detail: 'Günstige Wahl',     prices: { aldi: 1.19, lidl: 1.25, rewe: 1.59, edeka: 1.89 } },
      { id: 'alt_re3', name: 'Vollkornreis 1 kg',             detail: 'Nährstoffreich',    prices: { aldi: 1.99, lidl: 2.05, rewe: 2.69, edeka: 3.09 } },
    ],
  },

  /* ── FRÜHSTÜCK & CEREALIEN ── */
  {
    id: 'haferflocken', name: 'Haferflocken kernig', detail: '500-g-Packung', category: '🌾 Frühstück',
    prices:     { aldi: 0.79, lidl: 0.85, rewe: 1.09, edeka: 1.29 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_hfl1', name: 'Haferflocken zart 500 g',  detail: 'Weicher',          prices: { aldi: 0.79, lidl: 0.85, rewe: 1.09, edeka: 1.29 } },
      { id: 'alt_hfl2', name: 'Müsli (ohne Zucker) 500 g', detail: 'Mehr Vielfalt',  prices: { aldi: 1.49, lidl: 1.59, rewe: 1.99, edeka: 2.29 } },
    ],
  },
  {
    id: 'cornflakes', name: 'Cornflakes', detail: '375-g-Packung', category: '🌾 Frühstück',
    prices:     { aldi: 0.99, lidl: 1.05, rewe: 1.39, edeka: 1.79 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_cf1', name: 'Vollkorn-Cornflakes 375 g', detail: 'Mehr Ballaststoffe', prices: { aldi: 1.09, lidl: 1.15, rewe: 1.55, edeka: 1.99 } },
      { id: 'alt_cf2', name: 'Honig-Pops 375 g',           detail: 'Süßer Geschmack',   prices: { aldi: 1.19, lidl: 1.25, rewe: 1.69, edeka: 2.09 } },
    ],
  },
  {
    id: 'muesli', name: 'Müsli knusprig', detail: '500-g-Packung', category: '🌾 Frühstück',
    prices:     { aldi: 1.49, lidl: 1.59, rewe: 2.09, edeka: 2.49 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_mu1', name: 'Müsli ohne Zucker 500 g',  detail: 'Zuckerfrei',      prices: { aldi: 1.69, lidl: 1.79, rewe: 2.29, edeka: 2.79 } },
      { id: 'alt_mu2', name: 'Granola 400 g',             detail: 'Knusprig & süß', prices: { aldi: 1.99, lidl: 2.09, rewe: 2.79, edeka: 3.29 } },
    ],
  },
  {
    id: 'marmelade', name: 'Erdbeermarmelade', detail: '450-g-Glas', category: '🫙 Brotaufstrich',
    prices:     { aldi: 0.99, lidl: 1.09, rewe: 1.49, edeka: 1.89 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_mj1', name: 'Himbeermarmelade 450 g',      detail: 'Fruchtig-säuerlich',  prices: { aldi: 0.99, lidl: 1.09, rewe: 1.49, edeka: 1.89 } },
      { id: 'alt_mj2', name: 'Orangenmarmelade 450 g',       detail: 'Traditionell britisch', prices: { aldi: 0.99, lidl: 1.09, rewe: 1.49, edeka: 1.89 } },
      { id: 'alt_mj3', name: 'Bio-Erdbeermarmelade 340 g',   detail: 'Biologisch angebaut', prices: { aldi: 1.99, lidl: 2.09, rewe: 2.69, edeka: 3.19 } },
    ],
  },
  {
    id: 'honig', name: 'Echter Deutscher Honig', detail: '500-g-Glas', category: '🍯 Brotaufstrich',
    prices:     { aldi: 2.99, lidl: 3.19, rewe: 3.99, edeka: 4.79 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_ho1', name: 'Akazienhonig 500 g',    detail: 'Mild & flüssig',     prices: { aldi: 3.49, lidl: 3.69, rewe: 4.99, edeka: 5.79 } },
      { id: 'alt_ho2', name: 'Blütenhonig 500 g',     detail: 'Klassisch',          prices: { aldi: 2.79, lidl: 2.99, rewe: 3.79, edeka: 4.49 } },
      { id: 'alt_ho3', name: 'Nuss-Nougat-Creme 450 g', detail: 'Vegane Wahl existiert', prices: { aldi: 1.69, lidl: 1.79, rewe: 2.29, edeka: 2.79 } },
    ],
  },

  /* ── KONSERVEN ── */
  {
    id: 'tomaten_dose', name: 'Geschälte Tomaten', detail: '400-g-Dose', category: '🥫 Konserven',
    prices:     { aldi: 0.55, lidl: 0.59, rewe: 0.79, edeka: 0.95 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_td1', name: 'Gehackte Tomaten 400 g',   detail: 'Für Saucen',       prices: { aldi: 0.49, lidl: 0.55, rewe: 0.69, edeka: 0.85 } },
      { id: 'alt_td2', name: 'Passierte Tomaten 500 ml', detail: 'Fertige Basis',    prices: { aldi: 0.69, lidl: 0.75, rewe: 0.95, edeka: 1.15 } },
      { id: 'alt_td3', name: 'Tomatenmark 70 g',          detail: 'Konzentriert',     prices: { aldi: 0.29, lidl: 0.32, rewe: 0.45, edeka: 0.55 } },
    ],
  },
  {
    id: 'gehaeckte_tomaten', name: 'Gehackte Tomaten', detail: '400-g-Dose', category: '🥫 Konserven',
    prices:     { aldi: 0.49, lidl: 0.55, rewe: 0.69, edeka: 0.85 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_gt1', name: 'Passierte Tomaten 700 ml', detail: 'Glattere Sauce', prices: { aldi: 0.89, lidl: 0.95, rewe: 1.19, edeka: 1.45 } },
    ],
  },
  {
    id: 'kidneybohnen', name: 'Kidneybohnen', detail: '400-g-Dose', category: '🥫 Konserven',
    prices:     { aldi: 0.59, lidl: 0.65, rewe: 0.79, edeka: 0.95 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_kb_1', name: 'Kichererbsen 400 g',            detail: 'Vielseitig',             prices: { aldi: 0.59, lidl: 0.65, rewe: 0.79, edeka: 0.95 } },
      { id: 'alt_kb_2', name: 'Weiße Bohnen 400 g',            detail: 'Milder',                 prices: { aldi: 0.55, lidl: 0.59, rewe: 0.75, edeka: 0.89 } },
      { id: 'alt_kb_3', name: 'Rote Linsen 500 g (trocken)',   detail: 'Günstiger per Portion',  prices: { aldi: 0.99, lidl: 1.05, rewe: 1.29, edeka: 1.55 } },
    ],
  },
  {
    id: 'mais', name: 'Mais in Dose', detail: '285-g-Dose', category: '🥫 Konserven',
    prices:     { aldi: 0.59, lidl: 0.65, rewe: 0.79, edeka: 0.95 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_ma1', name: 'Mais in Dose 425 g', detail: 'Größere Dose', prices: { aldi: 0.79, lidl: 0.85, rewe: 1.09, edeka: 1.29 } },
    ],
  },
  {
    id: 'erbsen', name: 'Erbsen & Möhren', detail: '400-g-Dose', category: '🥫 Konserven',
    prices:     { aldi: 0.55, lidl: 0.59, rewe: 0.75, edeka: 0.89 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_ep1', name: 'Erbsen pur 400 g Dose', detail: 'Ohne Möhren',   prices: { aldi: 0.49, lidl: 0.55, rewe: 0.69, edeka: 0.85 } },
    ],
  },

  /* ── ÖLE & SAUCEN ── */
  {
    id: 'olivenoel', name: 'Olivenöl nativ extra', detail: '500-ml-Flasche', category: '🫙 Öle',
    prices:     { aldi: 3.49, lidl: 3.59, rewe: 4.49, edeka: 5.29 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: 3.79 },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: 'Wochendeal −1,50 €' },
    alternatives: [
      { id: 'alt_oe1', name: 'Sonnenblumenöl 1 L',          detail: 'Neutraler Geschmack', prices: { aldi: 1.49, lidl: 1.59, rewe: 1.99, edeka: 2.29 } },
      { id: 'alt_oe2', name: 'Rapsöl 1 L',                  detail: 'Mild & heimisch',      prices: { aldi: 1.79, lidl: 1.89, rewe: 2.19, edeka: 2.49 } },
      { id: 'alt_oe3', name: 'Olivenöl raffiniert 500 ml',  detail: 'Zum Braten',           prices: { aldi: 2.49, lidl: 2.59, rewe: 3.29, edeka: 3.99 } },
    ],
  },
  {
    id: 'sonnenblumenoel', name: 'Sonnenblumenöl', detail: '1-L-Flasche', category: '🫙 Öle',
    prices:     { aldi: 1.49, lidl: 1.59, rewe: 1.99, edeka: 2.29 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_so1', name: 'Rapsöl 1 L', detail: 'Heimisch & gesund', prices: { aldi: 1.79, lidl: 1.89, rewe: 2.19, edeka: 2.49 } },
    ],
  },
  {
    id: 'ketchup', name: 'Tomaten-Ketchup', detail: '500-ml-Flasche', category: '🥫 Saucen',
    prices:     { aldi: 0.89, lidl: 0.95, rewe: 1.29, edeka: 1.59 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_kt1', name: 'Ketchup ohne Zuckerzusatz 500 ml', detail: 'Zuckerreduziert', prices: { aldi: 0.99, lidl: 1.05, rewe: 1.49, edeka: 1.79 } },
      { id: 'alt_kt2', name: 'Curry-Ketchup 500 ml',             detail: 'Würzig',           prices: { aldi: 0.99, lidl: 1.05, rewe: 1.45, edeka: 1.79 } },
    ],
  },
  {
    id: 'senf', name: 'Senf mittelscharf', detail: '250-g-Tube', category: '🥫 Saucen',
    prices:     { aldi: 0.59, lidl: 0.65, rewe: 0.89, edeka: 1.09 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_se1', name: 'Senf scharf 250 g',       detail: 'Für Würstchen',     prices: { aldi: 0.59, lidl: 0.65, rewe: 0.89, edeka: 1.09 } },
      { id: 'alt_se2', name: 'Dijon-Senf 200 g',        detail: 'Feines Aroma',      prices: { aldi: 0.99, lidl: 1.05, rewe: 1.39, edeka: 1.69 } },
    ],
  },

  /* ── BACKZUTATEN & GEWÜRZE ── */
  {
    id: 'mehl', name: 'Weizenmehl Type 405', detail: '1-kg-Packung', category: '🌾 Backen',
    prices:     { aldi: 0.69, lidl: 0.72, rewe: 0.89, edeka: 1.09 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_mf1', name: 'Dinkelmehl Type 630 1 kg', detail: 'Bekömmlicher',     prices: { aldi: 1.19, lidl: 1.25, rewe: 1.59, edeka: 1.99 } },
      { id: 'alt_mf2', name: 'Vollkornmehl 1 kg',         detail: 'Mehr Ballaststoffe', prices: { aldi: 0.99, lidl: 1.05, rewe: 1.35, edeka: 1.65 } },
    ],
  },
  {
    id: 'zucker', name: 'Weißer Zucker', detail: '1-kg-Packung', category: '🌾 Backen',
    prices:     { aldi: 0.99, lidl: 1.05, rewe: 1.29, edeka: 1.49 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_zu1', name: 'Brauner Zucker 500 g',   detail: 'Für Gebäck',      prices: { aldi: 1.09, lidl: 1.15, rewe: 1.49, edeka: 1.79 } },
      { id: 'alt_zu2', name: 'Puderzucker 500 g',       detail: 'Zum Bestäuben',  prices: { aldi: 0.69, lidl: 0.75, rewe: 0.99, edeka: 1.19 } },
    ],
  },
  {
    id: 'salz', name: 'Jodsalz', detail: '500-g-Packung', category: '🧂 Gewürze',
    prices:     { aldi: 0.29, lidl: 0.32, rewe: 0.45, edeka: 0.59 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_sl1', name: 'Meersalz 500 g',         detail: 'Weniger verarbeitet', prices: { aldi: 0.59, lidl: 0.65, rewe: 0.89, edeka: 1.09 } },
      { id: 'alt_sl2', name: 'Himalayasalz 500 g',     detail: 'Rosa & unraffiniert', prices: { aldi: 0.99, lidl: 1.05, rewe: 1.39, edeka: 1.79 } },
    ],
  },
  {
    id: 'pfeffer', name: 'Pfeffer schwarz gemahlen', detail: '50-g-Packung', category: '🧂 Gewürze',
    prices:     { aldi: 0.99, lidl: 1.05, rewe: 1.39, edeka: 1.79 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_pf1', name: 'Pfeffermühle Körner 50 g', detail: 'Frisch gemahlen', prices: { aldi: 1.29, lidl: 1.35, rewe: 1.79, edeka: 2.19 } },
    ],
  },
  {
    id: 'paprikapulver', name: 'Paprikapulver edelsüß', detail: '50-g-Dose', category: '🧂 Gewürze',
    prices:     { aldi: 0.69, lidl: 0.75, rewe: 0.99, edeka: 1.29 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_pk1', name: 'Paprikapulver scharf 50 g', detail: 'Mehr Schärfe',  prices: { aldi: 0.69, lidl: 0.75, rewe: 0.99, edeka: 1.29 } },
      { id: 'alt_pk2', name: 'Kurkuma gemahlen 50 g',     detail: 'Entzündungshemmend', prices: { aldi: 0.99, lidl: 1.05, rewe: 1.35, edeka: 1.65 } },
    ],
  },

  /* ── SÜSSES & SNACKS ── */
  {
    id: 'schokolade', name: 'Vollmilchschokolade', detail: '100-g-Tafel', category: '🍫 Süßes & Snacks',
    prices:     { aldi: 0.55, lidl: 0.59, rewe: 0.89, edeka: 1.09 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: 0.79 },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: 'Schoki-Deal −0,30 €' },
    alternatives: [
      { id: 'alt_sc1', name: 'Zartbitterschokolade 70% 100 g', detail: 'Antioxidantien-reich', prices: { aldi: 0.65, lidl: 0.69, rewe: 0.99, edeka: 1.29 } },
      { id: 'alt_sc2', name: 'Weiße Schokolade 100 g',          detail: 'Süß & cremig',         prices: { aldi: 0.59, lidl: 0.65, rewe: 0.95, edeka: 1.15 } },
    ],
  },
  {
    id: 'chips', name: 'Kartoffelchips gesalzen', detail: '175-g-Tüte', category: '🥔 Süßes & Snacks',
    prices:     { aldi: 0.99, lidl: 1.05, rewe: 1.59, edeka: 1.89 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_cp1', name: 'Chips Paprika 175 g',    detail: 'Würziger Geschmack', prices: { aldi: 0.99, lidl: 1.05, rewe: 1.59, edeka: 1.89 } },
      { id: 'alt_cp2', name: 'Popcorn gesalzen 100 g', detail: 'Leichter',            prices: { aldi: 0.79, lidl: 0.85, rewe: 1.09, edeka: 1.39 } },
    ],
  },
  {
    id: 'kekse', name: 'Butterkekse', detail: '400-g-Packung', category: '🍪 Süßes & Snacks',
    prices:     { aldi: 0.79, lidl: 0.85, rewe: 1.19, edeka: 1.49 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_kk1', name: 'Vollkornkekse 400 g',    detail: 'Mehr Ballaststoffe',  prices: { aldi: 0.99, lidl: 1.05, rewe: 1.39, edeka: 1.69 } },
      { id: 'alt_kk2', name: 'Reiswaffeln 100 g',       detail: 'Leicht & knusprig',   prices: { aldi: 0.69, lidl: 0.75, rewe: 0.99, edeka: 1.19 } },
    ],
  },

  /* ── GETRÄNKE ── */
  {
    id: 'mineralwasser', name: 'Mineralwasser still', detail: '1,5-L-Flasche', category: '💧 Getränke',
    prices:     { aldi: 0.25, lidl: 0.25, rewe: 0.29, edeka: 0.35 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_mw1', name: 'Mineralwasser sprudelnd 1,5 L', detail: 'Mit Kohlensäure',  prices: { aldi: 0.25, lidl: 0.25, rewe: 0.29, edeka: 0.35 } },
      { id: 'alt_mw2', name: 'Mineralwasser 6×1,5 L',         detail: 'Großpackung',        prices: { aldi: 1.29, lidl: 1.29, rewe: 1.69, edeka: 1.99 } },
    ],
  },
  {
    id: 'apfelsaft', name: 'Apfelsaft naturtrüb', detail: '1-L-Packung', category: '🧃 Getränke',
    prices:     { aldi: 0.79, lidl: 0.85, rewe: 1.19, edeka: 1.49 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_aj1', name: 'Orangensaft 100% 1 L',           detail: 'Fruchtig & vitaminreich', prices: { aldi: 0.99, lidl: 1.05, rewe: 1.39, edeka: 1.79 } },
      { id: 'alt_aj2', name: 'Multivitaminsaft 1 L',           detail: 'Viele Vitamine',          prices: { aldi: 0.99, lidl: 1.05, rewe: 1.39, edeka: 1.79 } },
    ],
  },
  {
    id: 'kaffee', name: 'Röstkaffee gemahlen', detail: '500-g-Packung', category: '☕ Getränke',
    prices:     { aldi: 4.49, lidl: 4.79, rewe: 5.99, edeka: 7.29 },
    salePrices: { aldi: 3.79, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: 'Kaffeeangebot −0,70 €', lidl: null, rewe: null, edeka: null },
    alternatives: [
      { id: 'alt_ka1', name: 'Kaffeepads 18er-Packung',    detail: 'Für Pad-Maschinen',     prices: { aldi: 2.49, lidl: 2.59, rewe: 3.49, edeka: 4.29 } },
      { id: 'alt_ka2', name: 'Instantkaffee 200 g',        detail: 'Schnell & praktisch',   prices: { aldi: 2.99, lidl: 3.19, rewe: 3.99, edeka: 4.79 } },
      { id: 'alt_ka3', name: 'Bio-Kaffee gemahlen 500 g',  detail: 'Fair Trade & bio',       prices: { aldi: 5.99, lidl: 6.29, rewe: 7.99, edeka: 9.49 } },
    ],
  },
  {
    id: 'tee', name: 'Schwarztee', detail: '25 Beutel', category: '🫖 Getränke',
    prices:     { aldi: 0.99, lidl: 1.09, rewe: 1.49, edeka: 1.89 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_te1', name: 'Grüntee 25 Beutel',       detail: 'Antioxidantien-reich', prices: { aldi: 1.09, lidl: 1.15, rewe: 1.59, edeka: 1.99 } },
      { id: 'alt_te2', name: 'Kamillentee 20 Beutel',   detail: 'Beruhigend',           prices: { aldi: 0.79, lidl: 0.85, rewe: 1.09, edeka: 1.39 } },
    ],
  },

  /* ── TIEFKÜHLPRODUKTE ── */
  {
    id: 'erbsen_tk', name: 'TK-Erbsen', detail: '750-g-Beutel', category: '🧊 Tiefkühl',
    prices:     { aldi: 1.09, lidl: 1.15, rewe: 1.49, edeka: 1.79 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_tk1', name: 'TK-Erbsen & Möhren 750 g', detail: 'Mix',               prices: { aldi: 1.09, lidl: 1.15, rewe: 1.45, edeka: 1.75 } },
      { id: 'alt_tk2', name: 'TK-Blattspinat 750 g',     detail: 'Immer verfügbar',   prices: { aldi: 1.09, lidl: 1.15, rewe: 1.45, edeka: 1.75 } },
    ],
  },
  {
    id: 'pommes_tk', name: 'Pommes frites TK', detail: '750-g-Beutel', category: '🧊 Tiefkühl',
    prices:     { aldi: 1.29, lidl: 1.35, rewe: 1.79, edeka: 2.09 },
    salePrices: { aldi: null, lidl: null, rewe: null,  edeka: null },
    sales:      { aldi: null, lidl: null, rewe: null,  edeka: null },
    alternatives: [
      { id: 'alt_pm1', name: 'Backofen-Pommes TK 750 g',  detail: 'Weniger Fett',     prices: { aldi: 1.39, lidl: 1.45, rewe: 1.89, edeka: 2.19 } },
      { id: 'alt_pm2', name: 'Süßkartoffel-Pommes 600 g', detail: 'Gesündere Variante', prices: { aldi: 1.79, lidl: 1.89, rewe: 2.39, edeka: 2.79 } },
    ],
  },
];
