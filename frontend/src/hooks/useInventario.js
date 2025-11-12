import { useState, useEffect } from "react";
import { inventarioService } from "../services/api";

export const useInventario = () => {
  // Estados
  const [items, setItems] = useState([]);
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

  // Cargar inventario al montar
  useEffect(() => {
    loadInventario();
  }, []);

  // Cargar inventario desde la API
  const loadInventario = async () => {
    try {
      setLoading(true);
      const response = await inventarioService.getInventario();
      setItems(response.data.items || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Error al cargar el inventario");
      console.error("Error al cargar inventario:", err);
    } finally {
      setLoading(false);
    }
  };

  // Crear o actualizar item
  const saveItem = async (formData, editingItem) => {
    try {
      if (editingItem) {
        // Actualizar item
        await inventarioService.updateItem(editingItem.id, formData);
        showNotification("✨ Item actualizado exitosamente", "success");
      } else {
        // Crear nuevo item
        await inventarioService.createItem(formData);
        showNotification(
          "🎉 Item agregado al inventario exitosamente",
          "success"
        );
      }

      await loadInventario();
    } catch (err) {
      console.error("Error al guardar item:", err);

      if (!err.errors) {
        showNotification(
          err.message ||
            "Error al guardar el item. Por favor intenta de nuevo.",
          "error"
        );
      }

      throw err;
    }
  };

  // Desactivar item
  const deleteItem = async (item) => {
    setConfirmDialog({
      isOpen: true,
      title: "Desactivar Item",
      message: `¿Estás seguro de desactivar "${item.nombre}"? El item no aparecerá en el inventario activo.`,
      type: "danger",
      onConfirm: async () => {
        try {
          await inventarioService.deleteItem(item.id);
          showNotification("👋 Item desactivado exitosamente", "success");
          await loadInventario();
        } catch (err) {
          console.error("Error al desactivar item:", err);
          showNotification(
            err.message ||
              "Error al desactivar el item. Por favor intenta de nuevo.",
            "error"
          );
        }
      },
    });
  };

  // Reactivar item
  const reactivateItem = async (item) => {
    setConfirmDialog({
      isOpen: true,
      title: "Reactivar Item",
      message: `¿Estás seguro de reactivar "${item.nombre}"? El item volverá a aparecer en el inventario activo.`,
      type: "success",
      onConfirm: async () => {
        try {
          await inventarioService.reactivarItem(item.id);
          showNotification("🎊 Item reactivado exitosamente", "success");
          await loadInventario();
        } catch (err) {
          console.error("Error al reactivar item:", err);
          showNotification(
            err.message ||
              "Error al reactivar el item. Por favor intenta de nuevo.",
            "error"
          );
        }
      },
    });
  };

  // Ajustar stock
  const ajustarStock = async (item, ajusteData) => {
    try {
      const response = await inventarioService.ajustarStock(
        item.id,
        ajusteData
      );

      const tipoEmoji = ajusteData.tipo === "entrada" ? "📦" : "📤";
      showNotification(
        `${tipoEmoji} Stock ajustado exitosamente (${ajusteData.tipo})`,
        "success"
      );

      await loadInventario();
      return response;
    } catch (err) {
      console.error("Error al ajustar stock:", err);
      showNotification(
        err.message || "Error al ajustar el stock. Por favor intenta de nuevo.",
        "error"
      );
      throw err;
    }
  };

  // Mostrar notificación
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  // Cerrar notificación
  const closeNotification = () => {
    setNotification(null);
  };

  // Cerrar dialog de confirmación
  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: () => {},
      type: "warning",
    });
  };

  // Filtrar items
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "Todo" || item.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Calcular estadísticas locales
  const calculateStats = () => {
    const stats = {
      totalItems: items.length,
      itemsNormales: 0,
      itemsBajoStock: 0,
      itemsCriticos: 0,
      itemsAgotados: 0,
      valorTotalInventario: 0,
    };

    items.forEach((item) => {
      // Calcular valor total
      stats.valorTotalInventario += item.valorTotal || 0;

      // Contar por estado
      switch (item.estado) {
        case "Normal":
          stats.itemsNormales++;
          break;
        case "Bajo Stock":
          stats.itemsBajoStock++;
          break;
        case "Crítico":
          stats.itemsCriticos++;
          break;
        case "Agotado":
          stats.itemsAgotados++;
          break;
        default:
          break;
      }
    });

    return stats;
  };

  return {
    // Estados
    items,
    loading,
    error,
    searchTerm,
    filterCategory,
    notification,
    confirmDialog,
    filteredItems,
    stats: calculateStats(),

    // Setters
    setSearchTerm,
    setFilterCategory,

    // Acciones
    loadInventario,
    saveItem,
    deleteItem,
    reactivateItem,
    ajustarStock,
    showNotification,
    closeNotification,
    closeConfirmDialog,
  };
};
