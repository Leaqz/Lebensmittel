import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { I } from './utils/icons.jsx';
import { avgPrice, effectivePrice, bestEffectivePrice, fmt } from './utils/helpers.js';
import { CATALOG } from './data/catalog.js';
import { STATIC_STORES, AI_PRESETS } from './data/constants.js';
import { getUserLocation, fetchNearbyStores } from './services/location.js';
import { fetchCrawlStatus, fetchCrawlConfigs, updateCrawlConfig, triggerCrawl, fetchCrawledItems } from './services/api.js';
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
    <div className="card p-12 flex flex-col items-center text-center" style={{ border: '1.5px dashed rgba(48,209,88,0.25)' }}>
      <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5"
        style={{ background: 'linear-gradient(145deg,rgba(48,209,88,0.15),rgba(48,209,88,0.06))' }}>
        <I.Cart size={26} color="#30D158" />
      </div>
      <h3 className="font-[800] text-[17px] mb-2 tracking-[-0.02em]" style={{ color: '#F5F5F7' }}>Deine Liste ist leer</h3>
      <p className="text-[14px] max-w-xs leading-relaxed" style={{ color: 'rgba(235,235,245,0.6)' }}>
        {mode === 'manual'
          ? 'Suche links nach Produkten und vergleiche die Preise bei Aldi, Lidl, REWE und EDEKA sofort.'
          : 'Nutze den KI-Planer links: Budget, Personenzahl und Ernährungsweise eingeben — fertig.'}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
        {['🥛 Milchprodukte', '🍎 Obst', '🥩 Fleisch', '🍝 Nudeln', '🥬 Gemüse', '🧀 Käse', '☕ Getränke', '🧊 Tiefkühl'].map((c) => (
          <span key={c} className="font-[600] px-3 py-1.5 rounded-full"
            style={{ background:'rgba(48,209,88,0.08)', color:'#30D158' }}>
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

  const statusPill = (s) => ({
    success: { bg: 'rgba(48,209,88,0.12)',  color: '#30D158',              label: 'success'  },
    failed:  { bg: 'rgba(255,69,58,0.12)',  color: '#FF453A',              label: 'failed'   },
    running: { bg: 'rgba(10,132,255,0.12)', color: '#0A84FF',              label: 'running'  },
    skipped: { bg: 'rgba(255,255,255,0.08)',color: 'rgba(235,235,245,0.6)',label: 'skipped'  },
  }[s] || { bg: 'rgba(255,255,255,0.06)', color: 'rgba(235,235,245,0.3)', label: s });

  return (
    <div className="space-y-4">
      {toast && (
        <div className="anim-slideDown text-[13px] font-[600] px-4 py-3 rounded-[14px]"
          style={{ background:'#2C2C2E', color:'#F5F5F7', boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }}>
          {toast}
        </div>
      )}

      {loading ? (
        <div className="card p-10 text-center text-[13px]" style={{ color:'rgba(235,235,245,0.3)' }}>
          Verbinde mit Backend…
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom:'0.5px solid rgba(255,255,255,0.08)' }}>
              <span className="text-[14px] font-[700]" style={{ color:'#F5F5F7' }}>Crawler-Konfiguration</span>
              <button
                onClick={handleRun}
                disabled={running}
                className={`flex items-center gap-2 px-4 py-2 rounded-[980px] text-[12px] font-[700] transition-all ${
                  running ? 'cursor-not-allowed' : ''
                }`}
                style={running
                  ? { background:'#2C2C2E', color:'rgba(235,235,245,0.3)' }
                  : { background:'#0A84FF', color:'#fff', boxShadow:'0 2px 12px rgba(10,132,255,0.4)' }
                }
              >
                {running ? <><I.Spinner size={12} color="rgba(235,235,245,0.3)" /> Läuft…</> : <><I.Zap size={12} /> Crawl starten</>}
              </button>
            </div>
            <div>
              {configs.length === 0 && (
                <div className="p-6 text-center text-[13px]" style={{ color:'rgba(235,235,245,0.3)' }}>
                  Keine Konfigurationen — Backend starten &amp; DB initialisieren.
                </div>
              )}
              {configs.map((cfg, i) => (
                <div key={cfg.id} className="px-5 py-3.5 flex items-center gap-4"
                  style={i < configs.length - 1 ? { borderBottom:'0.5px solid rgba(255,255,255,0.06)' } : {}}>
                  <div className="flex-1">
                    <div className="text-[14px] font-[600]" style={{ color:'#F5F5F7' }}>{cfg.supermarket_name}</div>
                    <div className="text-[12px] mt-0.5" style={{ color:'rgba(235,235,245,0.3)' }}>Max {cfg.max_items} Produkte · {cfg.delay_ms} ms Pause</div>
                  </div>
                  <label className="flex items-center gap-1.5 text-[12px] font-[600] cursor-pointer" style={{ color:'rgba(235,235,245,0.6)' }}>
                    <input type="checkbox" checked={cfg.is_enabled}
                      onChange={(e) => handleToggle(cfg, 'is_enabled', e.target.checked)} className="rounded" />
                    Aktiv
                  </label>
                  <label className="flex items-center gap-1.5 text-[12px] font-[600] cursor-pointer" style={{ color:'rgba(235,235,245,0.6)' }}
                    title="Nur einmal crawlen, danach überspringen.">
                    <input type="checkbox" checked={cfg.run_once}
                      onChange={(e) => handleToggle(cfg, 'run_once', e.target.checked)} className="rounded" />
                    Nur einmal
                  </label>
                </div>
              ))}
            </div>
          </div>

          {history.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-5 py-4" style={{ borderBottom:'0.5px solid rgba(255,255,255,0.08)' }}>
                <span className="text-[14px] font-[700]" style={{ color:'#F5F5F7' }}>Verlauf (letzte 20)</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {history.map((h, i) => {
                  const pill = statusPill(h.status);
                  return (
                    <div key={h.id} className="px-5 py-2.5 flex items-center gap-3 text-[12px]"
                      style={i < history.length - 1 ? { borderBottom:'0.5px solid rgba(255,255,255,0.05)' } : {}}>
                      <span className="font-[700] px-2 py-0.5 rounded-[6px]"
                        style={{ background: pill.bg, color: pill.color }}>{h.status}</span>
                      <span className="font-[600]" style={{ color:'#F5F5F7' }}>{h.supermarket}</span>
                      <span style={{ color:'rgba(235,235,245,0.6)' }}>{h.items_crawled} Produkte</span>
                      <span className="ml-auto" style={{ color:'rgba(235,235,245,0.3)' }}>
                        {new Date(h.started_at).toLocaleString('de-DE', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="card p-4 text-[12px] leading-relaxed"
            style={{ background:'rgba(10,132,255,0.07)', boxShadow:'none', border:'0.5px solid rgba(10,132,255,0.2)' }}>
            <div className="font-[700] mb-1" style={{ color:'#0A84FF' }}>Wie funktioniert „Nur einmal"?</div>
            <p style={{ color:'rgba(235,235,245,0.6)' }}>
              Wenn <strong>Nur einmal</strong> aktiviert ist, crawlt der Crawler diesen Markt nur beim ersten Durchlauf.
              Deaktiviere es, damit bei jedem Aufruf neu gecrawlt wird.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ── Transform backend API items into catalog format ───────────────────────────
function _groupApiItems(apiItems) {
  const byName = {};
  for (const item of apiItems) {
    const key = item.name.toLowerCase();
    if (!byName[key]) {
      byName[key] = {
        id: `api_${key.replace(/[^a-z0-9]/g, '_')}`,
        name: item.name,
        brand: item.brand || '',
        detail: item.detail || '',
        category: `${item.category?.emoji || ''} ${item.category?.name || ''}`.trim(),
        image_url: item.image_url || '',
        prices: {},
        salePrices: {},
        sales: {},
        alternatives: [],
      };
    }
    const sid = item.supermarket?.catalog_id;
    if (sid) {
      const price = parseFloat(item.current_price);
      byName[key].prices[sid] = price;
      byName[key].sales[sid] = item.is_sale ? (item.sale_label || 'Angebot') : null;
      byName[key].salePrices[sid] = item.is_sale ? price : null;
    }
  }
  return Object.values(byName);
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
  const searchDebounce = useRef(null);

  const allStores = useMemo(() => realStores || STATIC_STORES, [realStores]);

  const visibleStores = useMemo(
    () => allStores.filter((s) => s.distance <= radius),
    [allStores, radius]
  );

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) { setSearchResults([]); return; }
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(async () => {
      try {
        const data = await fetchCrawledItems({ search: query.trim(), page: 1 });
        const grouped = _groupApiItems(data.items || []);
        setSearchResults(grouped.filter((p) => !list.find((i) => i.id === p.id)).slice(0, 8));
      } catch {
        setSearchResults(
          CATALOG.filter((p) =>
            (p.name.toLowerCase().includes(query.toLowerCase()) ||
             p.category.toLowerCase().includes(query.toLowerCase())) &&
            !list.find((i) => i.id === p.id)
          ).slice(0, 8)
        );
      }
    }, 300);
  }, [query, list]);

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
    <div className="min-h-screen" style={{ background:'#000000' }}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 anim-slideDown text-[13px] font-[600] px-4 py-3 rounded-[14px] max-w-xs"
          style={{ background:'#2C2C2E', color:'#F5F5F7', boxShadow:'0 8px 32px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.08)' }}>
          {toast}
        </div>
      )}

      {swapTarget && (
        <SwapModal
          item={list.find((i) => i.id === swapTarget)}
          visibleStores={visibleStores}
          onClose={() => setSwapTarget(null)}
          onSwap={swapItem}
        />
      )}

      {/* ── Header ── */}
      <header className="sticky top-0 z-40" style={{
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '0.5px solid rgba(255,255,255,0.08)',
      }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[60px] flex items-center gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center"
              style={{ background:'linear-gradient(145deg,#30D158,#1A9940)', boxShadow:'0 2px 8px rgba(48,209,88,0.4)' }}>
              <I.Cart size={17} color="white" />
            </div>
            <span className="font-[800] text-[16px] tracking-[-0.025em]" style={{ color:'#F5F5F7' }}>
              GroceryGenius
            </span>
          </div>

          {/* Segmented control — desktop */}
          <nav className="hidden sm:flex flex-1 justify-center">
            <div className="seg-control">
              {TABS.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`seg-tab ${activeTab === tab.id ? 'active' : ''}`}>
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {(() => {
              const totalDeals = list.reduce((n, item) =>
                n + allStores.filter((s) => s.distance <= radius && item.sales?.[s.catalogId || s.id]).length, 0);
              return totalDeals > 0 ? (
                <div className="sale-glow flex items-center gap-1.5 px-3 py-1.5 rounded-[980px] text-[12px] font-[700]"
                  style={{ background:'rgba(255,69,58,0.1)', color:'#FF453A' }}>
                  <I.Percent size={11} /> {totalDeals} Angebot{totalDeals > 1 ? 'e' : ''}
                </div>
              ) : null;
            })()}
            {list.length > 0 && (
              <button onClick={() => setActiveTab('shop')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[980px] text-[12px] font-[700] transition-all hover:opacity-80"
                style={{ background:'rgba(48,209,88,0.12)', color:'#30D158' }}>
                <I.Cart size={12} /> {list.length}
              </button>
            )}
          </div>
        </div>

        {/* Mobile bottom tab bar */}
        <div className="sm:hidden flex" style={{ borderTop:'0.5px solid rgba(255,255,255,0.08)' }}>
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-[600] transition-colors"
              style={{ color: activeTab === tab.id ? '#30D158' : 'rgba(235,235,245,0.3)' }}>
              <span className="text-[18px] leading-none">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-7">

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

        {activeTab === 'meals' && (
          <div>
            <div className="mb-6">
              <h2 className="font-[800] text-[26px] tracking-[-0.03em]" style={{ color:'#F5F5F7' }}>Mahlzeiten planen</h2>
              <p className="text-[14px] mt-1.5" style={{ color:'rgba(235,235,245,0.6)' }}>
                Wähle eine Mahlzeit, stelle die Portionen ein und füge die Zutaten direkt zur Einkaufsliste hinzu.
              </p>
            </div>
            <MealPlanner visibleStores={visibleStores} addItem={addItem} />
          </div>
        )}

        {activeTab === 'crawler' && (
          <div>
            <div className="mb-6">
              <h2 className="font-[800] text-[26px] tracking-[-0.03em]" style={{ color:'#F5F5F7' }}>Crawler-Verwaltung</h2>
              <p className="text-[14px] mt-1.5" style={{ color:'rgba(235,235,245,0.6)' }}>
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
