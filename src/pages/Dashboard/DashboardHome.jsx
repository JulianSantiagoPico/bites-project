import colors from "../../styles/colors";

const DashboardHome = () => {
  const metrics = [
    {
      title: "Ventas Hoy",
      value: "$2,450",
      change: "+12.5%",
      trend: "up",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Órdenes Activas",
      value: "24",
      change: "+3",
      trend: "up",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "Mesas Ocupadas",
      value: "18/25",
      change: "72%",
      trend: "neutral",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Reservas Hoy",
      value: "12",
      change: "+2",
      trend: "up",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      mesa: "Mesa 5",
      items: 3,
      total: "$45.00",
      estado: "Preparando",
      tiempo: "10 min",
    },
    {
      id: "ORD-002",
      mesa: "Mesa 12",
      items: 5,
      total: "$78.50",
      estado: "Listo",
      tiempo: "15 min",
    },
    {
      id: "ORD-003",
      mesa: "Mesa 3",
      items: 2,
      total: "$32.00",
      estado: "Nuevo",
      tiempo: "2 min",
    },
    {
      id: "ORD-004",
      mesa: "Mesa 8",
      items: 4,
      total: "$56.00",
      estado: "Preparando",
      tiempo: "8 min",
    },
  ];

  const topProducts = [
    { name: "Hamburguesa Clásica", ventas: 45, revenue: "$337.50" },
    { name: "Pizza Margherita", ventas: 38, revenue: "$456.00" },
    { name: "Pasta Carbonara", ventas: 32, revenue: "$384.00" },
    { name: "Ensalada César", ventas: 28, revenue: "$252.00" },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            style={{ backgroundColor: "white" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  {metric.title}
                </p>
                <h3
                  className="text-3xl font-bold mt-2"
                  style={{ color: colors.primary }}
                >
                  {metric.value}
                </h3>
                <div className="flex items-center mt-2 gap-1">
                  {metric.trend === "up" && (
                    <svg
                      className="w-4 h-4"
                      style={{ color: "#10B981" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  )}
                  <span
                    className="text-sm font-medium"
                    style={{
                      color:
                        metric.trend === "up"
                          ? "#10B981"
                          : colors.textSecondary,
                    }}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: colors.accent + "20",
                  color: colors.accent,
                }}
              >
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div
          className="lg:col-span-2 rounded-xl shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <div
            className="p-6 border-b"
            style={{ borderColor: colors.secondary + "20" }}
          >
            <h3 className="text-xl font-bold" style={{ color: colors.primary }}>
              Órdenes Recientes
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:shadow-md transition-shadow"
                  style={{ backgroundColor: colors.background }}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p
                        className="font-semibold"
                        style={{ color: colors.primary }}
                      >
                        {order.id}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.textSecondary }}
                      >
                        {order.mesa} • {order.items} items
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold" style={{ color: colors.primary }}>
                      {order.total}
                    </p>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium mt-1"
                      style={{
                        backgroundColor:
                          order.estado === "Listo"
                            ? "#10B98120"
                            : order.estado === "Preparando"
                            ? colors.accent + "20"
                            : colors.secondary + "20",
                        color:
                          order.estado === "Listo"
                            ? "#10B981"
                            : order.estado === "Preparando"
                            ? colors.accent
                            : colors.secondary,
                      }}
                    >
                      {order.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div
          className="rounded-xl shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <div
            className="p-6 border-b"
            style={{ borderColor: colors.secondary + "20" }}
          >
            <h3 className="text-xl font-bold" style={{ color: colors.primary }}>
              Productos Top
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p
                        className="font-medium"
                        style={{ color: colors.primary }}
                      >
                        {product.name}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.textSecondary }}
                      >
                        {product.ventas} ventas
                      </p>
                    </div>
                    <p className="font-bold" style={{ color: colors.accent }}>
                      {product.revenue}
                    </p>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.background }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: colors.accent,
                        width: `${(product.ventas / 50) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left"
          style={{ backgroundColor: colors.primary }}
        >
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: colors.accent }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke={colors.primary}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-white">Nuevo Pedido</h4>
              <p className="text-sm" style={{ color: colors.accent }}>
                Tomar orden de cliente
              </p>
            </div>
          </div>
        </button>

        <button
          className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left"
          style={{ backgroundColor: colors.secondary }}
        >
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: colors.accent }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke={colors.secondary}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-white">Nueva Reserva</h4>
              <p className="text-sm" style={{ color: colors.accent }}>
                Agendar reservación
              </p>
            </div>
          </div>
        </button>

        <button
          className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left"
          style={{ backgroundColor: colors.accent }}
        >
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: colors.primary }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke={colors.accent}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold" style={{ color: colors.primary }}>
                Ver Reportes
              </h4>
              <p className="text-sm" style={{ color: colors.primary + "CC" }}>
                Análisis y estadísticas
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default DashboardHome;
