import { Search, X, Filter, Tag, Plus } from "lucide-react";
import { CATEGORIAS } from "../../utils/productosUtils";

/**
 * Componente de filtros para el módulo de Productos
 * Permite buscar por texto y filtrar por categoría
 */
const ProductosFilters = ({
  searchTerm,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  onAddNew,
}) => {
  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: "white" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-textMain">Filtros</h3>
        </div>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90 bg-primary"
        >
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo de búsqueda */}
        <div>
          <label className="block text-sm font-medium mb-2 text-textSecondary">
            Buscar
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Nombre, descripción, tags..."
              className="w-full pl-10 pr-10 py-2 border-2 rounded-lg focus:outline-none transition-colors text-textMain border-secondary/40"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <X size={16} className="text-textSecondary" />
              </button>
            )}
          </div>
        </div>

        {/* Selector de categoría */}
        <div>
          <label className="block text-sm font-medium mb-2 text-textSecondary">
            Categoría
          </label>
          <div className="relative">
            <Tag
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary pointer-events-none"
              size={18}
            />
            <select
              value={filterCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border-2 rounded-lg focus:outline-none transition-colors border-secondary/40 text-textMain appearance-none bg-white cursor-pointer"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductosFilters;
