import { useState } from "react";
import "./TomarPedido.css";

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
          <h2 className="text-3xl font-bold text-primary">Tomar Pedido</h2>
          <p className="text-textSecondary">
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
                className={`category-button px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category ? "active" : ""
                }`}
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
                className="product-card rounded-xl p-4 text-left"
              >
                <div className="text-5xl mb-3 text-center">{product.image}</div>
                <h3 className="product-card-title font-bold mb-1">
                  {product.name}
                </h3>
                <p className="product-card-category text-sm mb-2">
                  {product.category}
                </p>
                <div className="flex items-center justify-between">
                  <span className="product-card-price text-xl font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="product-card-badge px-3 py-1 rounded-full text-sm">
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
          <div className="order-info-card rounded-xl p-6 shadow-md">
            <h3 className="order-info-title text-lg font-bold mb-4">
              Información del Pedido
            </h3>

            <div className="space-y-4">
              <div>
                <label className="order-info-label block text-sm font-medium mb-2">
                  Mesa
                </label>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="order-info-select w-full px-4 py-3 rounded-lg focus:outline-none transition-colors"
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
                <label className="order-info-label block text-sm font-medium mb-2">
                  Nombre del Cliente (Opcional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nombre..."
                  className="order-info-input w-full px-4 py-3 rounded-lg focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Cart */}
          <div className="cart-card rounded-xl shadow-md">
            <div className="cart-header p-6 border-b">
              <h3 className="order-info-title text-lg font-bold">
                Resumen del Pedido
              </h3>
            </div>

            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="cart-empty">No hay productos en el carrito</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="cart-item flex items-center gap-3 p-3 rounded-lg"
                    >
                      <div className="text-2xl">{item.image}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="cart-item-title font-semibold text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="cart-item-price text-sm">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="cart-btn-minus w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-opacity"
                        >
                          -
                        </button>
                        <span className="cart-item-quantity w-8 text-center font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="cart-btn-plus w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-opacity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="cart-btn-remove p-2 rounded-lg transition-colors"
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
                  <div className="cart-divider border-t pt-4 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="cart-text">Subtotal</span>
                      <span className="cart-total-label font-semibold">
                        ${calculateTotal()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="cart-total-label text-lg font-bold">
                        Total
                      </span>
                      <span className="cart-total-amount text-2xl font-bold">
                        ${calculateTotal()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitOrder}
                    className="cart-submit-btn w-full py-4 rounded-lg font-bold transition-opacity"
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
