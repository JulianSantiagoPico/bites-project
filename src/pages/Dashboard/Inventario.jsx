import { useState } from "react";
import colors from "../../styles/colors";

const Inventario = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todo");

  const categories = [
    "Todo",
    "Carnes",
    "Vegetales",
    "Lácteos",
    "Bebidas",
    "Especias",
    "Otros",
  ];

  const [inventory] = useState([
    {
      id: 1,
      nombre: "Carne de Res",
      categoria: "Carnes",
      cantidad: 25,
      unidad: "kg",
      minimo: 10,
      precio: 8.5,
      proveedor: "Carnes Premium",
      estado: "Normal",
    },
    {
      id: 2,
      nombre: "Pollo",
      categoria: "Carnes",
      cantidad: 30,
      unidad: "kg",
      minimo: 15,
      precio: 5.0,
      proveedor: "Avícola del Valle",
      estado: "Normal",
    },
    {
      id: 3,
      nombre: "Lechuga",
      categoria: "Vegetales",
      cantidad: 8,
      unidad: "kg",
      minimo: 10,
      precio: 2.0,
      proveedor: "Verduras Frescas",
      estado: "Bajo Stock",
    },
    {
      id: 4,
      nombre: "Tomate",
      categoria: "Vegetales",
      cantidad: 15,
      unidad: "kg",
      minimo: 8,
      precio: 2.5,
      proveedor: "Verduras Frescas",
      estado: "Normal",
    },
    {
      id: 5,
      nombre: "Queso Mozzarella",
      categoria: "Lácteos",
      cantidad: 12,
      unidad: "kg",
      minimo: 5,
      precio: 7.0,
      proveedor: "Lácteos La Granja",
      estado: "Normal",
    },
    {
      id: 6,
      nombre: "Leche",
      categoria: "Lácteos",
      cantidad: 20,
      unidad: "litros",
      minimo: 15,
      precio: 1.2,
      proveedor: "Lácteos La Granja",
      estado: "Normal",
    },
    {
      id: 7,
      nombre: "Coca Cola",
      categoria: "Bebidas",
      cantidad: 3,
      unidad: "cajas",
      minimo: 5,
      precio: 24.0,
      proveedor: "Distribuidora Bebidas",
      estado: "Bajo Stock",
    },
    {
      id: 8,
      nombre: "Agua Embotellada",
      categoria: "Bebidas",
      cantidad: 15,
      unidad: "cajas",
      minimo: 8,
      precio: 12.0,
      proveedor: "Distribuidora Bebidas",
      estado: "Normal",
    },
    {
      id: 9,
      nombre: "Sal",
      categoria: "Especias",
      cantidad: 5,
      unidad: "kg",
      minimo: 3,
      precio: 1.5,
      proveedor: "Especias del Mundo",
      estado: "Normal",
    },
    {
      id: 10,
      nombre: "Pimienta",
      categoria: "Especias",
      cantidad: 2,
      unidad: "kg",
      minimo: 2,
      precio: 8.0,
      proveedor: "Especias del Mundo",
      estado: "Bajo Stock",
    },
    {
      id: 11,
      nombre: "Aceite de Oliva",
      categoria: "Otros",
      cantidad: 8,
      unidad: "litros",
      minimo: 5,
      precio: 12.0,
      proveedor: "Importadora Gourmet",
      estado: "Normal",
    },
    {
      id: 12,
      nombre: "Harina",
      categoria: "Otros",
      cantidad: 1,
      unidad: "kg",
      minimo: 10,
      precio: 1.8,
      proveedor: "Molino San José",
      estado: "Crítico",
    },
  ]);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "Todo" || item.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (estado) => {
    const statusColors = {
      Normal: { bg: "#10B98120", color: "#10B981" },
      "Bajo Stock": { bg: "#F59E0B20", color: "#F59E0B" },
      Crítico: { bg: "#EF444420", color: "#EF4444" },
      Agotado: { bg: "#6B728020", color: "#6B7280" },
    };
    return statusColors[estado] || statusColors["Normal"];
  };

  const InventoryModal = () => (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={() => setShowModal(false)}
    >
      <div
        className="rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "white" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold" style={{ color: colors.primary }}>
            Agregar al Inventario
          </h3>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
            style={{ color: colors.text }}
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

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Nombre del Producto *
              </label>
              <input
                type="text"
                placeholder="Ej: Tomate Cherry"
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Categoría *
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              >
                {categories
                  .filter((c) => c !== "Todo")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Proveedor
              </label>
              <input
                type="text"
                placeholder="Nombre del proveedor"
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Cantidad *
              </label>
              <input
                type="number"
                placeholder="0"
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Unidad de Medida *
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              >
                <option value="kg">Kilogramos (kg)</option>
                <option value="litros">Litros</option>
                <option value="unidades">Unidades</option>
                <option value="cajas">Cajas</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Stock Mínimo *
              </label>
              <input
                type="number"
                placeholder="0"
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Precio Unitario ($) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-3 rounded-lg font-medium border-2 hover:bg-gray-50 transition-colors"
              style={{
                borderColor: colors.secondary + "40",
                color: colors.text,
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: colors.primary }}
            >
              Agregar Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: colors.primary }}>
            Inventario
          </h2>
          <p style={{ color: colors.textSecondary }}>
            Control de stock y suministros
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2"
          style={{ backgroundColor: colors.primary }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Agregar Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>
            Total Items
          </p>
          <p className="text-3xl font-bold" style={{ color: colors.primary }}>
            {inventory.length}
          </p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>
            Stock Normal
          </p>
          <p className="text-3xl font-bold" style={{ color: "#10B981" }}>
            {inventory.filter((i) => i.estado === "Normal").length}
          </p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>
            Bajo Stock
          </p>
          <p className="text-3xl font-bold" style={{ color: "#F59E0B" }}>
            {inventory.filter((i) => i.estado === "Bajo Stock").length}
          </p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>
            Crítico/Agotado
          </p>
          <p className="text-3xl font-bold" style={{ color: "#EF4444" }}>
            {
              inventory.filter(
                (i) => i.estado === "Crítico" || i.estado === "Agotado"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Alerts */}
      {inventory.filter(
        (i) => i.estado === "Crítico" || i.estado === "Bajo Stock"
      ).length > 0 && (
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{
            backgroundColor: "#F59E0B20",
            borderLeft: `4px solid #F59E0B`,
          }}
        >
          <svg
            className="w-6 h-6 shrink-0 mt-0.5"
            style={{ color: "#F59E0B" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="font-bold" style={{ color: "#F59E0B" }}>
              Alerta de Stock
            </p>
            <p className="text-sm" style={{ color: colors.text }}>
              Hay{" "}
              {
                inventory.filter(
                  (i) => i.estado === "Crítico" || i.estado === "Bajo Stock"
                ).length
              }{" "}
              productos que requieren reposición
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div
        className="rounded-xl p-6 shadow-md"
        style={{ backgroundColor: "white" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              Buscar Producto
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              />
              <svg
                className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2"
                style={{ color: colors.textSecondary }}
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
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              Filtrar por Categoría
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
              style={{
                borderColor: colors.secondary + "40",
                backgroundColor: colors.background,
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div
        className="rounded-xl shadow-md overflow-hidden"
        style={{ backgroundColor: "white" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: colors.primary }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Producto
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Categoría
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Cantidad
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Mínimo
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Precio
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Proveedor
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, index) => {
                const statusColor = getStatusColor(item.estado);
                const percentage = (item.cantidad / item.minimo) * 100;
                return (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? "white" : colors.background,
                      borderBottom: `1px solid ${colors.secondary}20`,
                    }}
                  >
                    <td
                      className="px-6 py-4 font-medium"
                      style={{ color: colors.primary }}
                    >
                      {item.nombre}
                    </td>
                    <td className="px-6 py-4" style={{ color: colors.text }}>
                      {item.categoria}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: colors.primary }}
                        >
                          {item.cantidad} {item.unidad}
                        </p>
                        <div
                          className="w-24 h-2 rounded-full mt-1 overflow-hidden"
                          style={{ backgroundColor: colors.background }}
                        >
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              backgroundColor: statusColor.color,
                              width: `${Math.min(percentage, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4"
                      style={{ color: colors.textSecondary }}
                    >
                      {item.minimo} {item.unidad}
                    </td>
                    <td
                      className="px-6 py-4 font-semibold"
                      style={{ color: colors.accent }}
                    >
                      ${item.precio.toFixed(2)}
                    </td>
                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: colors.text }}
                    >
                      {item.proveedor}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.color,
                        }}
                      >
                        {item.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 rounded-lg hover:bg-green-50 transition-colors"
                          style={{ color: "#10B981" }}
                          title="Agregar Stock"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          style={{ color: "#3B82F6" }}
                          title="Editar"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <InventoryModal />}
    </div>
  );
};

export default Inventario;
