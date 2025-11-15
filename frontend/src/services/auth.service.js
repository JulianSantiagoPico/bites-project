import { fetchAPI } from "./config";

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
