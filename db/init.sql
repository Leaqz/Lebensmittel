-- GroceryGenius — MariaDB Schema & Seed Data
-- Encoding: UTF-8

CREATE DATABASE IF NOT EXISTS grocerygenius CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE grocerygenius;

-- ── SUPERMARKETS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS supermarkets (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  catalog_id VARCHAR(20)  NOT NULL UNIQUE,   -- matches JS catalogId ('aldi','lidl','rewe','edeka')
  name       VARCHAR(100) NOT NULL,
  website    VARCHAR(255),
  logo_url   VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── CATEGORIES ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100) NOT NULL UNIQUE,
  emoji     VARCHAR(10)  DEFAULT ''
);

-- ── ITEMS (crawled products) ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS items (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  supermarket_id INT          NOT NULL,
  category_id    INT,
  name           VARCHAR(255) NOT NULL,
  brand          VARCHAR(100),
  detail         VARCHAR(255),             -- e.g. '500-g-Packung'
  unit           VARCHAR(20),              -- 'g','kg','ml','L','Stück'
  unit_size      DECIMAL(10,3),            -- numeric amount matching unit
  image_url      VARCHAR(500),
  external_id    VARCHAR(255),             -- supermarket's own product ID
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supermarket_id) REFERENCES supermarkets(id),
  FOREIGN KEY (category_id)    REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_supermarket_name (supermarket_id, name(100)),
  INDEX idx_name (name(100))
);

-- ── PRICES (one row per crawl; latest = current price) ──────────────────────
CREATE TABLE IF NOT EXISTS prices (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  item_id       INT           NOT NULL,
  price         DECIMAL(10,2) NOT NULL,
  price_per_kg  DECIMAL(10,4),             -- normalised €/kg or €/L
  is_sale       BOOLEAN       DEFAULT FALSE,
  sale_label    VARCHAR(255),
  crawled_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  INDEX idx_item_crawled (item_id, crawled_at DESC)
);

-- ── CRAWL CONFIG (one row per supermarket) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS crawl_config (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  supermarket_id INT     NOT NULL UNIQUE,
  is_enabled     BOOLEAN DEFAULT TRUE,
  run_once       BOOLEAN DEFAULT TRUE,   -- FALSE = re-crawl on every trigger
  max_items      INT     DEFAULT 500,
  delay_ms       INT     DEFAULT 1200,   -- polite delay between requests
  FOREIGN KEY (supermarket_id) REFERENCES supermarkets(id)
);

-- ── CRAWL HISTORY (audit log) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS crawl_history (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  supermarket_id INT NOT NULL,
  started_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  finished_at    TIMESTAMP,
  items_crawled  INT DEFAULT 0,
  status         ENUM('running','success','failed','skipped') DEFAULT 'running',
  error_message  TEXT,
  FOREIGN KEY (supermarket_id) REFERENCES supermarkets(id),
  INDEX idx_sm_status (supermarket_id, status, finished_at DESC)
);

-- ── MEALS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS meals (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(255) NOT NULL,
  name_de          VARCHAR(255),
  description      TEXT,
  cuisine          VARCHAR(100),
  prep_time_min    INT,
  cook_time_min    INT,
  default_servings INT     DEFAULT 4,
  tags             VARCHAR(500),           -- comma-separated
  image_emoji      VARCHAR(10) DEFAULT '🍽️',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── MEAL INGREDIENTS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS meal_ingredients (
  id               INT          AUTO_INCREMENT PRIMARY KEY,
  meal_id          INT          NOT NULL,
  name             VARCHAR(255) NOT NULL,  -- display name, e.g. 'Rinderhackfleisch'
  quantity         DECIMAL(10,3) NOT NULL,
  unit             VARCHAR(30)  NOT NULL,  -- 'g','kg','ml','L','Stück','EL','TL'
  notes            VARCHAR(255),           -- e.g. 'frisch gemahlen'
  catalog_item_ids VARCHAR(500),           -- comma-sep catalog JS ids for price lookup
  is_optional      BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE
);

-- ════════════════════════════════════════════════════════════════════════════
-- SEED DATA
-- ════════════════════════════════════════════════════════════════════════════

-- Supermarkets
INSERT INTO supermarkets (catalog_id, name, website) VALUES
  ('aldi',  'Aldi Süd', 'https://www.aldi-sued.de'),
  ('lidl',  'Lidl',     'https://www.lidl.de'),
  ('rewe',  'REWE',     'https://www.rewe.de'),
  ('edeka', 'EDEKA',    'https://www.edeka.de');

-- Categories
INSERT INTO categories (name, emoji) VALUES
  ('Milchprodukte',  '🥛'),
  ('Käse',           '🧀'),
  ('Eier',           '🥚'),
  ('Backwaren',      '🍞'),
  ('Fleisch',        '🥩'),
  ('Fisch',          '🐟'),
  ('Gemüse',         '🥦'),
  ('Obst',           '🍎'),
  ('Nudeln & Reis',  '🍝'),
  ('Frühstück',      '🌾'),
  ('Konserven',      '🥫'),
  ('Öle & Saucen',   '🫙'),
  ('Backen & Gewürze','🧂'),
  ('Süßes & Snacks', '🍫'),
  ('Getränke',       '💧'),
  ('Tiefkühl',       '🧊');

-- Crawl config: enabled + run_once = TRUE for all stores
INSERT INTO crawl_config (supermarket_id, is_enabled, run_once, max_items, delay_ms)
SELECT id, TRUE, TRUE, 500, 1200 FROM supermarkets;

-- ── MEALS ───────────────────────────────────────────────────────────────────
INSERT INTO meals (name, name_de, description, cuisine, prep_time_min, cook_time_min, default_servings, tags, image_emoji) VALUES
(
  'Spaghetti Bolognese',
  'Spaghetti Bolognese',
  'Klassische Bolognese-Sauce aus Rinderhackfleisch mit Tomaten und frischen Kräutern — ein Familienklassiker.',
  'Italienisch', 10, 30, 4, 'pasta,klassiker,fleisch', '🍝'
),
(
  'Hähnchen-Curry mit Reis',
  'Hähnchen-Curry',
  'Zartes Hähnchenfilet in cremiger Kokosmilch-Curry-Sauce mit Paprika und Zwiebeln auf Basmati-Reis.',
  'Asiatisch', 15, 25, 4, 'curry,hähnchen,reis,scharf', '🍛'
),
(
  'Kartoffelsuppe',
  'Kartoffelsuppe',
  'Herzhafte deutsche Kartoffelsuppe mit Lauch, Möhren und einem Schuss Sahne. Wärmt von innen.',
  'Deutsch', 15, 30, 4, 'suppe,gemüse,vegetarisch,günstig', '🍲'
),
(
  'Schnitzel mit Bratkartoffeln',
  'Schnitzel mit Bratkartoffeln',
  'Knuspriges Schweineschnitzel, paniert und goldbraun gebraten — dazu knackige Bratkartoffeln.',
  'Deutsch', 20, 20, 4, 'schnitzel,kartoffeln,klassiker,fleisch', '🥩'
),
(
  'Pfannkuchen',
  'Pfannkuchen',
  'Fluffige Pfannkuchen aus Mehl, Milch und Eiern — perfekt zum Frühstück oder als süßes Abendessen.',
  'International', 5, 20, 4, 'pfannkuchen,frühstück,süß,vegetarisch,günstig', '🥞'
),
(
  'Gemüsepfanne mit Reis',
  'Bunte Gemüsepfanne',
  'Schnelle Gemüsepfanne mit Zucchini, Paprika und Champignons auf fluffigem Basmati-Reis.',
  'Vegetarisch', 10, 20, 4, 'gemüse,vegetarisch,vegan,schnell,reis', '🥘'
),
(
  'Pizza Margherita',
  'Pizza Margherita',
  'Klassische Pizza mit Tomatensauce, frischem Mozzarella und einem Schuss Olivenöl.',
  'Italienisch', 15, 15, 4, 'pizza,vegetarisch,klassiker', '🍕'
),
(
  'Rührei mit Toast',
  'Rührei mit Toast',
  'Cremiges Rührei aus Freilandeiern auf knusprig getoastetem Toastbrot — das perfekte schnelle Frühstück.',
  'International', 5, 10, 2, 'frühstück,eier,schnell,vegetarisch,günstig', '🍳'
),
(
  'Lachsfilet mit Kartoffeln',
  'Lachsfilet mit Kartoffeln',
  'Saftige Lachsfilets auf Babyspinat mit Zitronenbutter-Sauce und Salzkartoffeln.',
  'International', 10, 20, 4, 'fisch,lachs,kartoffeln,gesund', '🐟'
),
(
  'Gulasch mit Nudeln',
  'Gulasch',
  'Würziges Paprika-Gulasch aus Schweinefleisch, langsam geschmort — serviert mit Penne.',
  'Ungarisch/Deutsch', 15, 60, 4, 'gulasch,nudeln,fleisch,herzhaft', '🍲'
),
(
  'Caesar Salad mit Hähnchen',
  'Caesar Salad',
  'Knackiger Eisbergsalat mit gegrillter Hähnchenbrust, Parmesan und cremigem Caesar-Dressing.',
  'International', 15, 15, 4, 'salat,hähnchen,gesund,low-carb', '🥗'
),
(
  'Hähnchen mit Brokkoli',
  'Hähnchen-Brokkoli-Pfanne',
  'Gebratenes Hähnchenfilet mit knackigem Brokkoli und Knoblauch auf Reis — einfach und proteinreich.',
  'International', 10, 20, 4, 'hähnchen,gemüse,gesund,protein,reis', '🥦'
);

-- ── MEAL INGREDIENTS ────────────────────────────────────────────────────────
-- Meal 1: Spaghetti Bolognese (default 4 Portionen)
INSERT INTO meal_ingredients (meal_id, name, quantity, unit, notes, catalog_item_ids) VALUES
(1, 'Rinderhackfleisch',   500, 'g',    NULL,              'hackfleisch'),
(1, 'Spaghetti',           400, 'g',    NULL,              'spaghetti'),
(1, 'Tomaten (Dose)',       400, 'g',    'geschält',        'tomaten_dose,gehaeckte_tomaten'),
(1, 'Zwiebeln',              2, 'Stück', NULL,              'zwiebeln'),
(1, 'Knoblauch',             3, 'Zehen', NULL,              'knoblauch'),
(1, 'Olivenöl',              3, 'EL',   NULL,              'olivenoel'),
(1, 'Paprikapulver',         1, 'TL',   'edelsüß',         'paprikapulver');

-- Meal 2: Hähnchen-Curry (default 4 Portionen)
INSERT INTO meal_ingredients (meal_id, name, quantity, unit, notes, catalog_item_ids) VALUES
(2, 'Hähnchenbrust',       600, 'g',    'in Würfel',       'haehnchen'),
(2, 'Basmati-Reis',        300, 'g',    NULL,              'reis'),
(2, 'Paprika',               2, 'Stück', 'rot oder gelb',  'paprika'),
(2, 'Zwiebeln',              2, 'Stück', NULL,             'zwiebeln'),
(2, 'Knoblauch',             2, 'Zehen', NULL,             'knoblauch'),
(2, 'Olivenöl',              2, 'EL',   NULL,              'olivenoel'),
(2, 'Paprikapulver',         2, 'EL',   'Curry-Gewürz',    'paprikapulver');

-- Meal 3: Kartoffelsuppe (default 4 Portionen)
INSERT INTO meal_ingredients (meal_id, name, quantity, unit, notes, catalog_item_ids) VALUES
(3, 'Kartoffeln',           800, 'g',    'mehlig',          'kartoffeln'),
(3, 'Karotten',             200, 'g',    NULL,              'karotten'),
(3, 'Zwiebeln',               1, 'Stück', NULL,             'zwiebeln'),
(3, 'Lauch',                  1, 'Stange', NULL,            'lauch'),
(3, 'Schlagsahne',          100, 'ml',   NULL,              'schlagsahne'),
(3, 'Olivenöl',               2, 'EL',   NULL,              'olivenoel');

-- Meal 4: Schnitzel mit Bratkartoffeln (default 4 Portionen)
INSERT INTO meal_ingredients (meal_id, name, quantity, unit, notes, catalog_item_ids) VALUES
(4, 'Schweineschnitzel',    600, 'g',    'klopfen',         'schweineschnitzel'),
(4, 'Kartoffeln',           800, 'g',    'festkochend',     'kartoffeln'),
(4, 'Eier',                   2, 'Stück', 'zum Panieren',   'eier'),
(4, 'Zitronen',               1, 'Stück', 'zum Garnieren',  'zitronen'),
(4, 'Olivenöl',               3, 'EL',   'zum Braten',      'olivenoel');

-- Meal 5: Pfannkuchen (default 4 Portionen)
INSERT INTO meal_ingredients (meal_id, name, quantity, unit, notes, catalog_item_ids) VALUES
(5, 'Weizenmehl',           250, 'g',    'Type 405',        'mehl'),
(5, 'Milch',                500, 'ml',   NULL,              'milch'),
(5, 'Eier',                   3, 'Stück', NULL,             'eier'),
(5, 'Butter',                30, 'g',    'zum Braten',      'butter'),
(5, 'Zucker',                 2, 'EL',   'optional',        'zucker');

-- Meal 6: Gemüsepfanne mit Reis (default 4 Portionen)
INSERT INTO meal_ingredients (meal_id, name, quantity, unit, notes, catalog_item_ids) VALUES
(6, 'Basmati-Reis',         300, 'g',    NULL,              'reis'),
(6, 'Zucchini',               1, 'Stück', NULL,             'zucchini'),
(6, 'Paprika',                1, 'Stück', 'beliebige Farbe','paprika'),
(6, 'Champignons',          250, 'g',    NULL,              'champignons'),
(6, 'Zwiebeln',               1, 'Stück', NULL,             'zwiebeln'),
(6, 'Knoblauch',              2, 'Zehen', NULL,             'knoblauch'),
(6, 'Olivenöl',               2, 'EL',   NULL,              'olivenoel');

-- Meal 7: Pizza Margherita (default 4 Portionen)
INSERT INTO meal_ingredients (meal_id, name, quantity, unit, notes, catalog_item_ids) VALUES
(7, 'Tomaten (Dose)',        400, 'g',    'passiert',        'tomaten_dose'),
(7, 'Mozzarella',           250, 'g',    '2 Kugeln',        'mozzarella'),
(7, 'Olivenöl',               2, 'EL',   NULL,              'olivenoel'),
(7, 'Weizenmehl',           500, 'g',    'für Teig',        'mehl');

-- Meal 8: Rührei mit Toast (default 2 Portionen)
INSERT INTO meal_ingredients (meal_id, name, quantity, unit, notes, catalog_item_ids) VALUES
(8, 'Eier',                   4, 'Stück', 'Freilandhaltung','eier'),
(8, 'Milch',                 50, 'ml',   NULL,              'milch'),
(8, 'Butter',                15, 'g',    NULL,              'butter'),
(8, 'Toastbrot',              4, 'Scheiben', NULL,          'toastbrot');

-- Meal 9: Lachsfilet mit Kartoffeln (default 4 Portionen)
INSERT INTO meal_ingredients (meal_id, name, quantity, unit, notes, catalog_item_ids) VALUES
(9, 'Lachsfilet',            600, 'g',   NULL,              'lachsfilet'),
(9, 'Kartoffeln',            800, 'g',   'festkochend',     'kartoffeln'),
(9, 'Babyspinat',            150, 'g',   NULL,              'spinat'),
(9, 'Zitronen',                1, 'Stück', NULL,            'zitronen'),
(9, 'Butter',                 30, 'g',   'Zitronenbutter',  'butter');

-- Meal 10: Gulasch mit Nudeln (default 4 Portionen)
INSERT INTO meal_ingredients (meal_id, name, quantity, unit, notes, catalog_item_ids) VALUES
(10, 'Schweineschnitzel',    600, 'g',   'in Würfel',       'schweineschnitzel'),
(10, 'Zwiebeln',               2, 'Stück', NULL,            'zwiebeln'),
(10, 'Paprika',                1, 'Stück', NULL,            'paprika'),
(10, 'Paprikapulver',          2, 'EL',  'edelsüß',         'paprikapulver'),
(10, 'Tomaten (Dose)',        400, 'g',   NULL,              'tomaten_dose'),
(10, 'Penne',                400, 'g',   NULL,              'penne,spaghetti');

-- Meal 11: Caesar Salad (default 4 Portionen)
INSERT INTO meal_ingredients (meal_id, name, quantity, unit, notes, catalog_item_ids) VALUES
(11, 'Hähnchenbrust',        400, 'g',   'gegrillt',        'haehnchen'),
(11, 'Eisbergsalat',           1, 'Kopf', NULL,             'eisbergsalat'),
(11, 'Gouda / Parmesan',      50, 'g',   'gerieben',        'gouda'),
(11, 'Zitronen',               1, 'Stück', NULL,            'zitronen'),
(11, 'Olivenöl',               3, 'EL',  'für Dressing',    'olivenoel');

-- Meal 12: Hähnchen mit Brokkoli (default 4 Portionen)
INSERT INTO meal_ingredients (meal_id, name, quantity, unit, notes, catalog_item_ids) VALUES
(12, 'Hähnchenbrust',        500, 'g',   NULL,              'haehnchen'),
(12, 'Brokkoli',             500, 'g',   NULL,              'brokkoli'),
(12, 'Basmati-Reis',         300, 'g',   NULL,              'reis'),
(12, 'Knoblauch',              2, 'Zehen', NULL,            'knoblauch'),
(12, 'Olivenöl',               2, 'EL',  NULL,              'olivenoel');
