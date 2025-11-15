import { useState, useEffect } from "react";
import { productosService } from "../services/api";
import { calculateStats, filterProductos } from "../utils/productosUtils";

export const useProductos = () => {
  // Estados
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todo");
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning",
  });

  // Cargar productos al montar
  useEffect(() => {
    loadProductos();
  }, []);

  // Cargar productos desde la API
  const loadProductos = async () => {
    try {
      setLoading(true);
      const response = await productosService.getProductos();
      setProductos(response.data.productos || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Error al cargar los productos");
      console.error("Error al cargar productos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Crear o actualizar producto
  const saveProducto = async (formData, editingProducto) => {
    try {
      if (editingProducto) {
        // Actualizar producto
        const response = await productosService.updateProducto(
          editingProducto.id,
          formData
        );

        // Actualizar estado local
        setProductos((prevProductos) =>
          prevProductos.map((producto) =>
            producto.id === editingProducto.id
              ? { ...producto, ...response.data.producto }
              : producto
          )
        );

        showNotification("✨ Producto actualizado exitosamente", "success");
      } else {
        // Crear nuevo producto
        const response = await productosService.createProducto(formData);

        // Agregar nuevo producto al estado local
        setProductos((prevProductos) => [
          response.data.producto,
          ...prevProductos,
        ]);

        showNotification(
          "🎉 Producto agregado al menú exitosamente",
          "success"
        );
      }
    } catch (err) {
      console.error("Error al guardar producto:", err);

      if (!err.errors) {
        showNotification(
          err.message ||
            "Error al guardar el producto. Por favor intenta de nuevo.",
          "error"
        );
      }

      throw err;
    }
  };

  // Desactivar producto
  const deleteProducto = async (producto) => {
    setConfirmDialog({
      isOpen: true,
      title: "Desactivar Producto",
      message: `¿Estás seguro de desactivar "${producto.nombre}"? El producto no aparecerá en el menú.`,
      type: "danger",
      onConfirm: async () => {
        try {
          await productosService.deleteProducto(producto.id);

          // Actualizar estado local
          setProductos((prevProductos) =>
            prevProductos.map((p) =>
              p.id === producto.id
                ? { ...p, activo: false, disponible: false }
                : p
            )
          );

          showNotification("👋 Producto desactivado exitosamente", "success");
        } catch (err) {
          console.error("Error al desactivar producto:", err);
          showNotification(
            err.message ||
              "Error al desactivar el producto. Por favor intenta de nuevo.",
            "error"
          );
        }
      },
    });
  };

  // Reactivar producto
  const reactivateProducto = async (producto) => {
    setConfirmDialog({
      isOpen: true,
      title: "Reactivar Producto",
      message: `¿Estás seguro de reactivar "${producto.nombre}"? El producto volverá a aparecer en el menú.`,
      type: "success",
      onConfirm: async () => {
        try {
          await productosService.reactivarProducto(producto.id);

          // Actualizar estado local
          setProductos((prevProductos) =>
            prevProductos.map((p) =>
              p.id === producto.id ? { ...p, activo: true } : p
            )
          );

          showNotification("🎊 Producto reactivado exitosamente", "success");
        } catch (err) {
          console.error("Error al reactivar producto:", err);
          showNotification(
            err.message ||
              "Error al reactivar el producto. Por favor intenta de nuevo.",
            "error"
          );
        }
      },
    });
  };

  // Cambiar disponibilidad
  const toggleDisponibilidad = async (producto) => {
    const nuevoEstado = !producto.disponible;
    const accion = nuevoEstado ? "disponible" : "no disponible";

    setConfirmDialog({
      isOpen: true,
      title: "Cambiar Disponibilidad",
      message: `¿Deseas marcar "${producto.nombre}" como ${accion}?`,
      type: nuevoEstado ? "success" : "warning",
      onConfirm: async () => {
        try {
          await productosService.toggleDisponibilidad(producto.id, nuevoEstado);

          // Actualizar estado local
          setProductos((prevProductos) =>
            prevProductos.map((p) =>
              p.id === producto.id ? { ...p, disponible: nuevoEstado } : p
            )
          );

          showNotification(`✅ Producto marcado como ${accion}`, "success");
        } catch (err) {
          console.error("Error al cambiar disponibilidad:", err);
          showNotification(
            err.message ||
              "Error al cambiar disponibilidad. Por favor intenta de nuevo.",
            "error"
          );
        }
      },
    });
  };

  // Mostrar notificación
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  // Cerrar notificación
  const closeNotification = () => {
    setNotification(null);
  };

  // Cerrar diálogo de confirmación
  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: () => {},
      type: "warning",
    });
  };

  // Productos filtrados
  const filteredProductos = filterProductos(
    productos,
    searchTerm,
    filterCategory
  );

  // Estadísticas
  const stats = calculateStats(productos);

  return {
    productos,
    loading,
    error,
    searchTerm,
    filterCategory,
    notification,
    confirmDialog,
    filteredProductos,
    stats,
    setSearchTerm,
    setFilterCategory,
    loadProductos,
    saveProducto,
    deleteProducto,
    reactivateProducto,
    toggleDisponibilidad,
    closeNotification,
    closeConfirmDialog,
  };
};
