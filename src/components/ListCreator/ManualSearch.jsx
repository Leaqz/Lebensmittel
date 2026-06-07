import { I } from '../../utils/icons.jsx';
import { fmt } from '../../utils/helpers.js';
import { CATALOG } from '../../data/catalog.js';

export default function ManualSearch({ query, setQuery, dropOpen, setDropOpen, searchRef, searchResults, addItem }) {
  return (
    <div ref={searchRef} className="relative">
      <div
        className={`flex items-center gap-2 border rounded-2xl px-3 py-2.5 transition-all ${
          dropOpen && query
            ? 'border-emerald-400 ring-2 ring-emerald-100 bg-white'
            : 'border-gray-200 bg-gray-50 hover:border-emerald-300'
        }`}
      >
        <I.Search size={15} color="#9ca3af" />
        <input
          type="text"
          placeholder="Produkt suchen… z.B. Milch, Eier, Kaffee"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setDropOpen(true); }}
          onFocus={() => setDropOpen(true)}
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none font-medium"
        />
        {query && (
          <button onClick={() => { setQuery(''); setDropOpen(false); }} className="text-gray-400 hover:text-gray-600">
            <I.X size={14} />
          </button>
        )}
      </div>

      {dropOpen && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-30 anim-slideDown">
          {searchResults.map((item) => {
            const prices = Object.values(item.prices).filter(Boolean);
            const minP = prices.length ? Math.min(...prices) : null;
            const hasDeal = Object.values(item.sales || {}).some(Boolean);
            return (
              <button
                key={item.id}
                onClick={() => addItem(item)}
                className="w-full flex items-center justify-between px-3.5 py-3 hover:bg-emerald-50 transition-colors text-left border-b border-gray-50 last:border-0"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                    {hasDeal && (
                      <span className="sale-badge text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-md font-black">
                        ANGEBOT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{item.detail} · {item.category}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-xs font-bold text-emerald-600">ab {fmt(minP)}</span>
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <I.Plus size={11} color="#10b981" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {dropOpen && query.length > 0 && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-6 text-center z-30 anim-slideDown">
          <p className="text-sm text-gray-400">
            Keine Ergebnisse für „<span className="font-semibold text-gray-600">{query}</span>"
          </p>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-2 text-center">{CATALOG.length} Produkte im Katalog</p>
    </div>
  );
}
