const StepSelector = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Paso a Paso - Elegí por categoría:
      </h2>
      <div className="flex overflow-x-auto gap-3 pb-2">
        {categories.map((category, index) => (
          <button
            key={category._id}
            onClick={() => onSelectCategory(category)}
            className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-all ${
              selectedCategory?._id === category._id
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="text-xl mr-2">{category.icon || "📦"}</span>
            <span className="text-sm font-semibold">
              {index + 1}. {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
