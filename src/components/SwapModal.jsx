import { I } from '../utils/icons.jsx';
import { fmt, bestEffectivePrice } from '../utils/helpers.js';

export default function SwapModal({ item, visibleStores, onClose, onSwap }) {
  if (!item) return null;
  const currentPrice = bestEffectivePrice(item, visibleStores);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 anim-fadeIn"
      style={{ background: 'rgba(0,0,0,.48)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-[28px] overflow-hidden anim-slideUp"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.26)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-4" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.07)' }}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-[800] text-[17px]" style={{ color: '#1D1D1F' }}>Alternativen</h3>
              <p className="text-[13px] mt-1" style={{ color: '#6E6E73' }}>
                Tauschen: <span className="font-[600]" style={{ color: '#1D1D1F' }}>{item.name}</span>
                {visibleStores.length > 0 && (
                  <span className="font-[700]" style={{ color: '#30D158' }}> · {fmt(currentPrice)}</span>
                )}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              style={{ background: 'rgba(0,0,0,0.06)' }}
            >
              <I.X size={14} color="#6E6E73" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
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
                className="w-full flex items-center justify-between rounded-[14px] p-3.5 transition-all text-left anim-pop"
                style={{
                  background: save ? 'rgba(48,209,88,0.06)' : '#F2F2F7',
                  border: save ? '0.5px solid rgba(48,209,88,0.22)' : '0.5px solid rgba(0,0,0,0.06)',
                  animationDelay: `${i * 55}ms`,
                }}
              >
                <div>
                  <p className="text-[14px] font-[600]" style={{ color: '#1D1D1F' }}>{alt.name}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: '#AEAEB2' }}>{alt.detail}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-[14px] font-[800]" style={{ color: '#1D1D1F', fontVariantNumeric: 'tabular-nums' }}>
                    {fmt(altP)}
                  </p>
                  <p className="text-[12px] font-[700] mt-0.5"
                    style={{ color: save ? '#30D158' : pricier ? '#FF3B30' : '#AEAEB2' }}>
                    {save ? `Spare ${fmt(Math.abs(diff))}` : pricier ? `+${fmt(diff)}` : 'Gleicher Preis'}
                  </p>
                </div>
              </button>
            );
          })}
          {(!item.alternatives || !item.alternatives.length) && (
            <p className="text-[14px] text-center py-4" style={{ color: '#AEAEB2' }}>
              Keine Alternativen verfügbar.
            </p>
          )}
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-[980px] text-[14px] font-[600] transition-all"
            style={{ background: '#F2F2F7', color: '#6E6E73' }}
          >
            Artikel behalten
          </button>
        </div>
      </div>
    </div>
  );
}
