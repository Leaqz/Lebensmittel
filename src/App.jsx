import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { I } from './utils/icons.jsx';
import { avgPrice, effectivePrice, bestEffectivePrice, fmt } from './utils/helpers.js';
import { CATALOG } from './data/catalog.js';
import { STATIC_STORES, AI_PRESETS } from './data/constants.js';
import { getUserLocation, fetchNearbyStores } from './services/location.js';
import TravelPanel from './components/TravelPanel.jsx';
import ListCreator from './components/ListCreator/index.jsx';
import ListPanel from './components/ListPanel.jsx';
import StorePanel from './components/StorePanel.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import SwapModal from './components/SwapModal.jsx';

const DEFAULT_RADIUS    = Number(import.meta.env.VITE_DEFAULT_RADIUS)    || 3;
const DEFAULT_TRANSPORT = import.meta.env.VITE_DEFAULT_TRANSPORT || 'car';

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

export default function App() {
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

  // Standort & echte Filialen
  const [userLocation,    setUserLocation]    = useState(null);
  const [locationStatus,  setLocationStatus]  = useState('idle'); // idle | loading | success | error
  const [locationError,   setLocationError]   = useState(null);
  const [realStores,      setRealStores]      = useState(null); // null = Fallback auf STATIC_STORES

  const searchRef = useRef(null);

  // Aktive Filialen: echte OSM-Daten wenn vorhanden, sonst statische Demo-Daten
  const allStores = useMemo(() => realStores || STATIC_STORES, [realStores]);

  // Filialen innerhalb des Radius
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
    setList((prev) => [...prev, { ...item }]);
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
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold">
                <I.Cart size={13} /> {list.length} Artikel
              </div>
            )}
            {savings > 0.005 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-bold">
                <I.TrendDown size={13} /> Spare {fmt(savings)}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Left column */}
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

          {/* Right column */}
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
      </main>
    </div>
  );
}
