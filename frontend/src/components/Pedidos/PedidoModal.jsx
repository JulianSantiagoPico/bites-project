import { useState, useEffect } from "react";
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
    const matchesCategory =
      selectedCategory === "Todo" || producto.categoria === selectedCategory;
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
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-6 max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col"
        style={{ backgroundColor: "white" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-primary">Nuevo Pedido</h3>
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

        {/* Errores */}
        {errors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-semibold text-red-800 mb-2">
              Por favor corrige los siguientes errores:
            </p>
            <ul className="list-disc list-inside text-sm text-red-700">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
            {/* Columna Izquierda - Productos */}
            <div className="lg:col-span-2 flex flex-col overflow-hidden">
              <div className="mb-4">
                <h4 className="text-lg font-bold text-textMain mb-3">
                  Seleccionar Productos
                </h4>

                {/* Búsqueda */}
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-textMain"
                />

                {/* Categorías */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        selectedCategory === category
                          ? "bg-accent text-white"
                          : "bg-gray-100 text-textMain hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de productos */}
              <div className="flex-1 overflow-y-auto">
                {loadingData ? (
                  <div className="text-center py-8 text-textSecondary">
                    Cargando productos...
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-textSecondary">
                    No hay productos disponibles
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredProducts.map((producto) => (
                      <button
                        key={producto.id}
                        type="button"
                        onClick={() => addToCart(producto)}
                        className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-accent hover:shadow-md transition-all text-left"
                      >
                        <div className="text-3xl mb-2">{producto.imagen}</div>
                        <p className="font-semibold text-textMain text-sm mb-1">
                          {producto.nombre}
                        </p>
                        <p className="text-accent font-bold">
                          {formatPrice(producto.precio)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Columna Derecha - Carrito y Detalles */}
            <div className="flex flex-col overflow-hidden">
              {/* Información del pedido */}
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-textMain mb-2">
                    Mesa <span className="text-error">*</span>
                  </label>
                  <select
                    value={formData.mesaId}
                    onChange={(e) =>
                      setFormData({ ...formData, mesaId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-textMain"
                    required
                  >
                    <option value="">Seleccionar mesa...</option>
                    {mesas
                      .filter((mesa) => mesa.activo)
                      .map((mesa) => (
                        <option key={mesa.id} value={mesa.id}>
                          Mesa {mesa.numero} - {mesa.ubicacion} (Cap:{" "}
                          {mesa.capacidad})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-textMain mb-2">
                    Nombre del Cliente
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
                    placeholder="Opcional"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-textMain"
                  />
                </div>
              </div>

              {/* Carrito */}
              <div className="flex-1 overflow-y-auto mb-4">
                <h4 className="text-lg font-bold text-textMain mb-3">
                  Carrito ({cart.length})
                </h4>

                {cart.length === 0 ? (
                  <div className="text-center py-8 text-textSecondary border-2 border-dashed border-gray-300 rounded-lg">
                    Carrito vacío
                    <br />
                    Selecciona productos
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.productoId}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-textMain flex-1">
                            {item.nombre}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productoId)}
                            className="text-error hover:text-red-700 ml-2"
                          >
                            ❌
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productoId, item.cantidad - 1)
                            }
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-textMain"
                          >
                            -
                          </button>
                          <span className="font-semibold text-textMain">
                            {item.cantidad}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productoId, item.cantidad + 1)
                            }
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-textMain"
                          >
                            +
                          </button>
                          <span className="ml-auto font-bold text-accent">
                            {formatPrice(item.cantidad * item.precioUnitario)}
                          </span>
                        </div>

                        <input
                          type="text"
                          value={item.notas}
                          onChange={(e) =>
                            updateItemNotes(item.productoId, e.target.value)
                          }
                          placeholder="Notas especiales (opcional)"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-accent text-textMain"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totales y acciones */}
              <div className="border-t pt-4">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-textMain mb-2">
                    Propina
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.propina}
                    onChange={(e) =>
                      setFormData({ ...formData, propina: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-textMain"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between text-textMain mb-2">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      {formatPrice(calculateSubtotal())}
                    </span>
                  </div>
                  {formData.propina > 0 && (
                    <div className="flex justify-between text-textMain mb-2">
                      <span>Propina</span>
                      <span className="font-semibold">
                        {formatPrice(formData.propina)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-primary pt-2 border-t border-gray-300">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-gray-200 text-textMain font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={cart.length === 0 || !formData.mesaId}
                    className="flex-1 px-4 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Crear Pedido
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PedidoModal;
