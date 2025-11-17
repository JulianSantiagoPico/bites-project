import { useState, useEffect, useCallback } from "react";
import { restauranteService } from "../services/restaurante.service";

export const useRestaurante = () => {
  const [restaurante, setRestaurante] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar configuración del restaurante
  const cargarRestaurante = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await restauranteService.getConfiguracion();
      if (response.success) {
        setRestaurante(response.data);
      } else {
        setError(response.message || "Error al cargar el restaurante");
      }
    } catch (err) {
      console.error("Error al cargar restaurante:", err);
      setError(err.message || "Error al cargar el restaurante");
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar nombre
  const actualizarNombre = async (nombre) => {
    try {
      setLoading(true);
      setError(null);
      const response = await restauranteService.updateNombre(nombre);
      if (response.success) {
        setRestaurante((prev) => ({
          ...prev,
          nombre: response.data.nombre,
        }));
        // Disparar evento para notificar cambio
        window.dispatchEvent(new Event("restaurante-updated"));
        return { success: true, message: response.message };
      } else {
        setError(response.message || "Error al actualizar el nombre");
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error("Error al actualizar nombre:", err);
      const errorMsg = err.message || "Error al actualizar el nombre";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar horarios
  const actualizarHorarios = async (horarios) => {
    try {
      setLoading(true);
      setError(null);
      const response = await restauranteService.updateHorarios(horarios);
      if (response.success) {
        setRestaurante((prev) => ({
          ...prev,
          horarios: response.data.horarios,
        }));
        return { success: true, message: response.message };
      } else {
        setError(response.message || "Error al actualizar los horarios");
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error("Error al actualizar horarios:", err);
      const errorMsg = err.message || "Error al actualizar los horarios";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar contacto
  const actualizarContacto = async (contactoData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await restauranteService.updateContacto(contactoData);
      if (response.success) {
        setRestaurante((prev) => ({
          ...prev,
          ...response.data,
        }));
        return { success: true, message: response.message };
      } else {
        setError(response.message || "Error al actualizar el contacto");
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error("Error al actualizar contacto:", err);
      const errorMsg = err.message || "Error al actualizar el contacto";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Cargar al montar el componente
  useEffect(() => {
    cargarRestaurante();
  }, [cargarRestaurante]);

  return {
    restaurante,
    loading,
    error,
    cargarRestaurante,
    actualizarNombre,
    actualizarHorarios,
    actualizarContacto,
  };
};
