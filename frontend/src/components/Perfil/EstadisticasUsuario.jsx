import {
  BarChart3,
  ShoppingBag,
  Calendar,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  Package,
} from "lucide-react";

export const EstadisticasUsuario = ({ stats, rol }) => {
  if (!stats) return null;

  // Normalizar el rol a mayúsculas para la comparación
  const rolNormalizado = rol?.toUpperCase();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  // Estadísticas para ADMIN
  const renderAdminStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Pedidos"
        value={stats.totalPedidos || 0}
        icon={ShoppingBag}
        color="from-[#581845] to-[#900c3f]"
        bgColor="bg-purple-50"
      />
      <StatCard
        title="Ingresos Totales"
        value={formatCurrency(stats.ingresosTotales || 0)}
        icon={DollarSign}
        color="from-[#35524a] to-[#2d4a43]"
        bgColor="bg-green-50"
      />
      <StatCard
        title="Total Reservas"
        value={stats.totalReservas || 0}
        icon={Calendar}
        color="from-[#e6af2e] to-[#d89a1a]"
        bgColor="bg-yellow-50"
      />
      <StatCard
        title="Total Empleados"
        value={stats.totalEmpleados || 0}
        icon={Users}
        color="from-[#6bbf59] to-[#5aa649]"
        bgColor="bg-green-50"
      />
    </div>
  );

  // Estadísticas para MESERO
  const renderMeseroStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Pedidos Asignados"
        value={stats.pedidosAsignados || 0}
        icon={ShoppingBag}
        color="from-[#581845] to-[#900c3f]"
        bgColor="bg-purple-50"
      />
      <StatCard
        title="Pedidos Completados"
        value={stats.pedidosCompletados || 0}
        icon={TrendingUp}
        color="from-[#6bbf59] to-[#5aa649]"
        bgColor="bg-green-50"
      />
      <StatCard
        title="Mesas Atendidas"
        value={stats.mesasAtendidas || 0}
        icon={Users}
        color="from-[#35524a] to-[#2d4a43]"
        bgColor="bg-green-50"
      />
    </div>
  );

  // Estadísticas para COCINERO
  const renderCocineroStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard
        title="Pedidos Preparados"
        value={stats.pedidosPreparados || 0}
        icon={Package}
        color="from-[#e6af2e] to-[#d89a1a]"
        bgColor="bg-yellow-50"
      />
      <StatCard
        title="En Preparación"
        value={stats.enPreparacion || 0}
        icon={Clock}
        color="from-[#ffd166] to-[#f0c04b]"
        bgColor="bg-yellow-50"
      />
    </div>
  );

  // Estadísticas para GERENTE
  const renderGerenteStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Pedidos"
        value={stats.totalPedidos || 0}
        icon={ShoppingBag}
        color="from-[#581845] to-[#900c3f]"
        bgColor="bg-purple-50"
      />
      <StatCard
        title="Ingresos"
        value={formatCurrency(stats.ingresosTotales || 0)}
        icon={DollarSign}
        color="from-[#6bbf59] to-[#5aa649]"
        bgColor="bg-green-50"
      />
      <StatCard
        title="Reservas Activas"
        value={stats.reservasActivas || 0}
        icon={Calendar}
        color="from-[#e6af2e] to-[#d89a1a]"
        bgColor="bg-yellow-50"
      />
      <StatCard
        title="Productos Más Vendidos"
        value={stats.topProductos || 0}
        icon={TrendingUp}
        color="from-[#ffd166] to-[#f0c04b]"
        bgColor="bg-yellow-50"
      />
    </div>
  );

  // Estadísticas para CAJERO
  const renderCajeroStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Transacciones Procesadas"
        value={stats.transaccionesProcesadas || 0}
        icon={ShoppingBag}
        color="from-[#581845] to-[#900c3f]"
        bgColor="bg-purple-50"
      />
      <StatCard
        title="Ingresos Cobrados"
        value={formatCurrency(stats.ingresosCobrados || 0)}
        icon={DollarSign}
        color="from-[#6bbf59] to-[#5aa649]"
        bgColor="bg-green-50"
      />
      <StatCard
        title="Promedio por Venta"
        value={formatCurrency(stats.promedioVenta || 0)}
        icon={TrendingUp}
        color="from-[#e6af2e] to-[#d89a1a]"
        bgColor="bg-yellow-50"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-linear-to-r from-secondary to-[#2d4a43] px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Mis Estadísticas
        </h2>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {rolNormalizado === "ADMIN" && renderAdminStats()}
        {rolNormalizado === "MESERO" && renderMeseroStats()}
        {rolNormalizado === "COCINERO" && renderCocineroStats()}
        {rolNormalizado === "GERENTE" && renderGerenteStats()}
        {rolNormalizado === "CAJERO" && renderCajeroStats()}
        {!["ADMIN", "MESERO", "COCINERO", "GERENTE", "CAJERO"].includes(
          rolNormalizado
        ) && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No hay estadísticas disponibles para tu rol
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente auxiliar para tarjetas de estadísticas
const StatCard = ({ title, value, icon: Icon, color, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-lg p-4 border border-gray-200`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg bg-linear-to-r ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
};
