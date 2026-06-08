export default function MealCard({ meal, isSelected, onClick }) {
  const tags = meal.tags ? meal.tags.split(",").slice(0, 3) : [];
  const totalTime = (meal.prep_time_min || 0) + (meal.cook_time_min || 0);

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-[18px] transition-all duration-200 hover:scale-[1.015] active:scale-[0.99] overflow-hidden"
      style={isSelected ? {
        boxShadow: '0 0 0 2px #30D158, 0 8px 28px rgba(48,209,88,0.18)',
        background: '#fff',
      } : {
        background: '#fff',
        boxShadow: '0 0 0 0.5px rgba(0,0,0,0.06), 0 2px 10px rgba(0,0,0,0.05)',
      }}
    >
      {/* Emoji header */}
      <div
        className="flex items-center justify-center py-6 text-5xl"
        style={{ background: isSelected ? 'rgba(48,209,88,0.08)' : '#F5F5F7' }}
      >
        {meal.image_emoji}
      </div>

      <div className="p-4">
        <h3 className="font-[800] text-[14px] leading-snug mb-1" style={{ color: '#1D1D1F' }}>
          {meal.name_de || meal.name}
        </h3>

        <p className="text-[12px] mb-3 line-clamp-2 leading-relaxed" style={{ color: '#AEAEB2' }}>
          {meal.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((t) => (
            <span key={t} className="text-[11px] font-[500] px-2 py-0.5 rounded-full"
              style={{ background: '#F2F2F7', color: '#6E6E73' }}>
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] font-[600]" style={{ color: '#AEAEB2' }}>
          <span>⏱ {totalTime} Min.</span>
          <span>👤 {meal.default_servings} P.</span>
          <span>🥄 {(meal.ingredient_count ?? meal.ingredients?.length ?? 0)}</span>
        </div>

        {meal.cuisine && (
          <div className="mt-2 text-[11px] font-[700]" style={{ color: '#30D158' }}>
            {meal.cuisine}
          </div>
        )}
      </div>
    </button>
  );
}
