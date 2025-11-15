// Configuración base de la API
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Función helper para hacer peticiones
export const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    // Crear un error personalizado que incluya los detalles del backend
    const error = new Error(data.message || "Error en la petición");
    error.errors = data.errors; // Errores específicos de validación
    error.status = response.status;
    throw error;
  }

  return data;
};
