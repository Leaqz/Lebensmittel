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
      <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5 mb-1.5">
        <Icon size={13} color={color} />{label}
      </label>
      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => onChange(Math.max(min, val - 1))}
          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-200 font-bold text-lg transition-colors"
        >−</button>
        <span className="flex-1 text-center font-extrabold text-gray-800 text-sm">{val}</span>
        <button
          onClick={() => onChange(Math.min(max, val + 1))}
          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-200 font-bold text-lg transition-colors"
        >+</button>
      </div>
    </div>
  );
}

export default function AIWizard({ aiForm, setAiForm, aiLoading, aiDone, generateAI }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5 mb-2">
          <I.Banknote size={13} color="#d97706" /> Budget gesamt
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {[25, 50, 75, 100, 150].map((b) => (
            <button
              key={b}
              onClick={() => setAiForm((f) => ({ ...f, budget: b }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                aiForm.budget === b
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-200 scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              {fmt(b)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Counter label="Personen" Icon={I.Users} color="#6366f1" val={aiForm.people} min={1} max={10} onChange={(v) => setAiForm((f) => ({ ...f, people: v }))} />
        <Counter label="Tage"     Icon={I.Clock} color="#6366f1" val={aiForm.days}   min={1} max={30} onChange={(v) => setAiForm((f) => ({ ...f, days: v }))} />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5 mb-2">
          <I.Leaf size={13} color="#10b981" /> Ernährungsweise
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {DIETS.map((d) => (
            <button
              key={d.id}
              onClick={() => setAiForm((f) => ({ ...f, diet: d.id }))}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                aiForm.diet === d.id
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 scale-[1.02]'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
              }`}
            >
              <span>{d.emoji}</span>{d.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generateAI}
        disabled={aiLoading}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-extrabold transition-all ${
          aiLoading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'btn-primary'
        }`}
      >
        {aiLoading
          ? <><I.Spinner size={16} color="#9ca3af" /> KI-Liste wird erstellt…</>
          : <><I.Sparkles size={16} /> KI-Liste generieren</>
        }
      </button>

      {aiLoading && <div className="shimmer-bg h-10 rounded-2xl" />}

      {aiDone && !aiLoading && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 anim-pop font-semibold">
          <I.Check size={14} color="#10b981" />
          Liste bereit · {aiForm.people} Personen · {aiForm.days} Tage · {fmt(aiForm.budget)} Budget
        </div>
      )}
    </div>
  );
}
