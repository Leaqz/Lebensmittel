import { I } from '../../utils/icons.jsx';
import { fmt } from '../../utils/helpers.js';
import { CATALOG } from '../../data/catalog.js';

export default function ManualSearch({ query, setQuery, dropOpen, setDropOpen, searchRef, searchResults, addItem }) {
  return (
    <div ref={searchRef} className="relative">
      <div
        className="flex items-center gap-2 rounded-[14px] px-3 py-2.5 transition-all"
        style={dropOpen && query
          ? { border: '1.5px solid #30D158', background: '#fff', boxShadow: '0 0 0 3px rgba(48,209,88,0.10)' }
          : { border: '1px solid rgba(0,0,0,0.10)', background: '#F2F2F7' }
        }
      >
        <I.Search size={15} color="#AEAEB2" />
        <input
          type="text"
          placeholder="Produkt suchen… z.B. Milch, Eier, Kaffee"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setDropOpen(true); }}
          onFocus={() => setDropOpen(true)}
          className="flex-1 bg-transparent outline-none font-[500]"
          style={{ fontSize: '14px', color: '#1D1D1F' }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setDropOpen(false); }}
            style={{ color: '#AEAEB2' }}
          >
            <I.X size={14} />
          </button>
        )}
      </div>

      {dropOpen && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[18px] overflow-hidden z-30 anim-slideDown"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.14), 0 0 0 0.5px rgba(0,0,0,0.06)' }}>
          {searchResults.map((item, i) => {
            const prices = Object.values(item.prices).filter(Boolean);
            const minP = prices.length ? Math.min(...prices) : null;
            const hasDeal = Object.values(item.sales || {}).some(Boolean);
            return (
              <button
                key={item.id}
                onClick={() => addItem(item)}
                className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
                style={{
                  borderBottom: i < searchResults.length - 1 ? '0.5px solid rgba(0,0,0,0.05)' : 'none',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(48,209,88,0.04)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-[600]" style={{ color: '#1D1D1F' }}>{item.name}</p>
                    {hasDeal && (
                      <span className="sale-badge text-[10px] font-[800] px-1.5 py-0.5 rounded-[6px]"
                        style={{ background: '#FF3B30', color: '#fff' }}>
                        ANGEBOT
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] mt-0.5" style={{ color: '#AEAEB2' }}>
                    {item.detail} · {item.category}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[12px] font-[700]" style={{ color: '#30D158' }}>
                    ab {fmt(minP)}
                  </span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(48,209,88,0.12)' }}>
                    <I.Plus size={11} color="#30D158" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {dropOpen && query.length > 0 && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[18px] px-4 py-6 text-center z-30 anim-slideDown"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)' }}>
          <p className="text-[14px]" style={{ color: '#AEAEB2' }}>
            Keine Ergebnisse für „<span className="font-[600]" style={{ color: '#6E6E73' }}>{query}</span>"
          </p>
        </div>
      )}

      <p className="text-[12px] mt-2 text-center" style={{ color: '#AEAEB2' }}>
        {CATALOG.length} Produkte im Katalog
      </p>
    </div>
  );
}
