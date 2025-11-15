import { Search, X, Filter, MapPin, CircleDot } from "lucide-react";

const MesasFilters = ({
  searchTerm,
  setSearchTerm,
  filterUbicacion,
  setFilterUbicacion,
  filterEstado,
  setFilterEstado,
}) => {
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div
      className="rounded-xl shadow-md p-6"
      style={{ backgroundColor: "white" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-accent" />
        <h3 className="text-lg font-semibold text-textMain">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda por número */}
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
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Número de mesa..."
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

        {/* Filtro por ubicación */}
        <div>
          <label className="block text-sm font-medium mb-2 text-textSecondary">
            Ubicación
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary pointer-events-none"
              size={18}
            />
            <select
              value={filterUbicacion}
              onChange={(e) => setFilterUbicacion(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border-2 rounded-lg focus:outline-none transition-colors border-secondary/40 text-textMain appearance-none bg-white cursor-pointer"
            >
              <option value="Todas">Todas las ubicaciones</option>
              <option value="Interior">🏠 Interior</option>
              <option value="Terraza">🌳 Terraza</option>
              <option value="Bar">🍷 Bar</option>
              <option value="VIP">⭐ VIP</option>
            </select>
          </div>
        </div>

        {/* Filtro por estado */}
        <div>
          <label className="block text-sm font-medium mb-2 text-textSecondary">
            Estado
          </label>
          <div className="relative">
            <CircleDot
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary pointer-events-none"
              size={18}
            />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border-2 rounded-lg focus:outline-none transition-colors border-secondary/40 text-textMain appearance-none bg-white cursor-pointer"
            >
              <option value="Todos">Todos los estados</option>
              <option value="disponible">✅ Disponible</option>
              <option value="ocupada">🔴 Ocupada</option>
              <option value="reservada">📅 Reservada</option>
              <option value="en_limpieza">🧹 En Limpieza</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesasFilters;
