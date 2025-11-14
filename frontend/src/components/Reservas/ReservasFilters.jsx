import { Search, X, Filter } from "lucide-react";
import { ESTADOS_RESERVA, getEstadoLabel } from "../../utils/reservasUtils";

/**
 * Componente de filtros para reservas
 */
const ReservasFilters = ({
  searchTerm,
  filterEstado,
  filterFecha,
  onSearchChange,
  onEstadoChange,
  onFechaChange,
}) => {
  const handleClearSearch = () => {
    onSearchChange("");
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
        {/* Búsqueda */}
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
              placeholder="Nombre, teléfono, email..."
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

        {/* Filtro de Estado */}
        <div>
          <label className="block text-sm font-medium mb-2 text-textSecondary">
            Estado
          </label>
          <select
            value={filterEstado}
            onChange={(e) => onEstadoChange(e.target.value)}
            className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors border-secondary/40 text-textMain"
          >
            <option value="Todos">Todos los estados</option>
            <option value={ESTADOS_RESERVA.PENDIENTE}>
              {getEstadoLabel(ESTADOS_RESERVA.PENDIENTE)}
            </option>
            <option value={ESTADOS_RESERVA.CONFIRMADA}>
              {getEstadoLabel(ESTADOS_RESERVA.CONFIRMADA)}
            </option>
            <option value={ESTADOS_RESERVA.SENTADA}>
              {getEstadoLabel(ESTADOS_RESERVA.SENTADA)}
            </option>
            <option value={ESTADOS_RESERVA.COMPLETADA}>
              {getEstadoLabel(ESTADOS_RESERVA.COMPLETADA)}
            </option>
            <option value={ESTADOS_RESERVA.CANCELADA}>
              {getEstadoLabel(ESTADOS_RESERVA.CANCELADA)}
            </option>
            <option value={ESTADOS_RESERVA.NO_SHOW}>
              {getEstadoLabel(ESTADOS_RESERVA.NO_SHOW)}
            </option>
          </select>
        </div>

        {/* Filtro de Fecha */}
        <div>
          <label className="block text-sm font-medium mb-2 text-textSecondary">
            Fecha
          </label>
          <input
            type="date"
            value={filterFecha}
            onChange={(e) => onFechaChange(e.target.value)}
            className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors border-secondary/40 text-textMain"
          />
        </div>
      </div>
    </div>
  );
};

export default ReservasFilters;
