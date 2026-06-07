import { BRAND_MAPPINGS, STORE_STYLES } from '../data/constants.js';

const OVERPASS_URL = import.meta.env.VITE_OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter';
const OVERPASS_TIMEOUT = Number(import.meta.env.VITE_OVERPASS_TIMEOUT) || 25;

// Haversine-Formel: Abstand in km zwischen zwei GPS-Punkten
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Markenname → bekannter Katalog-Stil
function resolveBrand(rawName) {
  const name = (rawName || '').trim();
  for (const mapping of BRAND_MAPPINGS) {
    if (mapping.match.test(name)) {
      const style = STORE_STYLES[mapping.catalogId];
      return {
        ...style,
        catalogId: mapping.catalogId,
        resolvedName: name + (mapping.displaySuffix || ''),
      };
    }
  }
  // Unbekannter Laden — generisch
  return {
    catalogId: 'edeka',
    resolvedName: name,
    logoCls: 'unknown-logo',
    textCl: 'text-gray-700',
    borderCl: 'border-gray-200',
    bgCl: 'bg-gray-50',
    badgeCl: 'bg-gray-100 text-gray-700',
    accentHex: '#6b7280',
    name,
    tagline: 'Supermarkt',
    emoji: '🛒',
  };
}

// Adresse aus OSM-Tags zusammensetzen
function formatAddress(tags = {}) {
  const parts = [
    tags['addr:street'] && tags['addr:housenumber']
      ? `${tags['addr:street']} ${tags['addr:housenumber']}`
      : tags['addr:street'],
    tags['addr:city'],
  ].filter(Boolean);
  return parts.join(', ') || null;
}

// Overpass API abfragen → echte Filialen in der Nähe
export async function fetchNearbyStores(lat, lon, radiusKm) {
  const radiusM = Math.round(radiusKm * 1000);
  const query = `
[out:json][timeout:${OVERPASS_TIMEOUT}];
(
  node["shop"~"supermarket|discount"](around:${radiusM},${lat},${lon});
  way["shop"~"supermarket|discount"](around:${radiusM},${lat},${lon});
  node["shop"="convenience"]["brand"~"ALDI|Lidl|REWE|Edeka|Penny|Netto|Kaufland",i](around:${radiusM},${lat},${lon});
);
out center;
`.trim();

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) throw new Error(`Overpass API Fehler: ${response.status}`);

  const data = await response.json();

  const rawStores = (data.elements || [])
    .map((el) => {
      const elLat = el.lat ?? el.center?.lat;
      const elLon = el.lon ?? el.center?.lon;
      if (!elLat || !elLon) return null;

      const rawName = el.tags?.name || el.tags?.brand || el.tags?.operator || 'Supermarkt';
      const distance = Math.round(haversineKm(lat, lon, elLat, elLon) * 10) / 10;
      const brand = resolveBrand(rawName);
      const address = formatAddress(el.tags);

      return {
        id: `osm_${el.id}`,
        osmId: el.id,
        catalogId: brand.catalogId,
        name: brand.resolvedName,
        address,
        distance,
        lat: elLat,
        lon: elLon,
        // Visueller Stil aus der bekannten Marke
        logoCls: brand.logoCls,
        textCl: brand.textCl,
        borderCl: brand.borderCl,
        bgCl: brand.bgCl,
        badgeCl: brand.badgeCl,
        accentHex: brand.accentHex,
        tagline: brand.tagline || 'Supermarkt in der Nähe',
        emoji: brand.emoji || '🛒',
      };
    })
    .filter(Boolean);

  // Pro catalogId nur die nächste Filiale behalten
  const closest = {};
  for (const store of rawStores) {
    const existing = closest[store.catalogId];
    if (!existing || store.distance < existing.distance) {
      closest[store.catalogId] = store;
    }
  }

  return Object.values(closest).sort((a, b) => a.distance - b.distance);
}

// GPS-Position des Nutzers abfragen
export function getUserLocation(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation wird von diesem Browser nicht unterstützt.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => {
        const msgs = {
          1: 'Standortzugriff verweigert. Bitte erlaube den Zugriff in den Browser-Einstellungen.',
          2: 'Standort konnte nicht ermittelt werden.',
          3: 'Zeitüberschreitung bei der Standortabfrage.',
        };
        reject(new Error(msgs[err.code] || 'Unbekannter Standortfehler.'));
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false, ...options },
    );
  });
}
