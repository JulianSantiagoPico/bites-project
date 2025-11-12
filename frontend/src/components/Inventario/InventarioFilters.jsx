/**
 * Componente de filtros para el inventario
 * Incluye: Búsqueda por nombre y filtro por categoría
 */
const InventarioFilters = ({
  searchTerm,
  filterCategory,
  onSearchChange,
  onCategoryChange,
}) => {
  const categories = [
    "Todo",
    "Carnes",
    "Vegetales",
    "Lácteos",
    "Bebidas",
    "Especias",
    "Otros",
  ];

  return (
    <div className="rounded-xl p-6 shadow-md bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium mb-2 text-textMain">
            Buscar Producto
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg border-2 focus:outline-none transition-colors border-secondary/40 bg-background text-textMain"
            />
            <svg
              className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filtro por categoría */}
        <div>
          <label className="block text-sm font-medium mb-2 text-textMain">
            Filtrar por Categoría
          </label>
          <select
            value={filterCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors border-secondary/40 bg-background text-textMain"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default InventarioFilters;
