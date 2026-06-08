import { I } from '../../utils/icons.jsx';
import { fmt } from '../../utils/helpers.js';

const DIETS = [
  { id: 'balanced',      label: 'Ausgewogen',   emoji: '⚖️' },
  { id: 'vegan',         label: 'Vegan',         emoji: '🌱' },
  { id: 'high-protein',  label: 'Eiweißreich',   emoji: '💪' },
  { id: 'low-budget',    label: 'Sparmaximum',   emoji: '💰' },
  { id: 'family',        label: 'Familie',       emoji: '👨‍👩‍👧' },
];

function Counter({ label, Icon, color, val, min, max, onChange }) {
  return (
    <div>
      <label className="text-[12px] font-[700] flex items-center gap-1.5 mb-2" style={{ color: 'rgba(235,235,245,0.6)' }}>
        <Icon size={13} color={color} />{label}
      </label>
      <div className="flex items-center rounded-[12px] overflow-hidden"
        style={{ background: '#2C2C2E', border: '0.5px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={() => onChange(Math.max(min, val - 1))}
          className="w-9 h-9 flex items-center justify-center font-[700] text-lg transition-colors"
          style={{ color: 'rgba(235,235,245,0.6)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >−</button>
        <span className="flex-1 text-center font-[800] text-[14px]" style={{ color: '#F5F5F7' }}>{val}</span>
        <button
          onClick={() => onChange(Math.min(max, val + 1))}
          className="w-9 h-9 flex items-center justify-center font-[700] text-lg transition-colors"
          style={{ color: 'rgba(235,235,245,0.6)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >+</button>
      </div>
    </div>
  );
}

export default function AIWizard({ aiForm, setAiForm, aiLoading, aiDone, generateAI }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[12px] font-[700] flex items-center gap-1.5 mb-2" style={{ color: 'rgba(235,235,245,0.6)' }}>
          <I.Banknote size={13} color="#FF9F0A" /> Budget gesamt
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {[25, 50, 75, 100, 150].map((b) => (
            <button
              key={b}
              onClick={() => setAiForm((f) => ({ ...f, budget: b }))}
              className="px-3 py-1.5 rounded-[980px] text-[12px] font-[800] transition-all"
              style={aiForm.budget === b
                ? { background: '#FF9F0A', color: '#000', boxShadow: '0 2px 10px rgba(255,159,10,0.4)', transform: 'scale(1.04)' }
                : { background: '#2C2C2E', color: 'rgba(235,235,245,0.6)' }
              }
            >
              {fmt(b)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Counter label="Personen" Icon={I.Users} color="#5856D6" val={aiForm.people} min={1} max={10}
          onChange={(v) => setAiForm((f) => ({ ...f, people: v }))} />
        <Counter label="Tage" Icon={I.Clock} color="#5856D6" val={aiForm.days}   min={1} max={30}
          onChange={(v) => setAiForm((f) => ({ ...f, days: v }))} />
      </div>

      <div>
        <label className="text-[12px] font-[700] flex items-center gap-1.5 mb-2" style={{ color: 'rgba(235,235,245,0.6)' }}>
          <I.Leaf size={13} color="#30D158" /> Ernährungsweise
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {DIETS.map((d) => (
            <button
              key={d.id}
              onClick={() => setAiForm((f) => ({ ...f, diet: d.id }))}
              className="flex items-center gap-2 px-3 py-2 rounded-[12px] text-[12px] font-[600] transition-all"
              style={aiForm.diet === d.id
                ? { background: '#30D158', color: '#000', boxShadow: '0 2px 10px rgba(48,209,88,0.4)', transform: 'scale(1.02)' }
                : { background: '#2C2C2E', color: 'rgba(235,235,245,0.6)', border: '0.5px solid rgba(255,255,255,0.08)' }
              }
            >
              <span>{d.emoji}</span>{d.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generateAI}
        disabled={aiLoading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-[980px] text-[14px] font-[700] transition-all"
        style={aiLoading
          ? { background: '#2C2C2E', color: 'rgba(235,235,245,0.3)', cursor: 'not-allowed' }
          : { background: '#0A84FF', color: '#fff', boxShadow: '0 3px 14px rgba(10,132,255,0.4)' }
        }
      >
        {aiLoading
          ? <><I.Spinner size={16} color="rgba(235,235,245,0.3)" /> KI-Liste wird erstellt…</>
          : <><I.Sparkles size={16} /> KI-Liste generieren</>
        }
      </button>

      {aiLoading && <div className="shimmer-bg h-10 rounded-[12px]" />}

      {aiDone && !aiLoading && (
        <div className="flex items-center gap-2 rounded-[12px] px-3 py-2.5 anim-pop text-[12px] font-[600]"
          style={{ background: 'rgba(48,209,88,0.1)', border: '0.5px solid rgba(48,209,88,0.25)', color: '#30D158' }}>
          <I.Check size={14} color="#30D158" />
          Liste bereit · {aiForm.people} Personen · {aiForm.days} Tage · {fmt(aiForm.budget)} Budget
        </div>
      )}
    </div>
  );
}
