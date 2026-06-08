import { useMemo } from "react";
import { CATALOG } from "../../data/catalog.js";
import { fmt, effectivePrice } from "../../utils/helpers.js";
import { I } from "../../utils/icons.jsx";

const STORES = ["aldi", "lidl", "rewe", "edeka"];
const STORE_LABELS = { aldi: "Aldi", lidl: "Lidl", rewe: "REWE", edeka: "EDEKA" };
const STORE_STYLES = {
  aldi:  { bg: 'rgba(10,132,255,0.12)',  color: '#0A84FF', border: 'rgba(10,132,255,0.28)' },
  lidl:  { bg: 'rgba(255,69,58,0.12)',   color: '#FF453A', border: 'rgba(255,69,58,0.28)'  },
  rewe:  { bg: 'rgba(255,69,58,0.12)',   color: '#FF453A', border: 'rgba(255,69,58,0.28)'  },
  edeka: { bg: 'rgba(255,214,10,0.10)',  color: '#FFD60A', border: 'rgba(255,214,10,0.25)' },
};

function fmtQty(qty, unit) {
  const n = typeof qty === "number" ? qty : parseFloat(qty) || 0;
  const wholeUnits = ["Stück","Zehen","Scheiben","Kopf","Stange","EL","TL"];
  return wholeUnits.includes(unit) ? `${Math.max(1, Math.round(n))} ${unit}` : `${n} ${unit}`;
}

function lookupCatalogItem(catalogItemIds) {
  if (!catalogItemIds || !catalogItemIds.length) return null;
  for (const cid of catalogItemIds) {
    const found = CATALOG.find((p) => p.id === cid);
    if (found) return found;
  }
  return null;
}

export default function ShoppingListModal({ meal, servings, shoppingList, onClose, onAddAll, visibleStores }) {
  const activeStoreIds = useMemo(
    () => (visibleStores && visibleStores.length > 0
      ? visibleStores.map((s) => s.catalogId || s.id)
      : STORES),
    [visibleStores]
  );

  const enriched = useMemo(() => {
    if (!shoppingList) return [];
    return shoppingList.map((ing) => {
      const catalogItem = lookupCatalogItem(ing.catalog_item_ids);
      const pricesPerStore = {};
      activeStoreIds.forEach((sid) => {
        if (catalogItem) {
          pricesPerStore[sid] = effectivePrice(catalogItem, sid) ?? null;
        }
      });
      const validPrices = Object.values(pricesPerStore).filter((v) => v != null);
      const cheapestPrice = validPrices.length ? Math.min(...validPrices) : null;
      const cheapestStore = cheapestPrice != null
        ? activeStoreIds.find((s) => pricesPerStore[s] === cheapestPrice)
        : null;
      return { ...ing, catalogItem, pricesPerStore, cheapestPrice, cheapestStore };
    });
  }, [shoppingList, activeStoreIds]);

  const storeTotals = useMemo(() => {
    const totals = {};
    activeStoreIds.forEach((sid) => { totals[sid] = 0; });
    enriched.forEach((ing) => {
      if (ing.is_optional) return;
      activeStoreIds.forEach((sid) => {
        const p = ing.pricesPerStore[sid];
        if (p != null) totals[sid] += p;
      });
    });
    return totals;
  }, [enriched, activeStoreIds]);

  const cheapestStoreOverall = activeStoreIds.reduce((best, sid) =>
    storeTotals[sid] < (storeTotals[best] ?? Infinity) ? sid : best,
    activeStoreIds[0]
  );

  const itemsToAdd = useMemo(() =>
    enriched
      .filter((ing) => ing.catalogItem && !ing.is_optional)
      .map((ing) => ({ ...ing.catalogItem })),
    [enriched]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(12px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="rounded-[24px] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        style={{ background: '#1C1C1E', boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(255,255,255,0.08)' }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5"
          style={{ borderBottom: '0.5px solid rgba(255,255,255,0.09)' }}>
          <span className="text-3xl">{meal.image_emoji}</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-[800] text-[18px] leading-tight truncate" style={{ color: '#F5F5F7' }}>
              {meal.name_de || meal.name}
            </h2>
            <p className="text-[12px] font-[600] mt-0.5" style={{ color: 'rgba(235,235,245,0.3)' }}>
              {meal.cuisine} · {servings} {servings === 1 ? "Person" : "Personen"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(235,235,245,0.6)' }}
          >
            ✕
          </button>
        </div>

        {/* Store totals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-6 py-3"
          style={{ background: '#0A0A0A', borderBottom: '0.5px solid rgba(255,255,255,0.09)' }}>
          {activeStoreIds.map((sid) => {
            const s = STORE_STYLES[sid] || STORE_STYLES.rewe;
            const isBest = sid === cheapestStoreOverall;
            return (
              <div key={sid} className="rounded-[14px] px-3 py-2.5 text-center transition-all"
                style={{
                  background: s.bg,
                  border: isBest ? `1.5px solid ${s.border}` : `0.5px solid ${s.border}`,
                  boxShadow: isBest ? `0 0 0 2px #30D158` : 'none',
                }}>
                {isBest && (
                  <div className="text-[10px] font-[800] mb-0.5" style={{ color: '#30D158' }}>Günstigste</div>
                )}
                <div className="text-[12px] font-[700]" style={{ color: s.color }}>
                  {STORE_LABELS[sid] || sid}
                </div>
                <div className="text-[15px] font-[800]" style={{ color: '#F5F5F7', fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(storeTotals[sid])}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ingredient list */}
        <div className="flex-1 overflow-y-auto">
          {enriched.map((ing, i) => (
            <div key={ing.name}
              className="px-6 py-3"
              style={{
                opacity: ing.is_optional ? 0.55 : 1,
                borderBottom: i < enriched.length - 1 ? '0.5px solid rgba(255,255,255,0.06)' : 'none',
              }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-[600]" style={{ color: '#F5F5F7' }}>{ing.name}</span>
                    {ing.is_optional && (
                      <span className="text-[11px] font-[500] px-1.5 py-0.5 rounded-[6px]"
                        style={{ background: '#2C2C2E', color: 'rgba(235,235,245,0.3)' }}>optional</span>
                    )}
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: 'rgba(235,235,245,0.3)' }}>
                    {fmtQty(ing.quantity, ing.unit)}
                    {ing.notes && <span className="ml-1">· {ing.notes}</span>}
                  </div>
                  {ing.catalogItem && (
                    <div className="text-[11px] mt-0.5 italic truncate" style={{ color: 'rgba(235,235,245,0.6)' }}>
                      {ing.catalogItem.name}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 justify-end shrink-0">
                  {activeStoreIds.map((sid) => {
                    const p = ing.pricesPerStore[sid];
                    if (p == null) return (
                      <span key={sid} className="text-[11px] px-1.5 py-0.5 rounded-[7px]"
                        style={{ background: '#2C2C2E', color: 'rgba(235,235,245,0.18)' }}>—</span>
                    );
                    const isCheapest = p === ing.cheapestPrice;
                    const s = STORE_STYLES[sid] || STORE_STYLES.rewe;
                    return (
                      <span key={sid}
                        className="text-[11px] px-2 py-0.5 rounded-[7px] font-[700]"
                        style={{
                          background: s.bg,
                          color: s.color,
                          border: isCheapest ? `1.5px solid ${s.border}` : `0.5px solid ${s.border}`,
                          boxShadow: isCheapest ? '0 0 0 1.5px #30D158' : 'none',
                        }}>
                        {fmt(p)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center gap-3"
          style={{ borderTop: '0.5px solid rgba(255,255,255,0.09)' }}>
          <div className="flex-1 text-[12px]" style={{ color: 'rgba(235,235,245,0.3)' }}>
            Günstigste Option:{' '}
            <span className="font-[700]" style={{ color: '#F5F5F7' }}>
              {STORE_LABELS[cheapestStoreOverall] || cheapestStoreOverall}
            </span>{' '}
            für{' '}
            <span className="font-[800]" style={{ color: '#30D158', fontVariantNumeric: 'tabular-nums' }}>
              {fmt(storeTotals[cheapestStoreOverall])}
            </span>
          </div>
          <button
            onClick={() => { onAddAll(itemsToAdd); onClose(); }}
            disabled={!itemsToAdd.length}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[980px] text-[14px] font-[700] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#30D158', color: '#000', boxShadow: '0 4px 16px rgba(48,209,88,0.4)' }}
          >
            <I.Cart size={15} color="#000" />
            Alle zur Liste
          </button>
        </div>
      </div>
    </div>
  );
}
