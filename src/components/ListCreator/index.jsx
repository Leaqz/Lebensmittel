import { I } from '../../utils/icons.jsx';
import ManualSearch from './ManualSearch.jsx';
import AIWizard from './AIWizard.jsx';

export default function ListCreator({
  mode, setMode,
  query, setQuery, dropOpen, setDropOpen, searchRef, searchResults, addItem,
  aiForm, setAiForm, aiLoading, aiDone, generateAI,
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
          <I.Cart size={15} color="#d97706" />
        </div>
        <h2 className="font-bold text-gray-800 text-sm">Einkaufsliste</h2>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-4">
        {[
          { id: 'manual', label: 'Manuell',   Icon: I.Search },
          { id: 'ai',     label: 'KI-Planer', Icon: I.Sparkles },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setMode(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <t.Icon size={13} />{t.label}
          </button>
        ))}
      </div>

      {mode === 'manual' ? (
        <ManualSearch
          query={query} setQuery={setQuery}
          dropOpen={dropOpen} setDropOpen={setDropOpen}
          searchRef={searchRef} searchResults={searchResults}
          addItem={addItem}
        />
      ) : (
        <AIWizard
          aiForm={aiForm} setAiForm={setAiForm}
          aiLoading={aiLoading} aiDone={aiDone}
          generateAI={generateAI}
        />
      )}
    </div>
  );
}
