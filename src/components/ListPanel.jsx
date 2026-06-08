import { I } from '../utils/icons.jsx';
import { fmt, bestEffectivePrice, effectivePrice, avgPrice } from '../utils/helpers.js';

function ListRow({ item, visibleStores, onRemove, onSwap }) {
  const bestPrice    = bestEffectivePrice(item, visibleStores);
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
    <div className={`flex items-center gap-3 px-4 py-3 transition-all ${hasSale ? 'sale-row' : ''}`}
      style={{ ':hover': { background: '#F9F9F9' } }}>
      {hasSale && (
        <div className="w-[3px] self-stretch rounded-full shrink-0" style={{ background: '#FF3B30', minHeight: '36px' }} />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[14px] font-[600]" style={{ color: '#1D1D1F' }}>{item.name}</span>
          {saleEntries.map((e, i) => (
            <span key={i} className="sale-badge inline-flex items-center gap-1 text-[10px] font-[700] px-2 py-0.5 rounded-[7px]"
              style={{ background: '#FF3B30', color: '#fff' }}>
              <I.Percent size={8} color="white" /> {e.label}
              {e.salePrice != null && <span style={{ opacity: 0.7 }}>@ {e.store.name}</span>}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[12px]" style={{ color: '#AEAEB2' }}>{item.detail}</span>
          <span style={{ color: '#D1D1D6' }}>·</span>
          <span className="text-[12px]" style={{ color: '#AEAEB2' }}>{item.category}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {visibleStores.length > 0 && (
          <div className="text-right min-w-[60px]">
            {hasSale && bestPrice < regularPrice ? (
              <div>
                <del className="text-[11px]">{fmt(regularPrice)}</del>
                <div className="text-[14px] font-[800]" style={{ color: '#FF3B30', fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(bestPrice)}
                </div>
              </div>
            ) : (
              <span className="text-[14px] font-[800]" style={{ color: '#30D158', fontVariantNumeric: 'tabular-nums' }}>
                {fmt(bestPrice)}
              </span>
            )}
          </div>
        )}
        <button onClick={onSwap}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] text-[11px] font-[700] transition-all hover:scale-105 active:scale-95"
          style={{ background: 'rgba(88,86,214,0.08)', color: '#5856D6', border: '0.5px solid rgba(88,86,214,0.2)' }}>
          <I.Swap size={10} /><span className="hidden sm:inline">Tauschen</span>
        </button>
        <button onClick={onRemove}
          className="w-7 h-7 flex items-center justify-center rounded-[10px] transition-all hover:scale-105 active:scale-95"
          style={{ background: 'rgba(255,59,48,0.06)', color: '#FF3B30', border: '0.5px solid rgba(255,59,48,0.15)' }}>
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
      <div className="flex items-center justify-between px-5 py-4 cursor-pointer transition-colors"
        style={{ ':hover': { background: 'rgba(0,0,0,0.02)' } }}
        onClick={() => setListOpen((o) => !o)}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[9px] flex items-center justify-center"
            style={{ background: 'rgba(48,209,88,0.1)' }}>
            <I.Grid size={12} color="#30D158" />
          </div>
          <h2 className="text-[14px] font-[700]" style={{ color: '#1D1D1F' }}>Meine Liste</h2>
          <span className="text-[11px] font-[800] px-2 py-0.5 rounded-[980px] leading-none"
            style={{ background: '#30D158', color: '#fff' }}>
            {list.length}
          </span>
          {totalSaleItems > 0 && (
            <span className="sale-badge flex items-center gap-1 text-[11px] font-[700] px-2 py-0.5 rounded-[980px] leading-none"
              style={{ background: '#FF3B30', color: '#fff' }}>
              <I.Percent size={9} color="white" /> {totalSaleItems} im Angebot
            </span>
          )}
        </div>
        {listOpen ? <I.ChevUp size={15} color="#AEAEB2" /> : <I.ChevDown size={15} color="#AEAEB2" />}
      </div>

      {listOpen && (
        <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
          <div className="grid px-4 py-2" style={{ gridTemplateColumns: '1fr auto', background: '#F9F9F9' }}>
            <span className="text-[11px] font-[700] uppercase tracking-wider" style={{ color: '#AEAEB2' }}>Produkt</span>
            <span className="text-[11px] font-[700] uppercase tracking-wider text-right pr-16" style={{ color: '#AEAEB2' }}>Bester Preis</span>
          </div>
          <div className="max-h-[420px] overflow-y-auto" style={{ divide: '0.5px solid rgba(0,0,0,0.04)' }}>
            {list.map((item, i) => (
              <div key={item.id} style={i > 0 ? { borderTop: '0.5px solid rgba(0,0,0,0.04)' } : {}}>
                <ListRow
                  item={item}
                  visibleStores={visibleStores}
                  onRemove={() => removeItem(item.id)}
                  onSwap={() => setSwapTarget(item.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
