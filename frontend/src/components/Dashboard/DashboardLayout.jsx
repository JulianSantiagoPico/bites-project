import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import RestaurantSetupModal from "../RestaurantSetupModal";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, completarConfiguracion } = useAuth();

  // Calcular si debe mostrar el modal directamente del estado del usuario
  // Solo mostrar para usuarios admin que no hayan completado la configuración
  const showSetupModal =
    user && user.rol === "admin" && !user.configuracionCompleta;

  // Manejar la finalización de la configuración
  const handleSetupComplete = async (restauranteData) => {
    const result = await completarConfiguracion(restauranteData);

    if (result.success) {
      console.log("DashboardLayout - Configuración exitosa");
    } else {
      console.error("DashboardLayout - Error en configuración:", result.error);
      throw new Error(result.error || "Error al configurar restaurante");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Modal de configuración del restaurante */}
      <RestaurantSetupModal
        isOpen={showSetupModal}
        onComplete={handleSetupComplete}
        restaurantName={user?.restauranteId?.nombre || "tu restaurante"}
      />

      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main
        className="flex-1 transition-all duration-300"
        style={{
          marginLeft: isCollapsed ? "80px" : "280px",
        }}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 backdrop-blur-sm border-b bg-background/95 border-secondary/20">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h2 className="text-2xl font-bold text-primary">Dashboard</h2>
              <p className="text-sm text-textSecondary">
                Bienvenido al panel de control
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
