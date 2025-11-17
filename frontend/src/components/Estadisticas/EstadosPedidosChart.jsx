import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  CHART_COLORS,
  TOOLTIP_STYLES,
  PIE_CHART_CONFIG,
} from "../../utils/chartConfig";

/**
 * Componente de gráfico circular de distribución de pedidos por estado
 */
const EstadosPedidosChart = ({ stats, loading }) => {
  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={TOOLTIP_STYLES.contentStyle}>
          <p style={TOOLTIP_STYLES.labelStyle}>{payload[0].name}</p>
          <p
            style={{
              ...TOOLTIP_STYLES.itemStyle,
              color: payload[0].payload.fill,
            }}
          >
            <strong>Cantidad:</strong> {payload[0].value}
          </p>
          <p style={TOOLTIP_STYLES.itemStyle}>
            <strong>Porcentaje:</strong>{" "}
            {((payload[0].value / stats.totalPedidos) * 100).toFixed(1)}%
          </p>
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

  if (!stats) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Distribución de Pedidos
        </h3>
        <div className="h-64 flex items-center justify-center text-textSecondary">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  const data = [
    {
      name: "Pendientes",
      value: stats.pedidosPendientes || 0,
      color: CHART_COLORS.warning,
    },
    {
      name: "En Preparación",
      value: stats.pedidosEnPreparacion || 0,
      color: CHART_COLORS.info,
    },
    {
      name: "Listos",
      value: stats.pedidosListos || 0,
      color: CHART_COLORS.success,
    },
  ].filter((item) => item.value > 0);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Distribución de Pedidos Activos
        </h3>
        <div className="h-64 flex items-center justify-center text-textSecondary">
          No hay pedidos activos en este momento
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-primary mb-4">
        Distribución de Pedidos Activos
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            {...PIE_CHART_CONFIG}
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            labelLine={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>

      {/* Resumen */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          {data.map((item) => (
            <div key={item.name} className="text-center">
              <div
                className="w-4 h-4 rounded-full mx-auto mb-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <p className="text-sm text-textSecondary">{item.name}</p>
              <p className="text-xl font-bold" style={{ color: item.color }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EstadosPedidosChart;
