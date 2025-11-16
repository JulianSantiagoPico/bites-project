import { Filter } from "lucide-react";

/**
 * Componente de filtros para el módulo de cocina
 */
const CocinaFilters = ({ filterEstado, onFilterChange }) => {
  const estados = [
    { value: "Todos", label: "Todos", color: "#4a4a4a" },
    { value: "pendiente", label: "Pendientes", color: "#e6af2e" },
    { value: "en_preparacion", label: "En Preparación", color: "#581845" },
  ];

  return (
    <div className="rounded-xl shadow-md p-4 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-accent" />
        <h3 className="text-lg font-semibold text-textMain">Filtros</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {estados.map((estado) => (
          <button
            key={estado.value}
            onClick={() => onFilterChange(estado.value)}
            className="px-4 py-2 rounded-lg font-medium transition-all text-sm"
            style={{
              backgroundColor:
                filterEstado === estado.value
                  ? estado.color
                  : "rgba(107, 114, 128, 0.1)",
              color: filterEstado === estado.value ? "white" : estado.color,
              border: `2px solid ${
                filterEstado === estado.value
                  ? estado.color
                  : "rgba(107, 114, 128, 0.2)"
              }`,
            }}
          >
            {estado.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CocinaFilters;
