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
      setCategorias(
        response.data || {
          categoriasDisplay: {},
          categoriasList: [],
          categoriasIcons: {},
        }
      );
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

      // Actualizar localStorage para que esté disponible inmediatamente
      localStorage.setItem("customCategorias", JSON.stringify(newCategorias));

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
    // Categorías predeterminadas
    const defaultCategorias = {
      entradas: "Entradas",
      platos_fuertes: "Platos Fuertes",
      postres: "Postres",
      bebidas: "Bebidas",
      extras: "Extras",
    };

    // Combinar con categorías personalizadas
    return {
      ...defaultCategorias,
      ...categorias.categoriasDisplay,
    };
  };

  return {
    categorias,
    loading,
    error,
    saving,
    loadCategorias,
    updateCategorias,
    getCurrentCategorias,
  };
};

export default useCategorias;
