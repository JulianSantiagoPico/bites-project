import { fetchAPI } from "./config";

// Servicios de empleados
export const empleadosService = {
  // Obtener todos los empleados
  getEmpleados: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return await fetchAPI(`/users${queryString}`);
  },

  // Obtener un empleado por ID
  getEmpleadoById: async (id) => {
    return await fetchAPI(`/users/${id}`);
  },

  // Crear nuevo empleado
  createEmpleado: async (empleadoData) => {
    return await fetchAPI("/users", {
      method: "POST",
      body: JSON.stringify(empleadoData),
    });
  },

  // Actualizar empleado
  updateEmpleado: async (id, empleadoData) => {
    return await fetchAPI(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(empleadoData),
    });
  },

  // Desactivar empleado (soft delete)
  deleteEmpleado: async (id) => {
    return await fetchAPI(`/users/${id}`, {
      method: "DELETE",
    });
  },

  // Reactivar empleado
  reactivarEmpleado: async (id) => {
    return await fetchAPI(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ activo: true }),
    });
  },
};
