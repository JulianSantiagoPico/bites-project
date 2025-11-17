import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  CHART_COLORS,
  TOOLTIP_STYLES,
  LEGEND_STYLES,
  GRID_STYLES,
  AXIS_STYLES,
  LINE_CHART_CONFIG,
  formatCurrency,
  formatDateShort,
} from "../../utils/chartConfig";

/**
 * Componente de gráfico de ventas por día
 */
const VentasChart = ({ data, loading }) => {
  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={TOOLTIP_STYLES.contentStyle}>
          <p style={TOOLTIP_STYLES.labelStyle}>{formatDateShort(label)}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              style={{ ...TOOLTIP_STYLES.itemStyle, color: entry.color }}
            >
              <strong>{entry.name}:</strong> {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Tendencia de Ventas
        </h3>
        <div className="h-64 flex items-center justify-center text-textSecondary">
          No hay datos de ventas para mostrar
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-primary mb-4">
        Tendencia de Ventas
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid {...GRID_STYLES} />
          <XAxis
            dataKey="fecha"
            tickFormatter={formatDateShort}
            {...AXIS_STYLES}
          />
          <YAxis tickFormatter={formatCurrency} {...AXIS_STYLES} />
          <Tooltip content={<CustomTooltip />} />
          <Legend {...LEGEND_STYLES} />
          <Line
            {...LINE_CHART_CONFIG}
            name="Ventas"
            dataKey="ventas"
            stroke={CHART_COLORS.primary}
          />
          <Line
            {...LINE_CHART_CONFIG}
            name="Propinas"
            dataKey="propinas"
            stroke={CHART_COLORS.accent}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Resumen */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-textSecondary">Total Ventas</p>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(data.reduce((sum, item) => sum + item.ventas, 0))}
            </p>
          </div>
          <div>
            <p className="text-sm text-textSecondary">Total Propinas</p>
            <p className="text-lg font-bold text-accent">
              {formatCurrency(
                data.reduce((sum, item) => sum + item.propinas, 0)
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-textSecondary">Pedidos</p>
            <p className="text-lg font-bold text-secondary">
              {data.reduce((sum, item) => sum + item.pedidos, 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-textSecondary">Promedio/Día</p>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(
                data.reduce((sum, item) => sum + item.ventas, 0) / data.length
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentasChart;
