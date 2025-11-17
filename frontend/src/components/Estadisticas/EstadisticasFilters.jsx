import { Calendar, Filter } from "lucide-react";

/**
 * Componente de filtros para estadísticas
 * Permite seleccionar período de tiempo
 */
const EstadisticasFilters = ({ periodo, onPeriodoChange, loading }) => {
  const periodos = [
    { value: "hoy", label: "Hoy" },
    { value: "ayer", label: "Ayer" },
    { value: "semana", label: "Última Semana" },
    { value: "mes", label: "Último Mes" },
    { value: "trimestre", label: "Último Trimestre" },
    { value: "año", label: "Último Año" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Título */}
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-primary">
            Período de Análisis
          </h3>
        </div>

        {/* Botones de período */}
        <div className="flex items-center gap-2 flex-wrap">
          <Calendar size={18} className="text-textSecondary" />
          {periodos.map((p) => (
            <button
              key={p.value}
              onClick={() => onPeriodoChange(p.value)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                periodo === p.value
                  ? "bg-primary text-white shadow-md"
                  : "bg-background text-textMain hover:bg-backgroundSecondary"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EstadisticasFilters;
