import { I } from '../utils/icons.jsx';
import { fmt, bestEffectivePrice } from '../utils/helpers.js';

export default function SwapModal({ item, visibleStores, onClose, onSwap }) {
  if (!item) return null;
  const currentPrice = bestEffectivePrice(item, visibleStores);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 anim-fadeIn"
      style={{ background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden anim-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-extrabold text-gray-900">Alternativen</h3>
              <p className="text-xs text-gray-500 mt-1">
                Tauschen: <span className="font-bold text-gray-700">{item.name}</span>
                {visibleStores.length > 0 && (
                  <span className="text-emerald-600 font-bold"> · {fmt(currentPrice)}</span>
                )}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <I.X size={14} color="#6b7280" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-2.5 max-h-80 overflow-y-auto">
          {(item.alternatives || []).map((alt, i) => {
            const altPrices = Object.values(alt.prices || {}).filter(Boolean);
            const altP = visibleStores.length > 0
              ? bestEffectivePrice(alt, visibleStores)
              : altPrices.length ? Math.min(...altPrices) : null;
            const diff = altP - currentPrice;
            const save = diff < -0.005;
            const pricier = diff > 0.005;
            return (
              <button
                key={alt.id}
                onClick={() => onSwap(item.id, alt)}
                className={`w-full flex items-center justify-between border-2 rounded-2xl p-3.5 transition-all text-left group anim-pop ${
                  save
                    ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-400'
                    : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div>
                  <p className="text-sm font-bold text-gray-800">{alt.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{alt.detail}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-extrabold text-gray-800">{fmt(altP)}</p>
                  <p className={`text-xs font-extrabold mt-0.5 ${save ? 'text-emerald-600' : pricier ? 'text-red-500' : 'text-gray-400'}`}>
                    {save ? `Spare ${fmt(Math.abs(diff))}` : pricier ? `+${fmt(diff)}` : 'Gleicher Preis'}
                  </p>
                </div>
              </button>
            );
          })}
          {(!item.alternatives || !item.alternatives.length) && (
            <p className="text-sm text-center text-gray-400 py-4">Keine Alternativen verfügbar.</p>
          )}
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-2xl transition-colors"
          >
            Artikel behalten
          </button>
        </div>
      </div>
    </div>
  );
}
