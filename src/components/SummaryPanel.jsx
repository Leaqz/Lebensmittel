import { I } from '../utils/icons.jsx';
import { fmt } from '../utils/helpers.js';

export default function SummaryPanel({ bestStore, savings, avgTotal, list, exportList }) {
  const pct = avgTotal > 0 ? (savings / avgTotal) * 100 : 0;
  const totalSaleCount = list.reduce((n, item) =>
    n + Object.values(item.sales || {}).filter(Boolean).length, 0
  );

  return (
    <div className="rounded-[22px] p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0A0A0A 0%, #1C1C1E 60%, #2C2C2E 100%)',
        boxShadow: '0 0 0 0.5px rgba(255,255,255,0.06), 0 8px 40px rgba(0,0,0,0.6)',
      }}>

      {/* Decorative blur circles */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: 'rgba(48,209,88,0.14)', filter: 'blur(30px)' }} />
      <div className="absolute -bottom-16 -left-8 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: 'rgba(10,132,255,0.12)', filter: 'blur(24px)' }} />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
            style={{ background: 'rgba(48,209,88,0.2)' }}>
            <I.Award size={16} color="#30D158" />
          </div>
          <h2 className="font-[700] text-[15px]" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Deine Ersparnis-Übersicht
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            {
              label: 'Gesamtpreis',
              value: bestStore ? fmt(bestStore.total) : '—',
              sub: bestStore?.name || 'Kein Markt',
              accent: false,
            },
            {
              label: 'Du sparst',
              value: fmt(savings),
              sub: `${pct.toFixed(0)}% günstiger`,
              accent: savings > 0.005,
            },
            {
              label: 'Angebote',
              value: totalSaleCount,
              sub: 'auf deine Artikel',
              accent: false,
            },
          ].map((s, i) => (
            <div key={i} className="rounded-[16px] p-3.5 text-center"
              style={{
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
                border: '0.5px solid rgba(255,255,255,0.12)',
              }}>
              <p className="text-[11px] font-[500] mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {s.label}
              </p>
              <p className="font-[800] tracking-[-0.03em] leading-none"
                style={{
                  fontSize: '22px',
                  color: s.accent ? '#FFD60A' : '#fff',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                {s.value}
              </p>
              <p className="text-[11px] mt-1.5 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Savings callout */}
        {savings > 0.005 && (
          <div className="flex items-center gap-2.5 rounded-[14px] px-4 py-3 mb-5"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '0.5px solid rgba(255,255,255,0.1)',
            }}>
            <I.TrendDown size={15} color="#FFD60A" />
            <span className="text-[13px] font-[500]" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Bei <span className="font-[700] text-white">{bestStore?.name}</span> sparst du{' '}
              <span className="font-[800]" style={{ color: '#FFD60A' }}>{fmt(savings)}</span>{' '}
              gegenüber dem Durchschnitt
            </span>
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between text-[11px] mb-2 font-[500]"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            <span>Ersparnis-Rate</span><span>{pct.toFixed(0)}%</span>
          </div>
          <div className="h-[4px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, pct)}%`, background: '#30D158' }} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={exportList}
            className="flex items-center justify-center gap-2 py-3 rounded-[980px] text-[13px] font-[700] transition-all hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)', border: '0.5px solid rgba(255,255,255,0.15)' }}>
            <I.Download size={14} /> Liste exportieren
          </button>
          <button className="flex items-center justify-center gap-2 py-3 rounded-[980px] text-[13px] font-[700] transition-all hover:opacity-90 active:scale-[.97]"
            style={{ background: '#30D158', color: '#000', boxShadow: '0 4px 16px rgba(48,209,88,0.4)' }}>
            <I.Play size={13} /> Einkaufen starten
          </button>
        </div>
      </div>
    </div>
  );
}
