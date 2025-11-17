import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CHART_COLORS,
  TOOLTIP_STYLES,
  GRID_STYLES,
  AXIS_STYLES,
  AREA_CHART_CONFIG,
  formatCurrency,
} from "../../utils/chartConfig";

/**
 * Componente de gráfico de ventas por hora (horas pico)
 */
const OcupacionChart = ({ data, loading }) => {
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
              <strong>{entry.name}:</strong> {formatCurrency(entry.value)}
              <br />
              <span className="text-xs">{entry.payload.pedidos} pedidos</span>
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
          Ventas por Hora
        </h3>
        <div className="h-64 flex items-center justify-center text-textSecondary">
          No hay datos de ventas por hora para mostrar
        </div>
      </div>
    );
  }

  // Filtrar solo las horas con actividad
  const dataConActividad = data.filter((item) => item.ventas > 0);

  // Encontrar la hora pico
  const horaPico = data.reduce(
    (max, item) => (item.ventas > max.ventas ? item : max),
    data[0]
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">
          Ventas por Hora - Horas Pico
        </h3>
        {horaPico && horaPico.ventas > 0 && (
          <div className="text-right">
            <p className="text-sm text-textSecondary">Hora Pico</p>
            <p className="text-lg font-bold text-accent">{horaPico.hora}</p>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={CHART_COLORS.primary}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={CHART_COLORS.primary}
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID_STYLES} />
          <XAxis dataKey="hora" {...AXIS_STYLES} />
          <YAxis tickFormatter={formatCurrency} {...AXIS_STYLES} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            {...AREA_CHART_CONFIG}
            name="Ventas"
            dataKey="ventas"
            stroke={CHART_COLORS.primary}
            fill="url(#colorVentas)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Estadísticas adicionales */}
      {dataConActividad.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-textSecondary">Horas Activas</p>
              <p className="text-lg font-bold text-primary">
                {dataConActividad.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-textSecondary">Total Ventas</p>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(
                  data.reduce((sum, item) => sum + item.ventas, 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-textSecondary">Total Pedidos</p>
              <p className="text-lg font-bold text-secondary">
                {data.reduce((sum, item) => sum + item.pedidos, 0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OcupacionChart;
