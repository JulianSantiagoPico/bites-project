import { useState } from "react";
import colors from "../../styles/colors";

const Productos = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todo");
  const [editingProduct, setEditingProduct] = useState(null);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Hamburguesa Clásica",
      category: "Platos Fuertes",
      price: 7.5,
      stock: 45,
      image: "🍔",
      status: "Disponible",
    },
    {
      id: 2,
      name: "Pizza Margherita",
      category: "Platos Fuertes",
      price: 12.0,
      stock: 38,
      image: "🍕",
      status: "Disponible",
    },
    {
      id: 3,
      name: "Pasta Carbonara",
      category: "Platos Fuertes",
      price: 12.0,
      stock: 32,
      image: "🍝",
      status: "Disponible",
    },
    {
      id: 4,
      name: "Ensalada César",
      category: "Entradas",
      price: 9.0,
      stock: 28,
      image: "🥗",
      status: "Disponible",
    },
    {
      id: 5,
      name: "Papas Fritas",
      category: "Entradas",
      price: 4.5,
      stock: 15,
      image: "🍟",
      status: "Disponible",
    },
    {
      id: 6,
      name: "Alitas BBQ",
      category: "Entradas",
      price: 8.5,
      stock: 8,
      image: "🍗",
      status: "Bajo Stock",
    },
    {
      id: 7,
      name: "Coca Cola",
      category: "Bebidas",
      price: 2.5,
      stock: 120,
      image: "🥤",
      status: "Disponible",
    },
    {
      id: 8,
      name: "Jugo Natural",
      category: "Bebidas",
      price: 3.5,
      stock: 42,
      image: "🧃",
      status: "Disponible",
    },
    {
      id: 9,
      name: "Agua",
      category: "Bebidas",
      price: 1.5,
      stock: 200,
      image: "💧",
      status: "Disponible",
    },
    {
      id: 10,
      name: "Cheesecake",
      category: "Postres",
      price: 5.5,
      stock: 12,
      image: "🍰",
      status: "Disponible",
    },
    {
      id: 11,
      name: "Helado",
      category: "Postres",
      price: 4.0,
      stock: 5,
      image: "🍨",
      status: "Bajo Stock",
    },
    {
      id: 12,
      name: "Brownie",
      category: "Postres",
      price: 4.5,
      stock: 18,
      image: "🍫",
      status: "Disponible",
    },
  ]);

  const categories = [
    "Todo",
    "Entradas",
    "Platos Fuertes",
    "Bebidas",
    "Postres",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "Todo" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  const ProductModal = () => (
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
            {editingProduct ? "Editar Producto" : "Nuevo Producto"}
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
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Nombre del Producto
              </label>
              <input
                type="text"
                placeholder="Ej: Hamburguesa Especial"
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
                Categoría
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
                Precio ($)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
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
                Stock Inicial
              </label>
              <input
                type="number"
                placeholder="0"
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
                Estado
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              >
                <option value="Disponible">Disponible</option>
                <option value="No Disponible">No Disponible</option>
              </select>
            </div>

            <div className="col-span-2">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Descripción
              </label>
              <textarea
                rows="3"
                placeholder="Descripción del producto..."
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
              {editingProduct ? "Guardar Cambios" : "Crear Producto"}
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
            Productos
          </h2>
          <p style={{ color: colors.textSecondary }}>
            Gestiona el catálogo de productos del restaurante
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
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
          Nuevo Producto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="rounded-xl p-4 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Total Productos
          </p>
          <p
            className="text-2xl font-bold mt-1"
            style={{ color: colors.primary }}
          >
            {products.length}
          </p>
        </div>
        <div
          className="rounded-xl p-4 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Disponibles
          </p>
          <p className="text-2xl font-bold mt-1" style={{ color: "#10B981" }}>
            {products.filter((p) => p.status === "Disponible").length}
          </p>
        </div>
        <div
          className="rounded-xl p-4 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Bajo Stock
          </p>
          <p className="text-2xl font-bold mt-1" style={{ color: "#F59E0B" }}>
            {products.filter((p) => p.status === "Bajo Stock").length}
          </p>
        </div>
        <div
          className="rounded-xl p-4 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Categorías
          </p>
          <p
            className="text-2xl font-bold mt-1"
            style={{ color: colors.accent }}
          >
            {categories.length - 1}
          </p>
        </div>
      </div>

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

      {/* Products Table */}
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
                  Precio
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Stock
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
              {filteredProducts.map((product, index) => (
                <tr
                  key={product.id}
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? "white" : colors.background,
                    borderBottom: `1px solid ${colors.secondary}20`,
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{product.image}</span>
                      <span
                        className="font-medium"
                        style={{ color: colors.primary }}
                      >
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: colors.text }}>
                    {product.category}
                  </td>
                  <td
                    className="px-6 py-4 font-semibold"
                    style={{ color: colors.accent }}
                  >
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4" style={{ color: colors.text }}>
                    {product.stock} unidades
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor:
                          product.status === "Disponible"
                            ? "#10B98120"
                            : product.status === "Bajo Stock"
                            ? "#F59E0B20"
                            : "#EF444420",
                        color:
                          product.status === "Disponible"
                            ? "#10B981"
                            : product.status === "Bajo Stock"
                            ? "#F59E0B"
                            : "#EF4444",
                      }}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        style={{ color: "#3B82F6" }}
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
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                        style={{ color: "#EF4444" }}
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <ProductModal />}
    </div>
  );
};

export default Productos;
