// Configuración base de la API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Función helper para hacer peticiones
const fetchAPI = async (endpoint, options = {}) => {
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

// Servicios de autenticación
export const authService = {
  // Login
  login: async (email, password) => {
    const data = await fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Guardar token en localStorage
    if (data.data.token) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return data;
  },

  // Registro
  register: async (userData) => {
    const data = await fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    // Guardar token en localStorage
    if (data.data.token) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return data;
  },

  // Obtener usuario actual
  getMe: async () => {
    return await fetchAPI("/auth/me");
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Obtener usuario del localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Actualizar usuario en localStorage
  updateCurrentUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  },
};

// Servicios de restaurante
export const restauranteService = {
  // Obtener información del restaurante
  getRestaurante: async () => {
    return await fetchAPI("/restaurante");
  },

  // Actualizar información del restaurante
  updateRestaurante: async (restauranteData) => {
    return await fetchAPI("/restaurante", {
      method: "PUT",
      body: JSON.stringify(restauranteData),
    });
  },

  // Completar configuración inicial
  completarConfiguracion: async (restauranteData) => {
    return await fetchAPI("/restaurante/completar-configuracion", {
      method: "POST",
      body: JSON.stringify(restauranteData),
    });
  },
};

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

export default fetchAPI;
