export const avgPrice = (item) => {
  const vals = Object.values(item.prices || {}).filter((v) => v != null);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
};

export const effectivePrice = (item, catalogId) => {
  const sp = item.salePrices?.[catalogId];
  const rp = item.prices?.[catalogId];
  return sp != null ? sp : rp != null ? rp : null;
};

export const bestEffectivePrice = (item, stores) => {
  if (!stores.length) return avgPrice(item);
  const vals = stores
    .map((s) => effectivePrice(item, s.catalogId || s.id))
    .filter((v) => v != null);
  return vals.length ? Math.min(...vals) : avgPrice(item);
};

export const fmt = (n) =>
  n == null ? '—' : '€' + Number(n).toFixed(2).replace('.', ',');

export const travel = (km, mode) => {
  const speeds = { car: 2, transit: 4, bike: 5, walk: 13 };
  return Math.ceil(km * (speeds[mode] || 2));
};
