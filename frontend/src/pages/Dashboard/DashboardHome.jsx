import {
  DollarSign,
  FileText,
  Table,
  Calendar,
  TrendingUp,
  Plus,
  BarChart3,
} from "lucide-react";

const DashboardHome = () => {
  const metrics = [
    {
      title: "Ventas Hoy",
      value: "$2,450",
      change: "+12.5%",
      trend: "up",
      icon: <DollarSign className="w-8 h-8" />,
    },
    {
      title: "Órdenes Activas",
      value: "24",
      change: "+3",
      trend: "up",
      icon: <FileText className="w-8 h-8" />,
    },
    {
      title: "Mesas Ocupadas",
      value: "18/25",
      change: "72%",
      trend: "neutral",
      icon: <Table className="w-8 h-8" />,
    },
    {
      title: "Reservas Hoy",
      value: "12",
      change: "+2",
      trend: "up",
      icon: <Calendar className="w-8 h-8" />,
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
            className="rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-textSecondary">
                  {metric.title}
                </p>
                <h3 className="text-3xl font-bold mt-2 text-primary">
                  {metric.value}
                </h3>
                <div className="flex items-center mt-2 gap-1">
                  {metric.trend === "up" && (
                    <TrendingUp
                      className="w-4 h-4"
                      style={{ color: "#10B981" }}
                    />
                  )}
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: metric.trend === "up" ? "#10B981" : "#7d7d7d",
                    }}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-accent/20 text-accent">
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 rounded-xl shadow-md bg-white">
          <div className="p-6 border-b border-secondary/20">
            <h3 className="text-xl font-bold text-primary">
              Órdenes Recientes
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:shadow-md transition-shadow bg-background"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-primary">{order.id}</p>
                      <p className="text-sm text-textSecondary">
                        {order.mesa} • {order.items} items
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{order.total}</p>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium mt-1"
                      style={{
                        backgroundColor:
                          order.estado === "Listo"
                            ? "#10B98120"
                            : order.estado === "Preparando"
                            ? "#e6af2e" + "20"
                            : "#35524a" + "20",
                        color:
                          order.estado === "Listo"
                            ? "#10B981"
                            : order.estado === "Preparando"
                            ? "#e6af2e"
                            : "#35524a",
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
        <div className="rounded-xl shadow-md bg-white">
          <div className="p-6 border-b border-secondary/20">
            <h3 className="text-xl font-bold text-primary">Productos Top</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-primary">{product.name}</p>
                      <p className="text-sm text-textSecondary">
                        {product.ventas} ventas
                      </p>
                    </div>
                    <p className="font-bold text-accent">{product.revenue}</p>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden bg-background">
                    <div
                      className="h-full rounded-full transition-all duration-300 bg-accent"
                      style={{
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
        <button className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left bg-primary">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent">
              <Plus className="w-6 h-6" style={{ color: "#581845" }} />
            </div>
            <div>
              <h4 className="font-bold text-white">Nuevo Pedido</h4>
              <p className="text-sm text-accent">Tomar orden de cliente</p>
            </div>
          </div>
        </button>

        <button className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left bg-secondary">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent">
              <Calendar className="w-6 h-6" style={{ color: "#581845" }} />
            </div>
            <div>
              <h4 className="font-bold text-white">Nueva Reserva</h4>
              <p className="text-sm text-accent">Agendar reservación</p>
            </div>
          </div>
        </button>

        <button className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left bg-accent">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary">
              <BarChart3 className="w-6 h-6" style={{ color: "#e6af2e" }} />
            </div>
            <div>
              <h4 className="font-bold text-primary">Ver Reportes</h4>
              <p className="text-sm text-primary/80">Análisis y estadísticas</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default DashboardHome;
