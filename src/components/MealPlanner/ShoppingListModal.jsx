import { useMemo } from "react";
import { CATALOG } from "../../data/catalog.js";
import { fmt, effectivePrice } from "../../utils/helpers.js";
import { I } from "../../utils/icons.jsx";

const STORES = ["aldi", "lidl", "rewe", "edeka"];
const STORE_LABELS = { aldi: "Aldi", lidl: "Lidl", rewe: "REWE", edeka: "EDEKA" };
const STORE_COLORS = {
  aldi:  { bg: "bg-blue-50",   text: "text-blue-700",  border: "border-blue-200"  },
  lidl:  { bg: "bg-red-50",    text: "text-red-700",   border: "border-red-200"   },
  rewe:  { bg: "bg-rose-50",   text: "text-rose-700",  border: "border-rose-200"  },
  edeka: { bg: "bg-yellow-50", text: "text-yellow-800",border: "border-yellow-200"},
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

  // Build enriched list: each ingredient + prices from catalog
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

  // Total per store
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

  // Items to add to main shopping list
  const itemsToAdd = useMemo(() =>
    enriched
      .filter((ing) => ing.catalogItem && !ing.is_optional)
      .map((ing) => ({ ...ing.catalogItem })),
    [enriched]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <span className="text-3xl">{meal.image_emoji}</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-extrabold text-gray-900 text-lg leading-tight truncate">
              {meal.name_de || meal.name}
            </h2>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">
              {meal.cuisine} · {servings} {servings === 1 ? "Person" : "Personen"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* Store totals summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-6 py-3 bg-gray-50 border-b border-gray-100">
          {activeStoreIds.map((sid) => {
            const c = STORE_COLORS[sid] || STORE_COLORS.rewe;
            const isBest = sid === cheapestStoreOverall;
            return (
              <div key={sid} className={`rounded-xl px-3 py-2 border text-center ${c.bg} ${c.border} ${isBest ? "ring-2 ring-emerald-400" : ""}`}>
                {isBest && <div className="text-xs font-extrabold text-emerald-600 mb-0.5">Günstigste</div>}
                <div className={`text-xs font-bold ${c.text}`}>{STORE_LABELS[sid] || sid}</div>
                <div className="text-sm font-extrabold text-gray-800">{fmt(storeTotals[sid])}</div>
              </div>
            );
          })}
        </div>

        {/* Ingredient list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {enriched.map((ing) => (
            <div key={ing.name} className={`px-6 py-3 ${ing.is_optional ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">{ing.name}</span>
                    {ing.is_optional && (
                      <span className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-md">optional</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {fmtQty(ing.quantity, ing.unit)}
                    {ing.notes && <span className="ml-1">· {ing.notes}</span>}
                  </div>
                  {ing.catalogItem && (
                    <div className="text-xs text-gray-500 mt-0.5 italic truncate">{ing.catalogItem.name}</div>
                  )}
                </div>

                {/* Per-store price chips */}
                <div className="flex flex-wrap gap-1 justify-end shrink-0">
                  {activeStoreIds.map((sid) => {
                    const p = ing.pricesPerStore[sid];
                    if (p == null) return (
                      <span key={sid} className="text-xs px-1.5 py-0.5 bg-gray-50 text-gray-300 rounded-lg">—</span>
                    );
                    const isCheapest = p === ing.cheapestPrice;
                    const c = STORE_COLORS[sid] || STORE_COLORS.rewe;
                    return (
                      <span key={sid} className={`text-xs px-2 py-0.5 rounded-lg font-bold border ${c.bg} ${c.text} ${c.border} ${isCheapest ? "ring-1 ring-emerald-400" : ""}`}>
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
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
          <div className="flex-1 text-xs text-gray-400">
            Günstigste Option: <span className="font-extrabold text-gray-700">
              {STORE_LABELS[cheapestStoreOverall] || cheapestStoreOverall}
            </span> für <span className="font-extrabold text-emerald-600">{fmt(storeTotals[cheapestStoreOverall])}</span>
          </div>
          <button
            onClick={() => { onAddAll(itemsToAdd); onClose(); }}
            disabled={!itemsToAdd.length}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-extrabold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-200"
          >
            <I.Cart size={15} color="white" />
            Alle zur Liste
          </button>
        </div>
      </div>
    </div>
  );
}
