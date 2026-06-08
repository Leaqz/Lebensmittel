import { useMemo } from 'react';
import { I } from '../utils/icons.jsx';
import { fmt, effectivePrice, avgPrice, travel } from '../utils/helpers.js';

export default function StorePanel({ visStoreTotals, bestStore, list, transport, radius }) {
  const activeDeals = useMemo(() =>
    list.flatMap((item) =>
      visStoreTotals
        .filter((s) => item.sales?.[s.catalogId || s.id])
        .map((s) => ({
          item,
          store: s,
          label: item.sales[s.catalogId || s.id],
          regularPrice: item.prices?.[s.catalogId || s.id],
          salePrice: item.salePrices?.[s.catalogId || s.id],
        }))
    ),
    [list, visStoreTotals]
  );

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(88,86,214,0.15)' }}>
          <I.Store size={15} color="#7B78FF" />
        </div>
        <h2 className="text-[15px] font-[700]" style={{ color: '#F5F5F7' }}>Preisvergleich</h2>
        {visStoreTotals.length === 0 && (
          <span className="text-[12px] font-[500] px-2.5 py-1 rounded-full ml-1"
            style={{ background: '#2C2C2E', color: 'rgba(235,235,245,0.6)' }}>
            Radius erhöhen
          </span>
        )}
      </div>

      {visStoreTotals.length === 0 ? (
        <div className="flex flex-col items-center py-12">
          <I.MapPin size={40} color="rgba(235,235,245,0.18)" />
          <p className="text-[14px] font-[500] mt-3" style={{ color: 'rgba(235,235,245,0.6)' }}>Keine Filialen im Umkreis</p>
          <p className="text-[12px] mt-1" style={{ color: 'rgba(235,235,245,0.3)' }}>Regler nach rechts verschieben oder Standort ermitteln</p>
        </div>
      ) : (
        <>
          {/* Store cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {visStoreTotals.map((store) => {
              const isBest = bestStore?.id === store.id && list.length > 0;
              const mins   = travel(store.distance, transport);
              const diff   = isBest || !bestStore ? 0 : store.total - bestStore.total;

              return (
                <div key={store.id} className="relative rounded-[18px] p-4 transition-all duration-200"
                  style={isBest ? {
                    background: 'rgba(48,209,88,0.07)',
                    boxShadow: '0 0 0 1.5px #30D158, 0 8px 32px rgba(48,209,88,0.15)',
                    transform: 'scale(1.025)',
                  } : {
                    background: '#2C2C2E',
                    boxShadow: 'none',
                  }}
                >
                  {isBest && list.length > 0 && (
                    <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-[700] px-2.5 py-1 rounded-[980px] flex items-center gap-1"
                      style={{ background: '#30D158', color: '#000', boxShadow: '0 2px 8px rgba(48,209,88,0.4)' }}>
                      <I.Award size={9} color="#000" /> Beste Wahl
                    </div>
                  )}

                  {/* Store identity */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-9 h-9 ${store.logoCls} rounded-[10px] flex items-center justify-center text-white font-[800] text-[13px]`}
                      style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
                      {(store.name || '?')[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-[700] truncate" style={{ color: '#F5F5F7' }}>{store.name}</p>
                      <p className="text-[11px] truncate leading-none mt-0.5" style={{ color: 'rgba(235,235,245,0.3)' }}>{store.tagline}</p>
                    </div>
                  </div>

                  {/* Price — big and bold */}
                  <div className="font-[800] tracking-[-0.03em] leading-none"
                    style={{ fontSize: '26px', color: isBest ? '#30D158' : '#F5F5F7', fontVariantNumeric: 'tabular-nums' }}>
                    {list.length > 0
                      ? fmt(store.total)
                      : <span className="text-[13px] font-[400]" style={{ color: 'rgba(235,235,245,0.18)' }}>Artikel hinzufügen</span>
                    }
                  </div>
                  {list.length > 0 && diff > 0.005 && (
                    <p className="text-[11px] font-[600] mt-1" style={{ color: '#FF453A' }}>+{fmt(diff)}</p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 text-[11px]" style={{ color: 'rgba(235,235,245,0.3)' }}>
                    <span className="flex items-center gap-1">
                      <I.MapPin size={9} />{store.distance} km · {mins} min
                    </span>
                    {store.saleCount > 0 && (
                      <span className="sale-badge flex items-center gap-1 text-[10px] font-[700] px-1.5 py-0.5 rounded-[6px]"
                        style={{ background: '#FF453A', color: '#fff' }}>
                        <I.Percent size={8} color="white" />{store.saleCount}
                      </span>
                    )}
                  </div>

                  {store.address && (
                    <p className="text-[11px] mt-1.5 truncate" style={{ color: 'rgba(235,235,245,0.3)' }}>{store.address}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active deals */}
          {activeDeals.length > 0 && (
            <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-[8px] flex items-center justify-center"
                  style={{ background: 'rgba(255,69,58,0.12)' }}>
                  <I.Fire size={12} color="#FF453A" />
                </div>
                <p className="text-[12px] font-[700] uppercase tracking-wider" style={{ color: '#F5F5F7' }}>
                  Angebote dieser Woche
                </p>
                <span className="sale-badge text-[11px] font-[700] px-2 py-0.5 rounded-[980px]"
                  style={{ background: '#FF453A', color: '#fff' }}>
                  {activeDeals.length}
                </span>
              </div>
              <div className="space-y-2">
                {activeDeals.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-[14px] px-3 py-2.5 anim-pop"
                    style={{
                      background: 'rgba(255,69,58,0.08)',
                      border: '0.5px solid rgba(255,69,58,0.18)',
                      animationDelay: `${i * 45}ms`,
                    }}>
                    <div className={`w-7 h-7 ${d.store.logoCls} rounded-[8px] flex items-center justify-center text-white font-[800] text-[11px] shrink-0`}>
                      {(d.store.name || '?')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-[600] truncate" style={{ color: '#F5F5F7' }}>{d.item.name}</p>
                      <p className="text-[11px]" style={{ color: 'rgba(235,235,245,0.6)' }}>{d.store.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {d.salePrice != null ? (
                        <div>
                          <del className="text-[11px]">{fmt(d.regularPrice)}</del>
                          <div className="text-[14px] font-[800]" style={{ color: '#FF453A' }}>{fmt(d.salePrice)}</div>
                        </div>
                      ) : (
                        <span className="text-[11px] font-[700] px-2 py-0.5 rounded-[8px]"
                          style={{ background: 'rgba(255,69,58,0.12)', color: '#FF453A' }}>
                          {d.label}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {list.length > 0 && activeDeals.length === 0 && (
            <div className="flex items-center justify-center gap-1.5 text-[12px] pt-4"
              style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)', color: 'rgba(235,235,245,0.3)' }}>
              <I.Info size={12} color="rgba(235,235,245,0.3)" /> Keine aktuellen Angebote in diesem Umkreis
            </div>
          )}
        </>
      )}
    </div>
  );
}
