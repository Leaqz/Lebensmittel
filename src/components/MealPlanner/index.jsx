import { useState, useEffect, useCallback } from "react";
import MealCard from "./MealCard.jsx";
import ShoppingListModal from "./ShoppingListModal.jsx";
import { fetchMeals, fetchShoppingList } from "../../services/api.js";
import { STATIC_MEALS } from "../../data/meals.js";
import { I } from "../../utils/icons.jsx";

const FILTER_TAGS = ["Alle", "vegetarisch", "vegan", "fleisch", "fisch", "günstig", "schnell", "gesund"];

export default function MealPlanner({ visibleStores, addItem }) {
  const [meals, setMeals]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [servings, setServings]         = useState(4);
  const [shoppingList, setShoppingList] = useState(null);
  const [loadingList, setLoadingList]   = useState(false);
  const [activeTag, setActiveTag]       = useState("Alle");
  const [search, setSearch]             = useState("");
  const [apiAvailable, setApiAvailable] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMeals();
        setMeals(data);
        setApiAvailable(true);
      } catch {
        setMeals(STATIC_MEALS.map((m) => ({ ...m, ingredient_count: m.ingredients.length })));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedMeal) return;
    setShoppingList(null);
    setLoadingList(true);

    if (apiAvailable) {
      fetchShoppingList(selectedMeal.id, servings)
        .then((data) => setShoppingList(data.shopping_list))
        .catch(() => buildStaticShoppingList(selectedMeal, servings))
        .finally(() => setLoadingList(false));
    } else {
      buildStaticShoppingList(selectedMeal, servings);
      setLoadingList(false);
    }
  }, [selectedMeal, servings, apiAvailable]);

  function buildStaticShoppingList(meal, sv) {
    const fullMeal = STATIC_MEALS.find((m) => m.id === meal.id);
    if (!fullMeal) return;
    const ratio = sv / fullMeal.default_servings;
    const list = fullMeal.ingredients.map((ing) => ({
      ...ing,
      quantity: roundQty(parseFloat(ing.quantity) * ratio, ing.unit),
    }));
    setShoppingList(list);
  }

  function roundQty(n, unit) {
    const wholeUnits = ["Stück","Zehen","Scheiben","Kopf","Stange","EL","TL"];
    return wholeUnits.includes(unit) ? Math.max(1, Math.round(n)) : Math.round(n * 10) / 10;
  }

  const handleAddAll = useCallback((items) => {
    items.forEach((item) => addItem(item));
  }, [addItem]);

  const filtered = meals.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.cuisine?.toLowerCase().includes(search.toLowerCase());
    const matchTag    = activeTag === "Alle" || (m.tags && m.tags.includes(activeTag));
    return matchSearch && matchTag;
  });

  return (
    <div>
      {/* Search & filters */}
      <div className="card p-4 mb-5">
        <div className="relative mb-3">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <I.Search size={15} color="rgba(235,235,245,0.3)" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mahlzeit suchen…"
            className="w-full pl-9 pr-4 py-2.5 rounded-[12px] outline-none transition-all text-[14px] font-[500]"
            style={{
              background: '#2C2C2E',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#F5F5F7',
            }}
            onFocus={(e) => {
              e.target.style.background = '#3A3A3C';
              e.target.style.border = '1.5px solid #30D158';
              e.target.style.boxShadow = '0 0 0 3px rgba(48,209,88,0.12)';
            }}
            onBlur={(e) => {
              e.target.style.background = '#2C2C2E';
              e.target.style.border = '1px solid rgba(255,255,255,0.1)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className="px-3 py-1.5 rounded-[980px] text-[12px] font-[700] transition-all"
              style={activeTag === tag
                ? { background: '#30D158', color: '#000', boxShadow: '0 2px 10px rgba(48,209,88,0.35)' }
                : { background: '#2C2C2E', color: 'rgba(235,235,245,0.6)' }
              }
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {!apiAvailable && (
        <div className="flex items-center gap-2 rounded-[12px] px-3 py-2.5 mb-4 text-[12px] font-[600]"
          style={{ background: 'rgba(255,159,10,0.1)', border: '0.5px solid rgba(255,159,10,0.25)', color: '#FF9F0A' }}>
          <I.Info size={13} color="#FF9F0A" />
          Backend nicht verbunden — statische Rezeptdaten werden verwendet.
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="shimmer-bg h-48 rounded-[18px]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-[14px] font-[600]" style={{ color: 'rgba(235,235,245,0.3)' }}>
          Keine Mahlzeiten gefunden 🤔
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              isSelected={selectedMeal?.id === meal.id}
              onClick={() => {
                setSelectedMeal(meal);
                const fullMeal = STATIC_MEALS.find((m) => m.id === meal.id);
                if (fullMeal) setServings(fullMeal.default_servings);
                else setServings(meal.default_servings || 4);
              }}
            />
          ))}
        </div>
      )}

      {selectedMeal && (
        <div className="card p-4 mt-4 flex items-center gap-4">
          <span className="text-[14px] font-[700] shrink-0" style={{ color: 'rgba(235,235,245,0.6)' }}>Portionen:</span>
          <div className="flex items-center rounded-[12px] overflow-hidden"
            style={{ background: '#2C2C2E', border: '0.5px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => setServings((s) => Math.max(1, s - 1))}
              className="w-9 h-9 flex items-center justify-center font-[700] text-lg transition-colors"
              style={{ color: 'rgba(235,235,245,0.6)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >−</button>
            <span className="w-10 text-center font-[800] text-[14px]" style={{ color: '#F5F5F7' }}>{servings}</span>
            <button
              onClick={() => setServings((s) => Math.min(20, s + 1))}
              className="w-9 h-9 flex items-center justify-center font-[700] text-lg transition-colors"
              style={{ color: 'rgba(235,235,245,0.6)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >+</button>
          </div>
          <button
            onClick={() => setSelectedMeal(null)}
            className="ml-auto text-[12px] font-[600] transition-colors"
            style={{ color: 'rgba(235,235,245,0.3)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(235,235,245,0.6)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(235,235,245,0.3)'}
          >
            Auswahl aufheben ✕
          </button>
        </div>
      )}

      {selectedMeal && (
        <ShoppingListModal
          meal={selectedMeal}
          servings={servings}
          shoppingList={loadingList ? null : shoppingList}
          onClose={() => setSelectedMeal(null)}
          onAddAll={handleAddAll}
          visibleStores={visibleStores}
        />
      )}
    </div>
  );
}
