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
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
          <I.Store size={15} color="#7c3aed" />
        </div>
        <h2 className="font-bold text-gray-800 text-sm">Preisvergleich</h2>
        {visStoreTotals.length === 0 && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
            Radius erhöhen für mehr Filialen
          </span>
        )}
      </div>

      {visStoreTotals.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-gray-400">
          <I.MapPin size={36} color="#d1d5db" />
          <p className="text-sm font-medium mt-3">Keine Filialen im Umkreis</p>
          <p className="text-xs mt-1">Regler nach rechts verschieben oder Standort ermitteln</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {visStoreTotals.map((store) => {
              const isBest = bestStore?.id === store.id && list.length > 0;
              const mins = travel(store.distance, transport);
              const diff = isBest || !bestStore ? 0 : store.total - bestStore.total;
              return (
                <div
                  key={store.id}
                  className={`relative rounded-2xl border-2 p-4 transition-all ${
                    isBest
                      ? 'border-emerald-400 shadow-lg shadow-emerald-100 scale-[1.03]'
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                  }`}
                  style={isBest ? { background: 'linear-gradient(135deg,#f0fdf4,#fff)' } : { background: '#fafafa' }}
                >
                  {isBest && list.length > 0 && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-emerald-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                      <I.Award size={10} color="white" /> Bestes Angebot
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-9 h-9 ${store.logoCls} rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm`}>
                      {(store.name || '?')[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-gray-800 text-xs truncate">{store.name}</p>
                      <p className="text-xs text-gray-400 truncate leading-none mt-0.5">{store.tagline}</p>
                    </div>
                  </div>

                  <div className={`text-xl font-extrabold ${isBest ? 'text-emerald-600' : 'text-gray-700'}`}>
                    {list.length > 0
                      ? fmt(store.total)
                      : <span className="text-gray-300 text-sm font-medium">Artikel hinzufügen</span>
                    }
                  </div>
                  {list.length > 0 && diff > 0.005 && (
                    <p className="text-xs text-red-400 font-bold mt-0.5">+{fmt(diff)} mehr</p>
                  )}

                  <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <I.MapPin size={10} />{store.distance} km · {mins} min
                    </span>
                    {store.saleCount > 0 && (
                      <span className="sale-badge flex items-center gap-1 bg-red-500 text-white font-extrabold px-1.5 py-0.5 rounded-lg">
                        <I.Percent size={9} color="white" />{store.saleCount}
                      </span>
                    )}
                  </div>

                  {store.address && (
                    <p className="text-xs text-gray-400 mt-1.5 truncate">{store.address}</p>
                  )}
                </div>
              );
            })}
          </div>

          {activeDeals.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center">
                  <I.Fire size={13} color="#ef4444" />
                </div>
                <p className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Angebote dieser Woche</p>
                <span className="sale-badge bg-red-500 text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
                  {activeDeals.length}
                </span>
              </div>
              <div className="space-y-2">
                {activeDeals.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-white border border-red-100 rounded-xl px-3 py-2.5 anim-pop"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className={`w-7 h-7 ${d.store.logoCls} rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0`}>
                      {(d.store.name || '?')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{d.item.name}</p>
                      <p className="text-xs text-gray-400">{d.store.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {d.salePrice != null ? (
                        <div>
                          <del className="text-xs text-gray-400">{fmt(d.regularPrice)}</del>
                          <div className="text-sm font-extrabold text-red-600">{fmt(d.salePrice)}</div>
                        </div>
                      ) : (
                        <span className="text-xs font-extrabold text-red-600 bg-red-100 px-2 py-0.5 rounded-lg">
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
            <div className="border-t border-gray-100 pt-4 text-center text-xs text-gray-400 py-2 flex items-center justify-center gap-1.5">
              <I.Info size={13} color="#9ca3af" /> Keine aktuellen Angebote für deine Artikel in diesem Umkreis
            </div>
          )}
        </>
      )}
    </div>
  );
}
