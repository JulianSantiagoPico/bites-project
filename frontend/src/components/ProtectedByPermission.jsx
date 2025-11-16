import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ROLE_PERMISSIONS } from "../utils/permissions";

/**
 * Componente para proteger rutas basado en permisos
 * Verifica si el usuario tiene el permiso necesario para acceder
 */
const ProtectedByPermission = ({
  children,
  permission,
  fallback = null,
  redirectTo = "/dashboard",
}) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el usuario tiene el permiso
  const userPermissions = ROLE_PERMISSIONS[user.rol] || [];
  const hasPermission = userPermissions.includes(permission);

  if (!hasPermission) {
    if (fallback) {
      return fallback;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedByPermission;
