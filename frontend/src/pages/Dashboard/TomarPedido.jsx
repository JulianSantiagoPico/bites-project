import { useState } from "react";
import colors from "../../styles/colors";

const TomarPedido = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todo");
  const [cart, setCart] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [customerName, setCustomerName] = useState("");

  const categories = [
    "Todo",
    "Entradas",
    "Platos Fuertes",
    "Bebidas",
    "Postres",
  ];

  const products = [
    {
      id: 1,
      name: "Hamburguesa Clásica",
      category: "Platos Fuertes",
      price: 7.5,
      image: "🍔",
    },
    {
      id: 2,
      name: "Pizza Margherita",
      category: "Platos Fuertes",
      price: 12.0,
      image: "🍕",
    },
    {
      id: 3,
      name: "Pasta Carbonara",
      category: "Platos Fuertes",
      price: 12.0,
      image: "🍝",
    },
    {
      id: 4,
      name: "Ensalada César",
      category: "Entradas",
      price: 9.0,
      image: "🥗",
    },
    {
      id: 5,
      name: "Papas Fritas",
      category: "Entradas",
      price: 4.5,
      image: "🍟",
    },
    {
      id: 6,
      name: "Alitas BBQ",
      category: "Entradas",
      price: 8.5,
      image: "🍗",
    },
    { id: 7, name: "Coca Cola", category: "Bebidas", price: 2.5, image: "🥤" },
    {
      id: 8,
      name: "Jugo Natural",
      category: "Bebidas",
      price: 3.5,
      image: "🧃",
    },
    { id: 9, name: "Agua", category: "Bebidas", price: 1.5, image: "💧" },
    {
      id: 10,
      name: "Cheesecake",
      category: "Postres",
      price: 5.5,
      image: "🍰",
    },
    { id: 11, name: "Helado", category: "Postres", price: 4.0, image: "🍨" },
    { id: 12, name: "Brownie", category: "Postres", price: 4.5, image: "🍫" },
  ];

  const tables = Array.from({ length: 20 }, (_, i) => ({
    number: i + 1,
    status: Math.random() > 0.5 ? "Disponible" : "Ocupada",
  }));

  const filteredProducts =
    selectedCategory === "Todo"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, change) => {
    setCart(
      cart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleSubmitOrder = () => {
    if (!selectedTable) {
      alert("Por favor selecciona una mesa");
      return;
    }
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    console.log("Orden enviada:", {
      table: selectedTable,
      customer: customerName,
      items: cart,
      total: calculateTotal(),
    });

    // Reset form
    setCart([]);
    setSelectedTable("");
    setCustomerName("");
    alert("Orden enviada exitosamente!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: colors.primary }}>
            Tomar Pedido
          </h2>
          <p style={{ color: colors.textSecondary }}>
            Selecciona productos y asigna a una mesa
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-200"
                style={{
                  backgroundColor:
                    selectedCategory === category ? colors.accent : "white",
                  color:
                    selectedCategory === category
                      ? colors.primary
                      : colors.text,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="rounded-xl p-4 text-left hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                style={{ backgroundColor: "white" }}
              >
                <div className="text-5xl mb-3 text-center">{product.image}</div>
                <h3
                  className="font-bold mb-1"
                  style={{ color: colors.primary }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-sm mb-2"
                  style={{ color: colors.textSecondary }}
                >
                  {product.category}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xl font-bold"
                    style={{ color: colors.accent }}
                  >
                    ${product.price.toFixed(2)}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: colors.accent + "20",
                      color: colors.accent,
                    }}
                  >
                    Agregar
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          {/* Table and Customer Info */}
          <div
            className="rounded-xl p-6 shadow-md"
            style={{ backgroundColor: "white" }}
          >
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: colors.primary }}
            >
              Información del Pedido
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Mesa
                </label>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-100 transition-colors"
                  style={{
                    borderColor: colors.secondary + "40",
                    backgroundColor: colors.background,
                  }}
                >
                  <option value="">Seleccionar mesa...</option>
                  {tables
                    .filter((t) => t.status === "Disponible")
                    .map((table) => (
                      <option key={table.number} value={table.number}>
                        Mesa {table.number}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Nombre del Cliente (Opcional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nombre..."
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-100 transition-colors"
                  style={{
                    borderColor: colors.secondary + "40",
                    backgroundColor: colors.background,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Cart */}
          <div
            className="rounded-xl shadow-md"
            style={{ backgroundColor: "white" }}
          >
            <div
              className="p-6 border-b"
              style={{ borderColor: colors.secondary + "20" }}
            >
              <h3
                className="text-lg font-bold"
                style={{ color: colors.primary }}
              >
                Resumen del Pedido
              </h3>
            </div>

            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🛒</div>
                  <p style={{ color: colors.textSecondary }}>
                    No hay productos en el carrito
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ backgroundColor: colors.background }}
                    >
                      <div className="text-2xl">{item.image}</div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className="font-semibold text-sm truncate"
                          style={{ color: colors.primary }}
                        >
                          {item.name}
                        </h4>
                        <p className="text-sm" style={{ color: colors.accent }}>
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: colors.secondary,
                            color: "white",
                          }}
                        >
                          -
                        </button>
                        <span
                          className="w-8 text-center font-bold"
                          style={{ color: colors.primary }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: colors.accent,
                            color: colors.primary,
                          }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-lg hover:bg-red-100 transition-colors"
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
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <>
                  <div
                    className="border-t pt-4 mt-4"
                    style={{ borderColor: colors.secondary + "20" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ color: colors.text }}>Subtotal</span>
                      <span
                        className="font-semibold"
                        style={{ color: colors.primary }}
                      >
                        ${calculateTotal()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-lg font-bold"
                        style={{ color: colors.primary }}
                      >
                        Total
                      </span>
                      <span
                        className="text-2xl font-bold"
                        style={{ color: colors.accent }}
                      >
                        ${calculateTotal()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitOrder}
                    className="w-full py-4 rounded-lg font-bold text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Enviar Pedido
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TomarPedido;
