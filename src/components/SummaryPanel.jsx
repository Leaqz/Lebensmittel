import { I } from '../utils/icons.jsx';
import { fmt } from '../utils/helpers.js';

export default function SummaryPanel({ bestStore, savings, avgTotal, list, exportList }) {
  const pct = avgTotal > 0 ? (savings / avgTotal) * 100 : 0;
  const totalSaleCount = list.reduce((n, item) =>
    n + Object.values(item.sales || {}).filter(Boolean).length, 0
  );

  return (
    <div
      className="rounded-3xl p-5 text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#059669 0%,#10b981 50%,#34d399 100%)' }}
    >
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-10 -left-4 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <I.Award size={18} color="white" />
          <h2 className="font-extrabold text-base">Deine Ersparnis-Übersicht</h2>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Gesamtpreis', value: bestStore ? fmt(bestStore.total) : '—', sub: bestStore?.name || 'Kein Markt' },
            { label: 'Du sparst',   value: fmt(savings), sub: `${pct.toFixed(0)}% günstiger`, accent: savings > 0.005 },
            { label: 'Angebote',    value: totalSaleCount, sub: 'auf deine Artikel' },
          ].map((s, i) => (
            <div key={i} className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/20">
              <p className="text-emerald-100 text-xs font-medium mb-1">{s.label}</p>
              <p className={`text-xl font-extrabold ${s.accent ? 'text-amber-300' : 'text-white'}`}>{s.value}</p>
              <p className="text-emerald-200 text-xs mt-1 truncate">{s.sub}</p>
            </div>
          ))}
        </div>

        {savings > 0.005 && (
          <div className="flex items-center gap-2 bg-white/15 border border-white/20 rounded-2xl px-3 py-2.5 mb-4 text-sm font-semibold">
            <I.TrendDown size={16} color="#fcd34d" />
            <span>
              Bei <span className="font-extrabold">{bestStore?.name}</span> sparst du{' '}
              <span className="text-amber-300 font-extrabold">{fmt(savings)}</span> gegenüber dem Durchschnittspreis
            </span>
          </div>
        )}

        <div className="mb-4">
          <div className="flex justify-between text-xs text-emerald-200 mb-1.5 font-medium">
            <span>Ersparnis-Rate</span><span>{pct.toFixed(0)}%</span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-300 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={exportList}
            className="btn-ghost flex items-center justify-center gap-2 py-3 text-sm font-bold"
          >
            <I.Download size={16} /> Liste exportieren
          </button>
          <button className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-2xl py-3 text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[.97]">
            <I.Play size={15} /> Einkaufen starten
          </button>
        </div>
      </div>
    </div>
  );
}
