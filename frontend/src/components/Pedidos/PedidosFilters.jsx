import {
  Search,
  X,
  Filter,
  ClipboardList,
  UtensilsCrossed,
} from "lucide-react";

/**
 * Componente para filtros de pedidos
 */
const PedidosFilters = ({
  searchTerm,
  setSearchTerm,
  filterEstado,
  setFilterEstado,
  filterMesa,
  setFilterMesa,
  mesas = [],
}) => {
  const estados = [
    { value: "Todos", label: "Todos" },
    { value: "pendiente", label: "⏳ Pendiente" },
    { value: "en_preparacion", label: "👨‍🍳 En Preparación" },
    { value: "listo", label: "✅ Listo" },
    { value: "entregado", label: "📦 Entregado" },
    { value: "cancelado", label: "❌ Cancelado" },
  ];

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
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Número, cliente, mesa..."
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

        {/* Selector de estado */}
        <div>
          <label className="block text-sm font-medium mb-2 text-textSecondary">
            Estado
          </label>
          <div className="relative">
            <ClipboardList
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary pointer-events-none"
              size={18}
            />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border-2 rounded-lg focus:outline-none transition-colors border-secondary/40 text-textMain appearance-none bg-white cursor-pointer"
            >
              {estados.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selector de mesa */}
        {mesas.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2 text-textSecondary">
              Mesa
            </label>
            <div className="relative">
              <UtensilsCrossed
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary pointer-events-none"
                size={18}
              />
              <select
                value={filterMesa}
                onChange={(e) => setFilterMesa(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border-2 rounded-lg focus:outline-none transition-colors border-secondary/40 text-textMain appearance-none bg-white cursor-pointer"
              >
                <option value="Todas">Todas las mesas</option>
                {mesas.map((mesa) => (
                  <option key={mesa.id} value={mesa.numero.toString()}>
                    Mesa {mesa.numero}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidosFilters;
