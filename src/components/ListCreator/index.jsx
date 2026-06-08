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
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,149,0,0.1)' }}>
          <I.Cart size={15} color="#FF9500" />
        </div>
        <h2 className="text-[15px] font-[700]" style={{ color: '#1D1D1F' }}>Einkaufsliste</h2>
      </div>

      <div className="seg-control mb-4">
        {[
          { id: 'manual', label: 'Manuell',   Icon: I.Search },
          { id: 'ai',     label: 'KI-Planer', Icon: I.Sparkles },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setMode(t.id)}
            className={`seg-tab ${mode === t.id ? 'active' : ''}`}
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
