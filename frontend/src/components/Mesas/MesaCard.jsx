import { useState } from "react";
import {
  getEstadoColor,
  getUbicacionIcon,
  formatEstado,
  getMeseroNombre,
  formatCapacidad,
  getEstadosDisponibles,
} from "../../utils/mesasUtils";

const MesaCard = ({
  mesa,
  onView,
  onEdit,
  onDelete,
  onChangeEstado,
  onAssign,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEstadoMenu, setShowEstadoMenu] = useState(false);

  const estadoColor = getEstadoColor(mesa.estado);
  const ubicacionIcon = getUbicacionIcon(mesa.ubicacion);
  const estadosDisponibles = getEstadosDisponibles(mesa.estado);

  const handleChangeEstado = (nuevoEstado) => {
    onChangeEstado(mesa, nuevoEstado);
    setShowEstadoMenu(false);
  };

  return (
    <div
      className="rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-l-4 overflow-hidden"
      style={{
        backgroundColor: "white",
        borderLeftColor: estadoColor.color,
      }}
    >
      {/* Header con número y estado */}
      <div className="p-4 flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-primary">
            Mesa #{mesa.numero}
          </h3>
          <span
            className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: estadoColor.bgColor,
              color: estadoColor.color,
            }}
          >
            {formatEstado(mesa.estado)}
          </span>
        </div>

        {/* Menú de acciones */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5"
              style={{ color: "#6B7280" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-20 py-1 border"
                style={{
                  backgroundColor: "white",
                  borderColor: "#E5E7EB",
                }}
              >
                <button
                  onClick={() => {
                    onView(mesa);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-textMain"
                >
                  <span>👁️</span>
                  Ver detalles
                </button>
                <button
                  onClick={() => {
                    onEdit(mesa);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-textMain"
                >
                  <span>✏️</span>
                  Editar
                </button>
                <button
                  onClick={() => {
                    onAssign(mesa);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-textMain"
                >
                  <span>👤</span>
                  Asignar mesero
                </button>
                <hr className="my-1" style={{ borderColor: "#E5E7EB" }} />
                <button
                  onClick={() => {
                    onDelete(mesa);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <span>🗑️</span>
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Body con información */}
      <div className="p-4 space-y-3">
        {/* Capacidad */}
        <div className="flex items-center gap-2 text-textMain">
          <span className="text-xl">👥</span>
          <span className="font-medium">{formatCapacidad(mesa.capacidad)}</span>
        </div>

        {/* Ubicación */}
        <div className="flex items-center gap-2 text-textMain">
          <span className="text-xl">{ubicacionIcon}</span>
          <span className="font-medium">{mesa.ubicacion}</span>
        </div>

        {/* Mesero asignado */}
        <div className="flex items-center gap-2 text-textMain">
          <span className="text-xl">👤</span>
          <span className="font-medium text-sm">
            {getMeseroNombre(mesa.meseroAsignado)}
          </span>
        </div>

        {/* Notas si existen */}
        {mesa.notas && (
          <div
            className="mt-2 p-2 rounded text-sm italic"
            style={{
              backgroundColor: "#F9FAFB",
              color: "#6B7280",
            }}
          >
            {mesa.notas}
          </div>
        )}
      </div>

      {/* Footer con botón de cambiar estado */}
      <div
        className="p-4 border-t"
        style={{
          backgroundColor: "#F9FAFB",
          borderColor: "#E5E7EB",
        }}
      >
        <div className="relative">
          <button
            onClick={() => setShowEstadoMenu(!showEstadoMenu)}
            className="w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-white hover:opacity-90 transition-opacity bg-primary disabled:opacity-50"
            disabled={estadosDisponibles.length === 0}
          >
            <span>🔄</span>
            Cambiar Estado
            {estadosDisponibles.length > 0 && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>

          {showEstadoMenu && estadosDisponibles.length > 0 && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowEstadoMenu(false)}
              />
              <div
                className="absolute bottom-full mb-2 left-0 right-0 rounded-lg shadow-lg z-20 py-1 border"
                style={{
                  backgroundColor: "white",
                  borderColor: "#E5E7EB",
                }}
              >
                {estadosDisponibles.map((estado) => (
                  <button
                    key={estado.value}
                    onClick={() => handleChangeEstado(estado.value)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between text-textMain"
                  >
                    <span>{estado.label}</span>
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: getEstadoColor(estado.value).color,
                      }}
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MesaCard;
