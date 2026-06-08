import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { I } from './utils/icons.jsx';
import { avgPrice, effectivePrice, bestEffectivePrice, fmt } from './utils/helpers.js';
import { CATALOG } from './data/catalog.js';
import { STATIC_STORES, AI_PRESETS } from './data/constants.js';
import { getUserLocation, fetchNearbyStores } from './services/location.js';
import { fetchCrawlStatus, fetchCrawlConfigs, updateCrawlConfig, triggerCrawl } from './services/api.js';
import TravelPanel from './components/TravelPanel.jsx';
import ListCreator from './components/ListCreator/index.jsx';
import ListPanel from './components/ListPanel.jsx';
import StorePanel from './components/StorePanel.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import SwapModal from './components/SwapModal.jsx';
import MealPlanner from './components/MealPlanner/index.jsx';

const DEFAULT_RADIUS    = Number(import.meta.env.VITE_DEFAULT_RADIUS)    || 3;
const DEFAULT_TRANSPORT = import.meta.env.VITE_DEFAULT_TRANSPORT || 'car';

const TABS = [
  { id: 'shop',    label: 'Einkaufsliste', icon: '🛒' },
  { id: 'meals',   label: 'Mahlzeiten',    icon: '🍽️' },
  { id: 'crawler', label: 'Crawler',        icon: '⚙️' },
];

function EmptyHero({ mode }) {
  return (
    <div className="card border-dashed border-2 border-emerald-200 p-12 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4 shadow-inner"
        style={{ background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)' }}>
        <I.Cart size={28} color="#10b981" />
      </div>
      <h3 className="font-extrabold text-gray-700 text-lg mb-2">Deine Liste ist leer</h3>
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
        {mode === 'manual'
          ? 'Suche links nach Produkten und vergleiche die Preise bei Aldi, Lidl, REWE und EDEKA sofort.'
          : 'Nutze den KI-Planer links: Budget, Personenzahl und Ernährungsweise eingeben — fertig.'}
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
        {['🥛 Milchprodukte', '🍎 Obst', '🥩 Fleisch', '🍝 Nudeln', '🥬 Gemüse', '🧀 Käse', '☕ Getränke', '🧊 Tiefkühl'].map((c) => (
          <span key={c} className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Crawler admin panel ────────────────────────────────────────────────────────
function CrawlerPanel() {
  const [configs, setConfigs]   = useState([]);
  const [history, setHistory]   = useState([]);
  const [running, setRunning]   = useState(false);
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState(null);

  const load = useCallback(async () => {
    try {
      const [cfgs, status] = await Promise.all([fetchCrawlConfigs(), fetchCrawlStatus()]);
      setConfigs(cfgs);
      setHistory(status.history || []);
      setRunning(status.is_running || false);
    } catch {
      setToast('⚠️ Backend nicht erreichbar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (config, field, value) => {
    try {
      const updated = await updateCrawlConfig(config.id, { [field]: value });
      setConfigs((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch {
      setToast('⚠️ Fehler beim Speichern');
    }
  };

  const handleRun = async () => {
    try {
      await triggerCrawl();
      setRunning(true);
      setToast('🚀 Crawler gestartet!');
      setTimeout(load, 3000);
    } catch {
      setToast('⚠️ Fehler beim Starten');
    }
  };

  const statusColor = (s) => ({
    success: 'text-emerald-600 bg-emerald-50', failed: 'text-red-600 bg-red-50',
    running: 'text-blue-600 bg-blue-50', skipped: 'text-gray-500 bg-gray-50',
  }[s] || 'text-gray-400');

  return (
    <div className="space-y-5">
      {toast && (
        <div className="bg-gray-900 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl">
          {toast}
        </div>
      )}

      {loading ? (
        <div className="card p-8 text-center text-gray-400 font-semibold">
          Verbinde mit Backend…
        </div>
      ) : (
        <>
          {/* Config table */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 text-sm">Crawler-Konfiguration</h2>
              <button
                onClick={handleRun}
                disabled={running}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  running ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-200'
                }`}
              >
                {running ? <><I.Spinner size={12} color="#9ca3af" /> Läuft…</> : <><I.Zap size={12} /> Crawl starten</>}
              </button>
            </div>

            <div className="divide-y divide-gray-50">
              {configs.length === 0 && (
                <div className="p-6 text-center text-sm text-gray-400">
                  Keine Konfigurationen gefunden. Stelle sicher, dass das Backend läuft und die DB initialisiert ist.
                </div>
              )}
              {configs.map((cfg) => (
                <div key={cfg.id} className="px-5 py-3 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-sm">{cfg.supermarket_name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Max {cfg.max_items} Produkte · {cfg.delay_ms} ms Pause</div>
                  </div>

                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cfg.is_enabled}
                      onChange={(e) => handleToggle(cfg, 'is_enabled', e.target.checked)}
                      className="rounded"
                    />
                    Aktiv
                  </label>

                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 cursor-pointer" title="Nur einmal crawlen, danach überspringen. Deaktivieren zum erneuten Crawlen.">
                    <input
                      type="checkbox"
                      checked={cfg.run_once}
                      onChange={(e) => handleToggle(cfg, 'run_once', e.target.checked)}
                      className="rounded"
                    />
                    Nur einmal
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h2 className="font-bold text-gray-800 text-sm">Verlauf (letzte 20)</h2>
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {history.map((h) => (
                  <div key={h.id} className="px-5 py-2.5 flex items-center gap-3 text-xs">
                    <span className={`font-bold px-2 py-0.5 rounded-lg ${statusColor(h.status)}`}>{h.status}</span>
                    <span className="font-semibold text-gray-700">{h.supermarket}</span>
                    <span className="text-gray-400">{h.items_crawled} Produkte</span>
                    <span className="text-gray-300 ml-auto">
                      {new Date(h.started_at).toLocaleString('de-DE', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info box */}
          <div className="card p-4 text-xs text-gray-500 leading-relaxed bg-blue-50 border-blue-200">
            <div className="font-bold text-blue-700 mb-1">💡 Wie funktioniert „Nur einmal"?</div>
            <p>Wenn <strong>Nur einmal</strong> aktiviert ist, crawlt der Crawler diesen Markt nur beim ersten Durchlauf. Deaktiviere es, damit bei jedem Aufruf neu gecrawlt wird. Die Preise in der DB bleiben bis zum nächsten Crawl erhalten.</p>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab,     setActiveTab]     = useState('shop');
  const [radius,        setRadius]        = useState(DEFAULT_RADIUS);
  const [transport,     setTransport]     = useState(DEFAULT_TRANSPORT);
  const [list,          setList]          = useState([]);
  const [mode,          setMode]          = useState('manual');
  const [query,         setQuery]         = useState('');
  const [dropOpen,      setDropOpen]      = useState(false);
  const [aiForm,        setAiForm]        = useState({ budget: 60, people: 2, days: 7, diet: 'balanced' });
  const [aiLoading,     setAiLoading]     = useState(false);
  const [aiDone,        setAiDone]        = useState(false);
  const [swapTarget,    setSwapTarget]    = useState(null);
  const [toast,         setToast]         = useState(null);
  const [listOpen,      setListOpen]      = useState(true);
  const [userLocation,  setUserLocation]  = useState(null);
  const [locationStatus,setLocationStatus]= useState('idle');
  const [locationError, setLocationError] = useState(null);
  const [realStores,    setRealStores]    = useState(null);

  const searchRef = useRef(null);

  const allStores = useMemo(() => realStores || STATIC_STORES, [realStores]);

  const visibleStores = useMemo(
    () => allStores.filter((s) => s.distance <= radius),
    [allStores, radius]
  );

  const searchResults = useMemo(() =>
    query.trim().length > 0
      ? CATALOG.filter((p) =>
          (p.name.toLowerCase().includes(query.toLowerCase()) ||
           p.category.toLowerCase().includes(query.toLowerCase())) &&
          !list.find((i) => i.id === p.id)
        ).slice(0, 8)
      : [],
    [query, list]
  );

  const addItem = useCallback((item) => {
    setList((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, { ...item }];
    });
    setQuery('');
    setDropOpen(false);
    showToast(`✓ ${item.name} hinzugefügt`);
  }, []);

  const removeItem = useCallback((id) => {
    setList((prev) => prev.filter((i) => i.id !== id));
    if (swapTarget === id) setSwapTarget(null);
  }, [swapTarget]);

  const swapItem = useCallback((fromId, alt) => {
    const original = list.find((i) => i.id === fromId);
    setList((prev) => prev.map((i) =>
      i.id === fromId
        ? { ...alt, category: original?.category || '', alternatives: original?.alternatives || [] }
        : i
    ));
    setSwapTarget(null);
    showToast(`↔ Getauscht gegen ${alt.name}`);
  }, [list]);

  const generateAI = useCallback(() => {
    setAiLoading(true);
    setAiDone(false);
    setTimeout(() => {
      const ids = AI_PRESETS[aiForm.diet] || AI_PRESETS.balanced;
      setList(CATALOG.filter((p) => ids.includes(p.id)));
      setAiLoading(false);
      setAiDone(true);
      setListOpen(true);
      showToast('🤖 KI-Einkaufsliste erstellt!');
    }, 1800);
  }, [aiForm.diet]);

  const handleLocate = useCallback(async () => {
    setLocationStatus('loading');
    setLocationError(null);
    try {
      const loc = await getUserLocation();
      setUserLocation(loc);
      const stores = await fetchNearbyStores(loc.lat, loc.lon, Math.max(radius, 5));
      setRealStores(stores.length > 0 ? stores : null);
      setLocationStatus('success');
      showToast(`📍 ${stores.length} Filiale(n) in der Nähe gefunden`);
    } catch (err) {
      setLocationStatus('error');
      setLocationError(err.message);
      setRealStores(null);
    }
  }, [radius]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const storeTotals = useMemo(() =>
    allStores.map((s) => ({
      ...s,
      total: list.reduce((sum, item) => {
        const cid = s.catalogId || s.id;
        const p = effectivePrice(item, cid) ?? avgPrice(item);
        return sum + p;
      }, 0),
      saleCount: list.filter((item) => item.sales?.[s.catalogId || s.id]).length,
    })),
    [list, allStores]
  );

  const visStoreTotals = storeTotals.filter((s) => s.distance <= radius);
  const bestStore      = visStoreTotals.length
    ? visStoreTotals.reduce((a, b) => (a.total < b.total ? a : b))
    : null;
  const avgTotal       = list.reduce((s, item) => s + avgPrice(item), 0);
  const savings        = bestStore ? Math.max(0, avgTotal - bestStore.total) : 0;

  useEffect(() => {
    const h = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const exportList = () => {
    const lines = list.map((i) =>
      `• ${i.name} (${i.detail}) — ${fmt(bestEffectivePrice(i, visibleStores))}`
    );
    const txt = [
      'GroceryGenius – Einkaufsliste',
      new Date().toLocaleDateString('de-DE'),
      '─'.repeat(42),
      ...lines,
      '─'.repeat(42),
      `Bestes Geschäft: ${bestStore?.name || '—'}`,
      `Gesamtpreis: ${fmt(bestStore?.total)}`,
      `Ersparnis: ${fmt(savings)}`,
    ].join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([txt], { type: 'text/plain' })),
      download: 'einkaufsliste.txt',
    });
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('📋 Liste als .txt exportiert!');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#f0fdf4 0%,#fafffe 50%,#fffbeb 100%)' }}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 anim-slideDown bg-gray-900 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl max-w-xs">
          {toast}
        </div>
      )}

      {/* Swap Modal */}
      {swapTarget && (
        <SwapModal
          item={list.find((i) => i.id === swapTarget)}
          visibleStores={visibleStores}
          onClose={() => setSwapTarget(null)}
          onSwap={swapItem}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
              <I.Cart size={20} color="white" />
            </div>
            <div>
              <h1 className="font-extrabold text-gray-900 text-base leading-none tracking-tight">GroceryGenius</h1>
              <p className="text-xs font-semibold text-emerald-500 mt-0.5">Schlau einkaufen — mehr sparen.</p>
            </div>
          </div>

          {/* Tab navigation */}
          <nav className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-2xl p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {(() => {
              const totalDeals = list.reduce((n, item) =>
                n + allStores.filter((s) => s.distance <= radius && item.sales?.[s.catalogId || s.id]).length, 0);
              return totalDeals > 0 ? (
                <div className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-full text-xs font-extrabold sale-glow">
                  <I.Percent size={12} /> {totalDeals} Angebot{totalDeals > 1 ? 'e' : ''}
                </div>
              ) : null;
            })()}
            {list.length > 0 && (
              <button
                onClick={() => setActiveTab('shop')}
                className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                <I.Cart size={13} /> {list.length}
              </button>
            )}
          </div>
        </div>

        {/* Mobile tab bar */}
        <div className="sm:hidden flex border-t border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-bold transition-colors ${
                activeTab === tab.id ? 'text-emerald-600 border-t-2 border-emerald-500' : 'text-gray-400'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* ── SHOP TAB ── */}
        {activeTab === 'shop' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-4 space-y-4">
              <TravelPanel
                radius={radius} setRadius={setRadius}
                transport={transport} setTransport={setTransport}
                stores={allStores}
                locationStatus={locationStatus}
                locationError={locationError}
                onLocate={handleLocate}
              />
              <ListCreator
                mode={mode} setMode={setMode}
                query={query} setQuery={setQuery}
                dropOpen={dropOpen} setDropOpen={setDropOpen}
                searchRef={searchRef} searchResults={searchResults} addItem={addItem}
                aiForm={aiForm} setAiForm={setAiForm}
                aiLoading={aiLoading} aiDone={aiDone} generateAI={generateAI}
              />
            </div>

            <div className="lg:col-span-8 space-y-4">
              {list.length > 0 && (
                <ListPanel
                  list={list}
                  visibleStores={visibleStores}
                  bestStore={bestStore}
                  listOpen={listOpen} setListOpen={setListOpen}
                  removeItem={removeItem} setSwapTarget={setSwapTarget}
                />
              )}
              <StorePanel
                visStoreTotals={visStoreTotals}
                bestStore={bestStore}
                list={list}
                transport={transport}
                radius={radius}
              />
              {list.length > 0 && (
                <SummaryPanel
                  bestStore={bestStore}
                  savings={savings}
                  avgTotal={avgTotal}
                  list={list}
                  exportList={exportList}
                />
              )}
              {list.length === 0 && <EmptyHero mode={mode} />}
            </div>
          </div>
        )}

        {/* ── MEALS TAB ── */}
        {activeTab === 'meals' && (
          <div>
            <div className="mb-5">
              <h2 className="font-extrabold text-gray-900 text-xl">Mahlzeiten planen</h2>
              <p className="text-sm text-gray-500 mt-1">
                Wähle eine Mahlzeit, stelle die Portionen ein und füge die Zutaten direkt zur Einkaufsliste hinzu.
              </p>
            </div>
            <MealPlanner visibleStores={visibleStores} addItem={addItem} />
          </div>
        )}

        {/* ── CRAWLER TAB ── */}
        {activeTab === 'crawler' && (
          <div>
            <div className="mb-5">
              <h2 className="font-extrabold text-gray-900 text-xl">Crawler-Verwaltung</h2>
              <p className="text-sm text-gray-500 mt-1">
                Verwalte die Daten-Crawler für deutsche Supermärkte. Benötigt das laufende Backend (Docker).
              </p>
            </div>
            <CrawlerPanel />
          </div>
        )}
      </main>
    </div>
  );
}
