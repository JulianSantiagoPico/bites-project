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
  return (
    <div className="rounded-xl p-6 shadow-md bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo de búsqueda */}
        <div>
          <label className="block text-sm font-medium mb-2 text-textMain">
            Buscar Empleado
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg border-2 focus:outline-none focus:border-primary/60 transition-colors border-secondary/40 bg-background text-textMain"
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

        {/* Selector de rol */}
        <div>
          <label className="block text-sm font-medium mb-2 text-textMain">
            Filtrar por Rol
          </label>
          <select
            value={filterRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-primary/60 transition-colors border-secondary/40 bg-background cursor-pointer text-textMain"
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

      {/* Contador de resultados */}
      {(searchTerm || filterRole !== "Todos") && (
        <div className="mt-4 pt-4 border-t border-secondary/20">
          <p className="text-sm text-textSecondary">
            {searchTerm && (
              <span>
                Buscando:{" "}
                <span className="font-medium text-textMain">
                  "{searchTerm}"
                </span>
                {filterRole !== "Todos" && " · "}
              </span>
            )}
            {filterRole !== "Todos" && (
              <span>
                Rol:{" "}
                <span className="font-medium text-textMain">
                  {rolesDisplay[filterRole]}
                </span>
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmpleadosFilters;
