import { useState } from "react";
import {
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Users,
  MapPin,
  User,
  StickyNote,
  ChevronDown,
} from "lucide-react";
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
  const estadosDisponibles = getEstadosDisponibles(mesa.estado);

  const handleChangeEstado = (nuevoEstado) => {
    onChangeEstado(mesa, nuevoEstado);
    setShowEstadoMenu(false);
  };

  return (
    <div
      className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border overflow-hidden bg-white"
      style={{ borderColor: "#E5E7EB" }}
    >
      {/* Header */}
      <div className="p-4 pb-3 border-b" style={{ borderColor: "#F3F4F6" }}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-primary">
            Mesa #{mesa.numero}
          </h3>

          {/* Menú de acciones */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div
                  className="absolute right-0 mt-1 w-44 rounded-lg shadow-lg z-20 py-1 border"
                  style={{ backgroundColor: "white", borderColor: "#E5E7EB" }}
                >
                  <button
                    onClick={() => {
                      onView(mesa);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-textMain"
                  >
                    <Eye className="w-4 h-4" />
                    Ver detalles
                  </button>
                  <button
                    onClick={() => {
                      onEdit(mesa);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-textMain"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onAssign(mesa);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-textMain"
                  >
                    <User className="w-4 h-4" />
                    Asignar mesero
                  </button>
                  <hr className="my-1" style={{ borderColor: "#E5E7EB" }} />
                  <button
                    onClick={() => {
                      onDelete(mesa);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Estado */}
        <span
          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
          style={{
            backgroundColor: estadoColor.bgColor,
            color: estadoColor.color,
          }}
        >
          {formatEstado(mesa.estado)}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Capacidad */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-textSecondary">
            <Users className="w-4 h-4" />
            <span>Capacidad</span>
          </div>
          <span className="font-medium text-textMain">
            {formatCapacidad(mesa.capacidad)}
          </span>
        </div>

        {/* Ubicación */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-textSecondary">
            <MapPin className="w-4 h-4" />
            <span>Ubicación</span>
          </div>
          <span className="font-medium text-textMain">{mesa.ubicacion}</span>
        </div>

        {/* Mesero asignado */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-textSecondary">
            <User className="w-4 h-4" />
            <span>Mesero</span>
          </div>
          <span className="font-medium text-textMain text-xs">
            {getMeseroNombre(mesa.meseroAsignado)}
          </span>
        </div>

        {/* Notas si existen */}
        {mesa.notas && (
          <>
            <div className="border-t" style={{ borderColor: "#F3F4F6" }}></div>
            <div
              className="flex gap-2 p-2 rounded-lg text-xs"
              style={{ backgroundColor: "#F9FAFB", color: "#6B7280" }}
            >
              <StickyNote className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span className="italic">{mesa.notas}</span>
            </div>
          </>
        )}
      </div>

      {/* Footer con botón de cambiar estado */}
      <div className="px-4 pb-4">
        <div className="relative">
          <button
            onClick={() => setShowEstadoMenu(!showEstadoMenu)}
            className="w-full px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor:
                estadosDisponibles.length > 0 ? "#581845" : "#9CA3AF",
            }}
            disabled={estadosDisponibles.length === 0}
          >
            Cambiar Estado
            {estadosDisponibles.length > 0 && (
              <ChevronDown className="w-4 h-4" />
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
                style={{ backgroundColor: "white", borderColor: "#E5E7EB" }}
              >
                {estadosDisponibles.map((estado) => (
                  <button
                    key={estado.value}
                    onClick={() => handleChangeEstado(estado.value)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between text-sm text-textMain"
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
