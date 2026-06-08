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

  // Load meals — try API first, fall back to static data
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

  // Load shopping list when a meal is selected
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

  // Filtered meals
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
            <I.Search size={15} color="#9ca3af" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mahlzeit suchen…"
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTag === tag
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                  : "bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Status badge */}
      {!apiAvailable && (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4 font-semibold">
          <I.Info size={13} color="#b45309" />
          Backend nicht verbunden — statische Rezeptdaten werden verwendet.
        </div>
      )}

      {/* Meal grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="shimmer-bg h-48 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-gray-400 text-sm font-semibold">
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

      {/* Servings panel — shown below grid when a meal is selected */}
      {selectedMeal && (
        <div className="card p-4 mt-4 flex items-center gap-4">
          <span className="text-sm font-bold text-gray-600 shrink-0">Portionen:</span>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setServings((s) => Math.max(1, s - 1))}
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-200 font-bold text-lg transition-colors"
            >−</button>
            <span className="w-10 text-center font-extrabold text-gray-800 text-sm">{servings}</span>
            <button
              onClick={() => setServings((s) => Math.min(20, s + 1))}
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-200 font-bold text-lg transition-colors"
            >+</button>
          </div>
          <button
            onClick={() => setSelectedMeal(null)}
            className="ml-auto text-xs text-gray-400 hover:text-gray-600 font-semibold"
          >
            Auswahl aufheben ✕
          </button>
        </div>
      )}

      {/* Shopping list modal */}
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
