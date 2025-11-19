import { useState, useEffect } from "react";
import { X, ShoppingCart } from "lucide-react";
import { productosService, mesasService } from "../../services/api";
import { formatPrice, validatePedidoData } from "../../utils/pedidosUtils";

/**
 * Modal para crear nuevo pedido
 */
const PedidoModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    mesaId: "",
    nombreCliente: "",
    notas: "",
    propina: 0,
  });

  const [cart, setCart] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todo");
  const [searchProduct, setSearchProduct] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState([]);

  const categories = [
    "Todo",
    "Entradas",
    "Platos Fuertes",
    "Bebidas",
    "Postres",
    "Otros",
  ];

  // Cargar productos y mesas al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadData();
    } else {
      // Reset al cerrar
      resetForm();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      const [prodResponse, mesasResponse] = await Promise.all([
        productosService.getProductos({ disponible: true, activo: true }),
        mesasService.getMesas({ activo: true }),
      ]);

      setProductos(prodResponse.data.productos || []);
      setMesas(mesasResponse.data.mesas || []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const resetForm = () => {
    setFormData({
      mesaId: "",
      nombreCliente: "",
      notas: "",
      propina: 0,
    });
    setCart([]);
    setSelectedCategory("Todo");
    setSearchProduct("");
    setErrors([]);
  };

  // Filtrar productos
  const filteredProducts = productos.filter((producto) => {
    // Normalizar categorías: convertir a minúsculas y reemplazar espacios con guiones bajos
    const normalizeCategory = (cat) =>
      cat?.trim().toLowerCase().replace(/\s+/g, "_");

    const matchesCategory =
      selectedCategory === "Todo" ||
      normalizeCategory(producto.categoria) ===
        normalizeCategory(selectedCategory);

    const matchesSearch =
      searchProduct === "" ||
      producto.nombre.toLowerCase().includes(searchProduct.toLowerCase());
    return matchesCategory && matchesSearch && producto.disponible;
  });

  // Añadir producto al carrito
  const addToCart = (producto) => {
    const existingItem = cart.find((item) => item.productoId === producto.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productoId === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          cantidad: 1,
          precioUnitario: producto.precio,
          notas: "",
        },
      ]);
    }
  };

  // Actualizar cantidad
  const updateQuantity = (productoId, cantidad) => {
    if (cantidad === 0) {
      removeFromCart(productoId);
    } else {
      setCart(
        cart.map((item) =>
          item.productoId === productoId ? { ...item, cantidad } : item
        )
      );
    }
  };

  // Actualizar notas de un item
  const updateItemNotes = (productoId, notas) => {
    setCart(
      cart.map((item) =>
        item.productoId === productoId ? { ...item, notas } : item
      )
    );
  };

  // Remover del carrito
  const removeFromCart = (productoId) => {
    setCart(cart.filter((item) => item.productoId !== productoId));
  };

  // Calcular subtotal
  const calculateSubtotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.cantidad * item.precioUnitario,
      0
    );
  };

  // Calcular total
  const calculateTotal = () => {
    return calculateSubtotal() + (parseFloat(formData.propina) || 0);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que se haya seleccionado una mesa
    if (!formData.mesaId) {
      setErrors(["Debes seleccionar una mesa para crear el pedido"]);
      return;
    }

    const pedidoData = {
      ...formData,
      items: cart,
    };

    // Validar
    const validation = validatePedidoData(pedidoData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await onSubmit(pedidoData);
      onClose();
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors.map((err) => err.message || err.msg));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modern Header */}
        <div className="bg-white px-8 py-5 flex items-center justify-between border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <ShoppingCart className="w-6 h-6" />
              </div>
              Nuevo Pedido
            </h2>
            <p className="text-textSecondary text-sm mt-1 ml-1">
              Selecciona los productos para la orden
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-gray-50/50">
          {/* Left Column - Products */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-100 bg-white p-6">
            {/* Search & Categories */}
            <div className="flex-none space-y-4 mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Buscar productos..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 placeholder-gray-400"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-primary text-white shadow-lg shadow-primary/30 transform scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {loadingData ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p>Cargando menú...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <div className="text-6xl mb-4">🍽️</div>
                  <p className="text-lg">No se encontraron productos</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((producto) => (
                    <button
                      key={producto.id}
                      type="button"
                      onClick={() => addToCart(producto)}
                      className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl p-4 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 text-left"
                    >
                      <div className="aspect-square rounded-xl bg-gray-50 flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {producto.imagen}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {producto.nombre}
                        </h3>
                        <p className="text-primary font-bold text-lg">
                          {formatPrice(producto.precio)}
                        </p>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white p-1.5 rounded-full shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Cart & Details */}
          <div className="w-full lg:w-[400px] flex flex-col bg-gray-50/50 border-l border-gray-100">
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              {/* Order Info Inputs - Compact Horizontal Layout */}
              <div className="p-4 bg-white border-b border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Mesa
                    </label>
                    <select
                      value={formData.mesaId}
                      onChange={(e) =>
                        setFormData({ ...formData, mesaId: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 text-sm"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {mesas
                        .filter(
                          (mesa) => mesa.activo && mesa.estado === "disponible"
                        )
                        .map((mesa) => (
                          <option key={mesa.id} value={mesa.id}>
                            Mesa {mesa.numero}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Cliente
                    </label>
                    <input
                      type="text"
                      value={formData.nombreCliente}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombreCliente: e.target.value,
                        })
                      }
                      placeholder="Nombre"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Cart Items - Maximized Space */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-800">
                    Carrito ({cart.length})
                  </h4>
                  {cart.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCart([])}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Limpiar todo
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    <ShoppingCart className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div
                        key={item.productoId}
                        className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-gray-800 text-sm flex-1 mr-2">
                            {item.nombre}
                          </span>
                          <span className="font-bold text-primary text-sm">
                            {formatPrice(item.cantidad * item.precioUnitario)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productoId,
                                  item.cantidad - 1
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-red-500 transition-colors"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold text-sm text-gray-700">
                              {item.cantidad}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productoId,
                                  item.cantidad + 1
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-green-500 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productoId)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={item.notas}
                          onChange={(e) =>
                            updateItemNotes(item.productoId, e.target.value)
                          }
                          placeholder="📝 Notas especiales..."
                          className="w-full mt-2 px-2 py-1 text-xs bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-primary/30 text-gray-600 placeholder-gray-400"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Actions - Compact */}
              <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">
                {errors.length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                    {errors[0]}
                  </div>
                )}

                <div className="space-y-1.5 mb-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Propina</span>
                    <div className="w-24">
                      <input
                        type="number"
                        value={formData.propina || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, propina: e.target.value })
                        }
                        placeholder="0.00"
                        className="w-full px-2 py-1 text-right bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-1.5 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={cart.length === 0 || !formData.mesaId}
                    className="px-4 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoModal;
