import { useState } from "react";

const Ordenes = () => {
  const [filterStatus, setFilterStatus] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");

  const statusOptions = [
    "Todas",
    "Nuevo",
    "Preparando",
    "Listo",
    "Entregado",
    "Cancelado",
  ];

  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      mesa: "Mesa 5",
      cliente: "Juan Pérez",
      items: [
        { name: "Hamburguesa Clásica", quantity: 2, price: 7.5 },
        { name: "Papas Fritas", quantity: 2, price: 4.5 },
        { name: "Coca Cola", quantity: 2, price: 2.5 },
      ],
      total: 29.0,
      estado: "Preparando",
      hora: "14:30",
      mesero: "Carlos López",
    },
    {
      id: "ORD-002",
      mesa: "Mesa 12",
      cliente: "María García",
      items: [
        { name: "Pizza Margherita", quantity: 1, price: 12.0 },
        { name: "Ensalada César", quantity: 2, price: 9.0 },
        { name: "Agua", quantity: 2, price: 1.5 },
      ],
      total: 33.0,
      estado: "Listo",
      hora: "14:15",
      mesero: "Ana Martínez",
    },
    {
      id: "ORD-003",
      mesa: "Mesa 3",
      cliente: "Pedro Sánchez",
      items: [
        { name: "Pasta Carbonara", quantity: 1, price: 12.0 },
        { name: "Jugo Natural", quantity: 1, price: 3.5 },
      ],
      total: 15.5,
      estado: "Nuevo",
      hora: "14:45",
      mesero: "Carlos López",
    },
    {
      id: "ORD-004",
      mesa: "Mesa 8",
      cliente: "Laura Rodríguez",
      items: [
        { name: "Alitas BBQ", quantity: 2, price: 8.5 },
        { name: "Papas Fritas", quantity: 1, price: 4.5 },
        { name: "Coca Cola", quantity: 3, price: 2.5 },
      ],
      total: 29.0,
      estado: "Preparando",
      hora: "14:35",
      mesero: "Ana Martínez",
    },
    {
      id: "ORD-005",
      mesa: "Mesa 15",
      cliente: "Roberto Díaz",
      items: [
        { name: "Cheesecake", quantity: 2, price: 5.5 },
        { name: "Helado", quantity: 1, price: 4.0 },
      ],
      total: 15.0,
      estado: "Entregado",
      hora: "14:00",
      mesero: "Carlos López",
    },
  ]);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "Todas" || order.estado === filterStatus;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.mesa.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors_map = {
      Nuevo: { bg: "#3B82F620", color: "#3B82F6" },
      Preparando: { bg: "#F59E0B20", color: "#F59E0B" },
      Listo: { bg: "#10B98120", color: "#10B981" },
      Entregado: { bg: "#6B728020", color: "#6B7280" },
      Cancelado: { bg: "#EF444420", color: "#EF4444" },
    };
    return colors_map[status] || { bg: "#6B728020", color: "#6B7280" };
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, estado: newStatus } : order
      )
    );
  };

  const [selectedOrder, setSelectedOrder] = useState(null);

  const OrderDetailModal = ({ order, onClose }) => (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "white" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-primary">
              Orden {order.id}
            </h3>
            <p className="text-sm text-textSecondary">
              {order.hora} • {order.mesero}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-textMain"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-background">
              <p className="text-sm mb-1 text-textSecondary">Mesa</p>
              <p className="font-bold text-primary">{order.mesa}</p>
            </div>
            <div className="p-4 rounded-lg bg-background">
              <p className="text-sm mb-1 text-textSecondary">Cliente</p>
              <p className="font-bold text-primary">{order.cliente}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="font-bold mb-3 text-primary">Productos</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-background"
                >
                  <div className="flex-1">
                    <p className="font-medium text-primary">{item.name}</p>
                    <p className="text-sm text-textSecondary">
                      ${item.price.toFixed(2)} c/u
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-textMain">
                      x{item.quantity}
                    </p>
                    <p className="font-bold text-accent">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="p-4 rounded-lg border-2 border-accent bg-accent/10">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">Total</span>
              <span className="text-2xl font-bold text-accent">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Status Actions */}
          <div>
            <h4 className="font-bold mb-3 text-primary">Cambiar Estado</h4>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions
                .filter((s) => s !== "Todas")
                .map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      updateOrderStatus(order.id, status);
                      onClose();
                    }}
                    className="px-4 py-3 rounded-lg font-medium transition-all"
                    style={{
                      backgroundColor:
                        order.estado === status
                          ? getStatusColor(status).bg
                          : "#faf3e0",
                      color:
                        order.estado === status
                          ? getStatusColor(status).color
                          : "#4a4a4a",
                      border: `2px solid ${
                        order.estado === status
                          ? getStatusColor(status).color
                          : "transparent"
                      }`,
                    }}
                  >
                    {status}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Órdenes</h2>
          <p className="text-textSecondary">
            Gestiona todas las órdenes del restaurante
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusOptions
          .filter((s) => s !== "Todas")
          .map((status) => {
            const count = orders.filter((o) => o.estado === status).length;
            const statusColor = getStatusColor(status);
            return (
              <div
                key={status}
                className="rounded-xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                style={{ backgroundColor: "white" }}
                onClick={() => setFilterStatus(status)}
              >
                <p className="text-sm mb-1 text-textSecondary">{status}</p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: statusColor.color }}
                >
                  {count}
                </p>
              </div>
            );
          })}
      </div>

      {/* Filters */}
      <div
        className="rounded-xl p-6 shadow-md"
        style={{ backgroundColor: "white" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-text">
              Buscar Orden
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por ID, cliente o mesa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border-2 focus:outline-none transition-colors border-secondary/40 bg-background"
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

          <div>
            <label className="block text-sm font-medium mb-2 text-textMain">
              Filtrar por Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors border-secondary/40 bg-background"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => {
          const statusColor = getStatusColor(order.estado);
          return (
            <div
              key={order.id}
              className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: "white" }}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-primary">{order.id}</h3>
                  <p className="text-sm text-textSecondary">{order.hora}</p>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: statusColor.bg,
                    color: statusColor.color,
                  }}
                >
                  {order.estado}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-textSecondary"
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
                  <span className="text-sm text-textMain">{order.mesa}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-textSecondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-sm text-textMain">{order.cliente}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-textSecondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <span className="text-sm text-textMain">
                    {order.items.length} productos
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t flex items-center justify-between border-secondary/20">
                <span className="text-sm text-textSecondary">Total</span>
                <span className="text-xl font-bold text-accent">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div
          className="text-center py-12 rounded-xl"
          style={{ backgroundColor: "white" }}
        >
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg font-medium text-textMain">
            No se encontraron órdenes
          </p>
          <p className="text-textSecondary">
            Intenta con otros filtros de búsqueda
          </p>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Ordenes;
