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

// Servicios de inventario
export const inventarioService = {
  // Obtener todo el inventario
  getInventario: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return await fetchAPI(`/inventario${queryString}`);
  },

  // Obtener un item por ID
  getItemById: async (id) => {
    return await fetchAPI(`/inventario/${id}`);
  },

  // Crear nuevo item
  createItem: async (itemData) => {
    return await fetchAPI("/inventario", {
      method: "POST",
      body: JSON.stringify(itemData),
    });
  },

  // Actualizar item
  updateItem: async (id, itemData) => {
    return await fetchAPI(`/inventario/${id}`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    });
  },

  // Desactivar item (soft delete)
  deleteItem: async (id) => {
    return await fetchAPI(`/inventario/${id}`, {
      method: "DELETE",
    });
  },

  // Reactivar item
  reactivarItem: async (id) => {
    return await fetchAPI(`/inventario/${id}`, {
      method: "PUT",
      body: JSON.stringify({ activo: true }),
    });
  },

  // Ajustar stock (entrada o salida)
  ajustarStock: async (id, ajusteData) => {
    return await fetchAPI(`/inventario/${id}/ajustar`, {
      method: "POST",
      body: JSON.stringify(ajusteData),
    });
  },

  // Obtener estadísticas del inventario
  getEstadisticas: async () => {
    return await fetchAPI("/inventario/estadisticas");
  },

  // Obtener alertas del inventario
  getAlertas: async () => {
    return await fetchAPI("/inventario/alertas");
  },
};

// Servicios de mesas
export const mesasService = {
  // Obtener todas las mesas
  getMesas: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return await fetchAPI(`/mesas${queryString}`);
  },

  // Obtener una mesa por ID
  getMesaById: async (id) => {
    return await fetchAPI(`/mesas/${id}`);
  },

  // Crear nueva mesa
  createMesa: async (mesaData) => {
    return await fetchAPI("/mesas", {
      method: "POST",
      body: JSON.stringify(mesaData),
    });
  },

  // Actualizar mesa
  updateMesa: async (id, mesaData) => {
    return await fetchAPI(`/mesas/${id}`, {
      method: "PUT",
      body: JSON.stringify(mesaData),
    });
  },

  // Eliminar mesa (soft delete)
  deleteMesa: async (id) => {
    return await fetchAPI(`/mesas/${id}`, {
      method: "DELETE",
    });
  },

  // Cambiar estado de la mesa
  changeEstado: async (id, estado) => {
    return await fetchAPI(`/mesas/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify({ estado }),
    });
  },

  // Asignar mesero a una mesa
  asignarMesero: async (id, meseroId) => {
    return await fetchAPI(`/mesas/${id}/asignar`, {
      method: "PATCH",
      body: JSON.stringify({ meseroId }),
    });
  },

  // Obtener estadísticas de mesas
  getEstadisticas: async () => {
    return await fetchAPI("/mesas/estadisticas");
  },

  // Obtener mesas disponibles
  getMesasDisponibles: async (capacidadMinima = null) => {
    const params = capacidadMinima ? `?capacidadMinima=${capacidadMinima}` : "";
    return await fetchAPI(`/mesas/disponibles${params}`);
  },
};

// Servicios de reservas
export const reservasService = {
  // Obtener todas las reservas con filtros opcionales
  getReservas: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.fecha) params.append("fecha", filters.fecha);
    if (filters.estado) params.append("estado", filters.estado);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return await fetchAPI(`/reservas${queryString}`);
  },

  // Obtener una reserva por ID
  getReservaById: async (id) => {
    return await fetchAPI(`/reservas/${id}`);
  },

  // Crear nueva reserva
  createReserva: async (reservaData) => {
    return await fetchAPI("/reservas", {
      method: "POST",
      body: JSON.stringify(reservaData),
    });
  },

  // Actualizar reserva
  updateReserva: async (id, reservaData) => {
    return await fetchAPI(`/reservas/${id}`, {
      method: "PUT",
      body: JSON.stringify(reservaData),
    });
  },

  // Eliminar reserva (soft delete)
  deleteReserva: async (id) => {
    return await fetchAPI(`/reservas/${id}`, {
      method: "DELETE",
    });
  },

  // Cambiar estado de la reserva
  changeEstado: async (id, estado) => {
    return await fetchAPI(`/reservas/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify({ estado }),
    });
  },

  // Asignar mesa a una reserva
  asignarMesa: async (id, mesaId) => {
    return await fetchAPI(`/reservas/${id}/asignar-mesa`, {
      method: "PATCH",
      body: JSON.stringify({ mesaId }),
    });
  },

  // Obtener estadísticas de reservas
  getEstadisticas: async () => {
    return await fetchAPI("/reservas/estadisticas");
  },
};

export default fetchAPI;
