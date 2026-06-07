import { I } from '../utils/icons.jsx';
import { fmt, bestEffectivePrice, effectivePrice, avgPrice } from '../utils/helpers.js';

function ListRow({ item, visibleStores, onRemove, onSwap }) {
  const bestPrice = bestEffectivePrice(item, visibleStores);
  const regularPrice = visibleStores.length
    ? Math.min(...visibleStores.map((s) => item.prices?.[s.catalogId || s.id]).filter((v) => v != null))
    : avgPrice(item);

  const saleEntries = visibleStores
    .filter((s) => item.sales?.[s.catalogId || s.id])
    .map((s) => ({
      store: s,
      label: item.sales[s.catalogId || s.id],
      salePrice: item.salePrices?.[s.catalogId || s.id],
    }));

  const hasSale = saleEntries.length > 0;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 transition-all hover:bg-gray-50/70 ${hasSale ? 'sale-row' : ''}`}>
      {hasSale && <div className="w-1 self-stretch rounded-full bg-red-400 shrink-0" style={{ minHeight: '36px' }} />}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-semibold text-gray-800">{item.name}</span>
          {saleEntries.map((e, i) => (
            <span key={i} className="sale-badge inline-flex items-center gap-1 text-xs bg-red-500 text-white px-2 py-0.5 rounded-lg font-extrabold shadow-sm">
              <I.Percent size={9} color="white" /> {e.label}
              {e.salePrice != null && <span className="opacity-75">@ {e.store.name}</span>}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400">{item.detail}</span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400">{item.category}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {visibleStores.length > 0 && (
          <div className="text-right min-w-[60px]">
            {hasSale && bestPrice < regularPrice ? (
              <div>
                <del className="text-xs text-gray-400">{fmt(regularPrice)}</del>
                <div className="text-sm font-extrabold text-red-600">{fmt(bestPrice)}</div>
              </div>
            ) : (
              <span className="text-sm font-extrabold text-emerald-600">{fmt(bestPrice)}</span>
            )}
          </div>
        )}
        <button
          onClick={onSwap}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-600 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
        >
          <I.Swap size={11} /><span className="hidden sm:inline">Tauschen</span>
        </button>
        <button
          onClick={onRemove}
          className="w-7 h-7 flex items-center justify-center bg-red-50 hover:bg-red-100 border border-red-200 text-red-400 hover:text-red-600 rounded-xl transition-all hover:scale-105 active:scale-95"
        >
          <I.Trash size={12} />
        </button>
      </div>
    </div>
  );
}

export default function ListPanel({ list, visibleStores, listOpen, setListOpen, removeItem, setSwapTarget }) {
  const totalSaleItems = list.filter((item) =>
    visibleStores.some((s) => item.sales?.[s.catalogId || s.id])
  ).length;

  return (
    <div className="card overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setListOpen((o) => !o)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
            <I.Grid size={13} color="#10b981" />
          </div>
          <h2 className="font-bold text-gray-800 text-sm">Meine Liste</h2>
          <span className="bg-emerald-500 text-white text-xs font-extrabold px-2 py-0.5 rounded-full leading-none">
            {list.length}
          </span>
          {totalSaleItems > 0 && (
            <span className="sale-badge flex items-center gap-1 bg-red-500 text-white text-xs font-extrabold px-2 py-0.5 rounded-full leading-none">
              <I.Percent size={10} color="white" /> {totalSaleItems} im Angebot
            </span>
          )}
        </div>
        {listOpen ? <I.ChevUp size={16} color="#9ca3af" /> : <I.ChevDown size={16} color="#9ca3af" />}
      </div>

      {listOpen && (
        <div className="border-t border-gray-50">
          <div className="grid px-4 py-2 bg-gray-50/70" style={{ gridTemplateColumns: '1fr auto' }}>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Produkt</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider text-right pr-16">Bester Preis</span>
          </div>
          <div className="divide-y divide-gray-50 max-h-[420px] overflow-y-auto">
            {list.map((item) => (
              <ListRow
                key={item.id}
                item={item}
                visibleStores={visibleStores}
                onRemove={() => removeItem(item.id)}
                onSwap={() => setSwapTarget(item.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
