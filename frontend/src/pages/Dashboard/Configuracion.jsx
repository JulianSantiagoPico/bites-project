import { useState } from "react";
import { Settings, AlertCircle, RefreshCw } from "lucide-react";
import { useRestaurante } from "../../hooks/useRestaurante";
import ConfiguracionGeneral from "../../components/Restaurante/ConfiguracionGeneral";
import ConfiguracionHorarios from "../../components/Restaurante/ConfiguracionHorarios";
import ConfiguracionContacto from "../../components/Restaurante/ConfiguracionContacto";
import Notification from "../../components/Notification";

const TABS = [
  { id: "general", label: "General" },
  { id: "horarios", label: "Horarios" },
  { id: "contacto", label: "Contacto" },
];

const Configuracion = () => {
  const [tabActiva, setTabActiva] = useState("general");
  const [notification, setNotification] = useState(null);

  const {
    restaurante,
    loading,
    error,
    cargarRestaurante,
    actualizarNombre,
    actualizarHorarios,
    actualizarContacto,
  } = useRestaurante();

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleActualizarNombre = async (nombre) => {
    const result = await actualizarNombre(nombre);
    if (result.success) {
      showNotification("success", result.message);
    } else {
      showNotification("error", result.message);
    }
    return result;
  };

  const handleActualizarHorarios = async (horarios) => {
    const result = await actualizarHorarios(horarios);
    if (result.success) {
      showNotification("success", result.message);
    } else {
      showNotification("error", result.message);
    }
    return result;
  };

  const handleActualizarContacto = async (contactoData) => {
    const result = await actualizarContacto(contactoData);
    if (result.success) {
      showNotification("success", result.message);
    } else {
      showNotification("error", result.message);
    }
    return result;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#581845] to-[#6d2254] rounded-2xl shadow-lg">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Configuración del Restaurante
              </h1>
              <p className="text-gray-600 mt-1">
                Administra la información de tu restaurante
              </p>
            </div>
          </div>

          <button
            onClick={cargarRestaurante}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 text-[#581845] bg-[#581845]/10 rounded-xl hover:bg-[#581845]/20 transition-all duration-200 disabled:opacity-50 font-medium border border-[#581845]/20"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Recargar
          </button>
        </div>
      </div>

      {/* Error General */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1.5">
          <nav className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id)}
                className={`
                  flex-1 relative py-3 px-4 font-semibold text-sm transition-all duration-200 rounded-lg
                  ${
                    tabActiva === tab.id
                      ? "bg-gradient-to-r from-[#581845] to-[#6d2254] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {tabActiva === "general" && (
          <ConfiguracionGeneral
            restaurante={restaurante}
            onActualizar={handleActualizarNombre}
            loading={loading}
          />
        )}

        {tabActiva === "horarios" && (
          <ConfiguracionHorarios
            restaurante={restaurante}
            onActualizar={handleActualizarHorarios}
            loading={loading}
          />
        )}

        {tabActiva === "contacto" && (
          <ConfiguracionContacto
            restaurante={restaurante}
            onActualizar={handleActualizarContacto}
            loading={loading}
          />
        )}
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Configuracion;
