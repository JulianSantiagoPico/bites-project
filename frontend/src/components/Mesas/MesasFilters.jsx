const MesasFilters = ({
  searchTerm,
  setSearchTerm,
  filterUbicacion,
  setFilterUbicacion,
  filterEstado,
  setFilterEstado,
}) => {
  return (
    <div
      className="rounded-xl p-4 shadow-md"
      style={{ backgroundColor: "white" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda por número */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-textMain mb-2"
          >
            Buscar por número
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="Ej: 5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-textMain"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5"
                style={{ color: "#9CA3AF" }}
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
        </div>

        {/* Filtro por ubicación */}
        <div>
          <label
            htmlFor="ubicacion"
            className="block text-sm font-medium text-textMain mb-2"
          >
            Ubicación
          </label>
          <select
            id="ubicacion"
            value={filterUbicacion}
            onChange={(e) => setFilterUbicacion(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-textMain"
          >
            <option value="Todas">Todas las ubicaciones</option>
            <option value="Interior">🏠 Interior</option>
            <option value="Terraza">🌳 Terraza</option>
            <option value="Bar">🍷 Bar</option>
            <option value="VIP">⭐ VIP</option>
          </select>
        </div>

        {/* Filtro por estado */}
        <div>
          <label
            htmlFor="estado"
            className="block text-sm font-medium text-textMain mb-2"
          >
            Estado
          </label>
          <select
            id="estado"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-textMain"
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
  );
};

export default MesasFilters;
