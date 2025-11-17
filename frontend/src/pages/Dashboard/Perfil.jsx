import { useState } from "react";
import { Lock, User as UserIcon } from "lucide-react";
import { usePerfil } from "../../hooks/usePerfil";
import { PerfilHeader } from "../../components/Perfil/PerfilHeader";
import { InformacionPersonal } from "../../components/Perfil/InformacionPersonal";
import { EstadisticasUsuario } from "../../components/Perfil/EstadisticasUsuario";
import { CambiarPasswordModal } from "../../components/Perfil/CambiarPasswordModal";
import Notification from "../../components/Notification";

const Perfil = () => {
  const {
    perfil,
    stats,
    loading,
    error,
    actualizando,
    actualizarPerfil,
    cambiarPassword,
    cargarPerfil,
  } = usePerfil();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleActualizarPerfil = async (datos) => {
    const resultado = await actualizarPerfil(datos);
    if (resultado.success) {
      showNotification(
        "success",
        resultado.message || "Perfil actualizado correctamente"
      );
    } else {
      showNotification(
        "error",
        resultado.message || "Error al actualizar el perfil"
      );
    }
    return resultado;
  };

  const handleCambiarPassword = async (
    currentPassword,
    newPassword,
    confirmPassword
  ) => {
    const resultado = await cambiarPassword(
      currentPassword,
      newPassword,
      confirmPassword
    );
    if (resultado.success) {
      showNotification(
        "success",
        resultado.message || "Contraseña cambiada correctamente"
      );
    } else {
      showNotification(
        "error",
        resultado.message || "Error al cambiar la contraseña"
      );
    }
    return resultado;
  };

  if (loading && !perfil) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !perfil) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
        <p className="font-medium">Error al cargar el perfil</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={cargarPerfil}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!perfil) return null;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Notificaciones */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-linear-to-br from-primary to-[#6d2254] rounded-2xl shadow-lg">
            <UserIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-600 mt-1">
              Gestiona tu información personal y configuración
            </p>
          </div>
        </div>
      </div>

      {/* Header del perfil */}
      <div className="mb-6">
        <PerfilHeader perfil={perfil} />
      </div>

      {/* Grid de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Columna izquierda - Información personal (2/3) */}
        <div className="lg:col-span-2">
          <InformacionPersonal
            perfil={perfil}
            onActualizar={handleActualizarPerfil}
            actualizando={actualizando}
          />
        </div>

        {/* Columna derecha - Acciones rápidas (1/3) */}
        <div className="space-y-6">
          {/* Cambiar contraseña */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Seguridad
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Mantén tu cuenta segura actualizando tu contraseña regularmente
            </p>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full bg-linear-to-r from-primary to-[#6d2254] text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
            >
              <Lock className="w-5 h-5" />
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <EstadisticasUsuario stats={stats} rol={perfil.rol} />

      {/* Modal de cambio de contraseña */}
      <CambiarPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onCambiar={handleCambiarPassword}
        actualizando={actualizando}
      />
    </div>
  );
};

export default Perfil;
