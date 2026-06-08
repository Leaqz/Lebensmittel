export default function MealCard({ meal, isSelected, onClick }) {
  const tags = meal.tags ? meal.tags.split(",").slice(0, 3) : [];
  const totalTime = (meal.prep_time_min || 0) + (meal.cook_time_min || 0);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border-2 transition-all duration-200 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] ${
        isSelected
          ? "border-emerald-400 bg-emerald-50 shadow-md shadow-emerald-100"
          : "border-gray-100 bg-white hover:border-emerald-200"
      }`}
    >
      {/* Emoji header */}
      <div
        className="flex items-center justify-center rounded-t-2xl py-6 text-5xl"
        style={{ background: isSelected ? "#d1fae5" : "#f9fafb" }}
      >
        {meal.image_emoji}
      </div>

      <div className="p-4">
        <h3 className="font-extrabold text-gray-800 text-sm leading-snug mb-1">
          {meal.name_de || meal.name}
        </h3>

        <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">
          {meal.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((t) => (
            <span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
          <span>⏱ {totalTime} Min.</span>
          <span>👤 {meal.default_servings} P.</span>
          <span>🥄 {(meal.ingredient_count ?? meal.ingredients?.length ?? 0)} Zutaten</span>
        </div>

        {meal.cuisine && (
          <div className="mt-2 text-xs text-emerald-600 font-bold">
            {meal.cuisine}
          </div>
        )}
      </div>
    </button>
  );
}
