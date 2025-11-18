import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useRestaurante } from "../../hooks/useRestaurante";
import { useEffect } from "react";
import {
  Home,
  ClipboardList,
  Package,
  ChefHat,
  Table,
  Calendar,
  Users,
  BarChart3,
  Settings,
  User,
  LogOut,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";
import { hasPermission, PERMISSIONS } from "../../utils/permissions";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { restaurante, cargarRestaurante } = useRestaurante();

  useEffect(() => {
    cargarRestaurante();

    // Listener para actualizar cuando cambie el restaurante
    const handleRestauranteUpdate = () => {
      cargarRestaurante();
    };

    window.addEventListener("restaurante-updated", handleRestauranteUpdate);

    return () => {
      window.removeEventListener(
        "restaurante-updated",
        handleRestauranteUpdate
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      name: "Inicio",
      path: "/dashboard",
      icon: <Home className="w-6 h-6" />,
      permission: PERMISSIONS.DASHBOARD.VIEW, // Todos tienen acceso
    },
    {
      name: "Tomar Pedido",
      path: "/dashboard/pedidos",
      icon: <ClipboardList className="w-6 h-6" />,
      permission: PERMISSIONS.TOMAR_PEDIDO.VIEW,
    },
    {
      name: "Productos",
      path: "/dashboard/productos",
      icon: <Package className="w-6 h-6" />,
      permission: PERMISSIONS.PRODUCTOS.VIEW,
    },
    {
      name: "Cocina",
      path: "/dashboard/cocina",
      icon: <ChefHat className="w-6 h-6" />,
      permission: PERMISSIONS.COCINA.VIEW,
    },
    {
      name: "Mesas",
      path: "/dashboard/mesas",
      icon: <Table className="w-6 h-6" />,
      permission: PERMISSIONS.MESAS.VIEW,
    },
    {
      name: "Reservas",
      path: "/dashboard/reservas",
      icon: <Calendar className="w-6 h-6" />,
      permission: PERMISSIONS.RESERVAS.VIEW,
    },
    {
      name: "Empleados",
      path: "/dashboard/empleados",
      icon: <Users className="w-6 h-6" />,
      permission: PERMISSIONS.EMPLEADOS.VIEW,
    },
    {
      name: "Estadísticas",
      path: "/dashboard/estadisticas",
      icon: <BarChart3 className="w-6 h-6" />,
      permission: PERMISSIONS.ESTADISTICAS.VIEW,
    },
    {
      name: "Configuración",
      path: "/dashboard/configuracion",
      icon: <Settings className="w-6 h-6" />,
      permission: PERMISSIONS.CONFIGURACION.VIEW,
    },
  ];

  // Filtrar items del menú basándose en los permisos del usuario
  const filteredMenuItems = menuItems.filter((item) => {
    // Si tiene permiso definido, verificar que el usuario lo tenga
    if (item.permission) {
      return hasPermission(user?.rol, item.permission);
    }
    // Si no tiene restricciones, mostrar (aunque todos ahora deberían tener permiso definido)
    return true;
  });

  return (
    <aside
      className="transition-all duration-300 ease-in-out flex flex-col bg-primary fixed left-0 top-0 z-40"
      style={{
        width: isCollapsed ? "80px" : "280px",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        {!isCollapsed && (
          <h1 className="text-2xl font-bold text-white">
            {restaurante?.nombre || "Bites"}
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-accent"
        >
          {isCollapsed ? (
            <ChevronsRight className="w-6 h-6" />
          ) : (
            <ChevronsLeft className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-3">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group relative"
                  style={{
                    backgroundColor: isActive ? "#e6af2e" : "transparent",
                    color: isActive ? "#581845" : "white",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="font-medium whitespace-nowrap">
                      {item.name}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-secondary text-white">
                      {item.name}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / User Info */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          to="/dashboard/perfil"
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-accent">
            <User className="w-6 h-6 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {user?.nombre && user?.apellido
                  ? `${user.nombre} ${user.apellido}`
                  : user?.nombre || "Usuario"}
              </p>
              <p className="text-xs truncate text-accent">
                {user?.rol || "Administrador"}
              </p>
            </div>
          )}
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors w-full group"
        >
          <div className="shrink-0">
            <LogOut className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-white font-medium">Cerrar sesión</span>
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-secondary text-white">
              Cerrar sesión
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
