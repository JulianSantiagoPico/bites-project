import { useState, useEffect } from "react";
import { categoriasService } from "../services/categorias.service";

/**
 * Hook para gestionar las categorías del restaurante
 */
export const useCategorias = () => {
  const [categorias, setCategorias] = useState({
    categoriasDisplay: {},
    categoriasList: [],
    categoriasIcons: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Cargar categorías al montar
  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await categoriasService.getCategorias();

      // Validar que response.data tenga la estructura correcta
      if (response.data && typeof response.data === "object") {
        // Si tiene categoriasDisplay, es la estructura correcta
        if (response.data.categoriasDisplay) {
          setCategorias(response.data);
        } else {
          // Si no tiene categoriasDisplay, usar valores por defecto
          console.warn("Estructura de datos inesperada:", response.data);
          setCategorias({
            categoriasDisplay: {},
            categoriasList: [],
            categoriasIcons: {},
          });
        }
      } else {
        setCategorias({
          categoriasDisplay: {},
          categoriasList: [],
          categoriasIcons: {},
        });
      }
    } catch (err) {
      console.error("Error al cargar categorías:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCategorias = async (newCategorias) => {
    setSaving(true);
    setError(null);

    try {
      const response = await categoriasService.updateCategorias(newCategorias);
      setCategorias(response.data);

      // Actualizar localStorage con la respuesta del servidor
      localStorage.setItem("customCategorias", JSON.stringify(response.data));

      return { success: true };
    } catch (err) {
      console.error("Error al actualizar categorías:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  };

  // Función helper para obtener todas las categorías disponibles
  const getCurrentCategorias = () => {
    const display = categorias?.categoriasDisplay;
    // Validar que sea un objeto y no un array ni null
    if (display && typeof display === "object" && !Array.isArray(display)) {
      return display;
    }
    return {};
  };

  // Función helper para obtener los iconos actuales
  const getCurrentIcons = () => {
    const icons = categorias?.categoriasIcons;
    // Validar que sea un objeto y no un array ni null
    if (icons && typeof icons === "object" && !Array.isArray(icons)) {
      return icons;
    }
    return {};
  };

  return {
    categorias,
    loading,
    error,
    saving,
    loadCategorias,
    updateCategorias,
    getCurrentCategorias,
    getCurrentIcons,
  };
};

export default useCategorias;
