import { Search, X, Filter, Briefcase } from "lucide-react";
import { rolesDisplay, roles } from "../../utils/empleadosUtils";

/**
 * Componente de filtros para búsqueda y filtrado de empleados
 * Incluye: Campo de búsqueda por nombre/email y selector de rol
 */
const EmpleadosFilters = ({
  searchTerm,
  filterRole,
  onSearchChange,
  onRoleChange,
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
              placeholder="Nombre, email..."
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

        {/* Selector de rol */}
        <div>
          <label className="block text-sm font-medium mb-2 text-textSecondary">
            Rol
          </label>
          <div className="relative">
            <Briefcase
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary pointer-events-none"
              size={18}
            />
            <select
              value={filterRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border-2 rounded-lg focus:outline-none transition-colors border-secondary/40 text-textMain appearance-none bg-white cursor-pointer"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === "Todos"
                    ? "Todos los roles"
                    : rolesDisplay[role] || role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpleadosFilters;
