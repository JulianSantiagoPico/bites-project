import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService, restauranteService } from "../services/api";
import { loadCustomPermissionsFromBackend } from "../utils/permissions";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay un usuario autenticado al cargar
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = authService.getCurrentUser();

      if (token && storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);

        // Cargar permisos personalizados desde el backend
        try {
          await loadCustomPermissionsFromBackend();
        } catch (error) {
          console.error("Error al cargar permisos personalizados:", error);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errors: error.errors, // Errores de validación específicos
      };
    }
  };

  // Registro
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errors: error.errors, // Errores de validación específicos
      };
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Completar configuración del restaurante
  const completarConfiguracion = async (restauranteData) => {
    try {
      const response = await restauranteService.completarConfiguracion(
        restauranteData
      );

      // Actualizar el usuario con el que devuelve el backend (incluye configuracionCompleta: true)
      const updatedUser = response.data.usuario;
      console.log(
        "AuthContext - Usuario actualizado del backend:",
        updatedUser
      );

      setUser(updatedUser);
      authService.updateCurrentUser(updatedUser);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errors: error.errors,
      };
    }
  };

  // Actualizar usuario en el contexto
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    authService.updateCurrentUser(updatedUser);
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    completarConfiguracion,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
