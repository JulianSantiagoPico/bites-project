import {
  BarChart,
  Bar,
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
  BAR_CHART_CONFIG,
  formatCurrency,
} from "../../utils/chartConfig";

/**
 * Componente de gráfico de top productos más vendidos
 */
const ProductosChart = ({ data, loading }) => {
  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={TOOLTIP_STYLES.contentStyle}>
          <p style={TOOLTIP_STYLES.labelStyle}>{label}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              style={{ ...TOOLTIP_STYLES.itemStyle, color: entry.color }}
            >
              <strong>{entry.name}:</strong>{" "}
              {entry.dataKey === "ingresos"
                ? formatCurrency(entry.value)
                : entry.value}
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
          <div className="h-80 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Top Productos Más Vendidos
        </h3>
        <div className="h-80 flex items-center justify-center text-textSecondary">
          No hay datos de productos para mostrar
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-primary mb-4">
        Top Productos Más Vendidos
      </h3>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} layout="horizontal">
          <CartesianGrid {...GRID_STYLES} />
          <XAxis type="category" dataKey="nombre" {...AXIS_STYLES} />
          <YAxis
            type="number"
            tickFormatter={formatCurrency}
            {...AXIS_STYLES}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend {...LEGEND_STYLES} />
          <Bar
            {...BAR_CHART_CONFIG}
            name="Ingresos"
            dataKey="ingresos"
            fill={CHART_COLORS.primary}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Lista detallada */}
      <div className="mt-6 space-y-3">
        {data.slice(0, 5).map((producto, index) => (
          <div
            key={producto.productoId}
            className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-backgroundSecondary transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{producto.imagen || "🍽️"}</span>
              <div>
                <p className="font-medium text-textMain">{producto.nombre}</p>
                <p className="text-sm text-textSecondary">
                  {producto.categoria}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">
                {formatCurrency(producto.ingresos)}
              </p>
              <p className="text-sm text-textSecondary">
                {producto.cantidadVendida} vendidos
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductosChart;
