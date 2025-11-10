import { useState } from "react";
import colors from "../../styles/colors";

const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [userData, setUserData] = useState({
    nombre: "Administrador Principal",
    email: "admin@bites.com",
    telefono: "555-1234",
    rol: "Administrador",
    fechaIngreso: "2023-01-15",
    direccion: "Calle Principal #123, Ciudad",
    foto: "👨‍💼",
  });

  const [editData, setEditData] = useState({ ...userData });

  const handleSave = () => {
    setUserData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const PasswordModal = () => (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={() => setShowPasswordModal(false)}
    >
      <div
        className="rounded-xl p-8 max-w-md w-full"
        style={{ backgroundColor: "white" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold" style={{ color: colors.primary }}>
            Cambiar Contraseña
          </h3>
          <button
            onClick={() => setShowPasswordModal(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
            style={{ color: colors.text }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              Contraseña Actual
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
              style={{
                borderColor: colors.secondary + "40",
                backgroundColor: colors.background,
              }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              Nueva Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
              style={{
                borderColor: colors.secondary + "40",
                backgroundColor: colors.background,
              }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
              style={{
                borderColor: colors.secondary + "40",
                backgroundColor: colors.background,
              }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="flex-1 py-3 rounded-lg font-medium border-2 hover:bg-gray-50 transition-colors"
              style={{
                borderColor: colors.secondary + "40",
                color: colors.text,
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: colors.primary }}
            >
              Cambiar Contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: colors.primary }}>
            Mi Perfil
          </h2>
          <p style={{ color: colors.textSecondary }}>
            Gestiona tu información personal y configuración
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2"
            style={{ backgroundColor: colors.primary }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Editar Perfil
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-6 py-3 rounded-lg font-medium border-2 hover:bg-gray-50 transition-colors"
              style={{
                borderColor: colors.secondary + "40",
                color: colors.text,
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              style={{ backgroundColor: colors.accent, color: colors.primary }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Guardar Cambios
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div
        className="rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: "white" }}
      >
        {/* Banner */}
        <div
          className="h-32 relative"
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          }}
        >
          <div className="absolute -bottom-16 left-8">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center text-6xl border-4 border-white shadow-lg"
              style={{ backgroundColor: colors.accent }}
            >
              {userData.foto}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <h2
                className="text-2xl font-bold"
                style={{ color: colors.primary }}
              >
                {userData.nombre}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className="px-4 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: colors.accent + "20",
                    color: colors.accent,
                  }}
                >
                  {userData.rol}
                </span>
                <span
                  className="text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  Miembro desde{" "}
                  {new Date(userData.fechaIngreso).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 rounded-lg font-medium border-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
              style={{
                borderColor: colors.secondary + "40",
                color: colors.text,
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              Cambiar Contraseña
            </button>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: colors.background }}
            >
              <h3
                className="text-lg font-bold mb-4 flex items-center gap-2"
                style={{ color: colors.primary }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Información Personal
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Nombre Completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.nombre}
                      onChange={(e) =>
                        setEditData({ ...editData, nombre: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                      style={{
                        borderColor: colors.secondary + "40",
                        backgroundColor: "white",
                      }}
                    />
                  ) : (
                    <p
                      className="font-medium"
                      style={{ color: colors.primary }}
                    >
                      {userData.nombre}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                      style={{
                        borderColor: colors.secondary + "40",
                        backgroundColor: "white",
                      }}
                    />
                  ) : (
                    <p
                      className="font-medium"
                      style={{ color: colors.primary }}
                    >
                      {userData.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Teléfono
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.telefono}
                      onChange={(e) =>
                        setEditData({ ...editData, telefono: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                      style={{
                        borderColor: colors.secondary + "40",
                        backgroundColor: "white",
                      }}
                    />
                  ) : (
                    <p
                      className="font-medium"
                      style={{ color: colors.primary }}
                    >
                      {userData.telefono}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Dirección
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editData.direccion}
                      onChange={(e) =>
                        setEditData({ ...editData, direccion: e.target.value })
                      }
                      rows="2"
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                      style={{
                        borderColor: colors.secondary + "40",
                        backgroundColor: "white",
                      }}
                    />
                  ) : (
                    <p
                      className="font-medium"
                      style={{ color: colors.primary }}
                    >
                      {userData.direccion}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics & Activity */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div
                className="rounded-xl p-6"
                style={{ backgroundColor: colors.background }}
              >
                <h3
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: colors.primary }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Estadísticas
                </h3>

                <div className="space-y-3">
                  <div
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: "white" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colors.accent + "20" }}
                      >
                        <span className="text-xl">📝</span>
                      </div>
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: colors.textSecondary }}
                        >
                          Órdenes Procesadas
                        </p>
                        <p
                          className="text-xl font-bold"
                          style={{ color: colors.primary }}
                        >
                          1,247
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: "white" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#10B98120" }}
                      >
                        <span className="text-xl">✅</span>
                      </div>
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: colors.textSecondary }}
                        >
                          Tareas Completadas
                        </p>
                        <p
                          className="text-xl font-bold"
                          style={{ color: colors.primary }}
                        >
                          856
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: "white" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#3B82F620" }}
                      >
                        <span className="text-xl">⏰</span>
                      </div>
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: colors.textSecondary }}
                        >
                          Horas Trabajadas
                        </p>
                        <p
                          className="text-xl font-bold"
                          style={{ color: colors.primary }}
                        >
                          1,840
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div
                className="rounded-xl p-6"
                style={{ backgroundColor: colors.background }}
              >
                <h3
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: colors.primary }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Acciones Rápidas
                </h3>

                <div className="space-y-2">
                  <button
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:shadow-md transition-all"
                    style={{ backgroundColor: "white" }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: colors.accent }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                    <span
                      className="font-medium"
                      style={{ color: colors.text }}
                    >
                      Configuración
                    </span>
                  </button>

                  <button
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:shadow-md transition-all"
                    style={{ backgroundColor: "white" }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: colors.accent }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <span
                      className="font-medium"
                      style={{ color: colors.text }}
                    >
                      Notificaciones
                    </span>
                  </button>

                  <button
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:shadow-md transition-all"
                    style={{ backgroundColor: "white" }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: "#EF4444" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span
                      className="font-medium"
                      style={{ color: colors.text }}
                    >
                      Cerrar Sesión
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className="rounded-xl shadow-md"
        style={{ backgroundColor: "white" }}
      >
        <div
          className="p-6 border-b"
          style={{ borderColor: colors.secondary + "20" }}
        >
          <h3
            className="text-xl font-bold flex items-center gap-2"
            style={{ color: colors.primary }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Actividad Reciente
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                action: "Procesó orden #ORD-245",
                time: "Hace 10 minutos",
                icon: "📝",
                color: colors.accent,
              },
              {
                action: "Actualizó información de Mesa 12",
                time: "Hace 1 hora",
                icon: "🍽️",
                color: "#3B82F6",
              },
              {
                action: "Agregó nuevo producto al menú",
                time: "Hace 2 horas",
                icon: "🍔",
                color: "#10B981",
              },
              {
                action: "Confirmó reserva para esta noche",
                time: "Hace 3 horas",
                icon: "📅",
                color: "#F59E0B",
              },
              {
                action: "Actualizó inventario",
                time: "Hace 5 horas",
                icon: "📦",
                color: colors.secondary,
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg hover:shadow-md transition-shadow"
                style={{ backgroundColor: colors.background }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: activity.color + "20" }}
                >
                  <span className="text-2xl">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium" style={{ color: colors.primary }}>
                    {activity.action}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showPasswordModal && <PasswordModal />}
    </div>
  );
};

export default Perfil;
