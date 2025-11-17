import { useNavigate } from "react-router-dom";
import {
  Plus,
  Calendar,
  BarChart3,
  Package,
  ChefHat,
  Table,
  Users,
  Archive,
} from "lucide-react";
import { usePermissions } from "../../hooks/usePermissions";
import { PERMISSIONS } from "../../utils/permissions";

/**
 * Componente de acciones rápidas del Dashboard
 * Botones de acceso directo a funcionalidades clave basados en permisos
 */
const QuickActions = () => {
  const navigate = useNavigate();
  const { can } = usePermissions();

  // Definir todas las acciones disponibles con sus permisos
  const allActions = [
    {
      id: "nuevo-pedido",
      title: "Nuevo Pedido",
      description: "Tomar orden de cliente",
      icon: Plus,
      iconColor: "#581845",
      bgColor: "#581845", // Primary
      textColor: "#ffffff",
      accentColor: "#e6af2e",
      onClick: () => navigate("/dashboard/pedidos"),
      permission: PERMISSIONS.ORDENES.CREATE,
    },
    {
      id: "nueva-reserva",
      title: "Nueva Reserva",
      description: "Agendar reservación",
      icon: Calendar,
      iconColor: "#581845",
      bgColor: "#581845",
      textColor: "#ffffff",
      accentColor: "#e6af2e",
      onClick: () => navigate("/dashboard/reservas"),
      permission: PERMISSIONS.RESERVAS.CREATE,
    },
    {
      id: "gestionar-mesas",
      title: "Mesas",
      description: "Administrar mesas",
      icon: Table,
      iconColor: "#581845",
      bgColor: "#581845",
      textColor: "#ffffff",
      accentColor: "#e6af2e",
      onClick: () => navigate("/dashboard/mesas"),
      permission: PERMISSIONS.MESAS.VIEW,
    },
    {
      id: "productos",
      title: "Productos",
      description: "Gestionar menú",
      icon: Package,
      iconColor: "#581845",
      bgColor: "#581845",
      textColor: "#ffffff",
      accentColor: "#e6af2e",
      onClick: () => navigate("/dashboard/productos"),
      permission: PERMISSIONS.PRODUCTOS.VIEW,
    },
    {
      id: "cocina",
      title: "Cocina",
      description: "Preparar pedidos",
      icon: ChefHat,
      iconColor: "#581845",
      bgColor: "#581845",
      textColor: "#ffffff",
      accentColor: "#e6af2e",
      onClick: () => navigate("/dashboard/cocina"),
      permission: PERMISSIONS.ORDENES.VIEW,
    },
    {
      id: "inventario",
      title: "Inventario",
      description: "Control de stock",
      icon: Archive,
      iconColor: "#581845",
      bgColor: "#581845",
      textColor: "#ffffff",
      accentColor: "#e6af2e",
      onClick: () => navigate("/dashboard/inventario"),
      permission: PERMISSIONS.INVENTARIO.VIEW,
    },
    {
      id: "empleados",
      title: "Empleados",
      description: "Gestionar personal",
      icon: Users,
      iconColor: "#581845",
      bgColor: "#581845",
      textColor: "#ffffff",
      accentColor: "#e6af2e",
      onClick: () => navigate("/dashboard/empleados"),
      permission: PERMISSIONS.EMPLEADOS.VIEW,
    },
    {
      id: "estadisticas",
      title: "Estadísticas",
      description: "Análisis y reportes",
      icon: BarChart3,
      iconColor: "#581845",
      bgColor: "#581845",
      textColor: "#ffffff",
      accentColor: "#e6af2e",
      onClick: () => navigate("/dashboard/estadisticas"),
      permission: PERMISSIONS.ESTADISTICAS.VIEW,
    },
  ];

  // Filtrar acciones según permisos del usuario
  const availableActions = allActions.filter((action) =>
    can(action.permission)
  );

  // Mostrar hasta 8 acciones
  const displayedActions = availableActions.slice(0, 8);

  if (displayedActions.length === 0) {
    return null; // No mostrar nada si no hay acciones disponibles
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedActions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.id}
            onClick={action.onClick}
            className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left"
            style={{ backgroundColor: action.bgColor }}
          >
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: action.accentColor,
                }}
              >
                <Icon className="w-6 h-6" style={{ color: action.iconColor }} />
              </div>
              <div>
                <h4 className="font-bold" style={{ color: action.textColor }}>
                  {action.title}
                </h4>
                <p
                  className="text-sm"
                  style={{
                    color: action.accentColor,
                  }}
                >
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;
