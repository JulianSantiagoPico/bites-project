import { useState } from "react";
import {
  Clock,
  Users,
  UtensilsCrossed,
  ChevronDown,
  Play,
  CheckCircle,
  Eye,
  AlertTriangle,
} from "lucide-react";

/**
 * Obtener color según prioridad
 */
const getPrioridadColor = (prioridad) => {
  switch (prioridad) {
    case "alta":
      return {
        bg: "#a4161a20",
        border: "#a4161a",
        text: "#a4161a",
      };
    case "media":
      return {
        bg: "#ffd16620",
        border: "#ffd166",
        text: "#c89d00",
      };
    default:
      return {
        bg: "#6bbf5920",
        border: "#6bbf59",
        text: "#6bbf59",
      };
  }
};

/**
 * Obtener badge de estado
 */
const getEstadoBadge = (estado) => {
  const badges = {
    pendiente: {
      label: "Pendiente",
      color: "#e6af2e",
      bg: "#e6af2e20",
    },
    en_preparacion: {
      label: "En Preparación",
      color: "#581845",
      bg: "#58184520",
    },
  };

  return badges[estado] || badges.pendiente;
};

/**
 * Componente Card para mostrar una orden en cocina
 */
const OrdenCard = ({ orden, onComenzar, onTerminar, onViewDetail }) => {
  const [showItems, setShowItems] = useState(false);

  const estadoBadge = getEstadoBadge(orden.estado);
  const prioridadColor = getPrioridadColor(orden.prioridad);

  return (
    <div
      className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border overflow-hidden bg-white"
      style={{
        borderColor:
          orden.prioridad === "alta" ? prioridadColor.border : "#E5E7EB",
      }}
    >
      {/* Header */}
      <div
        className="p-4 pb-3 border-b"
        style={{
          borderColor: "#F3F4F6",
        }}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-primary">
              {orden.numeroPedido}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Users className="w-4 h-4 text-textSecondary" />
              <span className="text-sm text-textSecondary">
                Mesa {orden.mesaId?.numero || "N/A"}
                {orden.mesaId?.ubicacion && ` - ${orden.mesaId.ubicacion}`}
              </span>
            </div>
          </div>

          {/* Badge de estado */}
          <span
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor: estadoBadge.color,
              color: "white",
            }}
          >
            {estadoBadge.label}
          </span>
        </div>

        {/* Tiempo de espera y prioridad */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" style={{ color: prioridadColor.text }} />
            <span
              className="text-sm font-semibold"
              style={{ color: prioridadColor.text }}
            >
              {orden.tiempoEspera || 0} min
            </span>
          </div>

          {orden.prioridad === "alta" && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{ backgroundColor: prioridadColor.bg }}
            >
              <AlertTriangle
                className="w-3 h-3"
                style={{ color: prioridadColor.text }}
              />
              <span
                className="text-xs font-bold uppercase"
                style={{ color: prioridadColor.text }}
              >
                Urgente
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Items del pedido */}
      <div className="p-4">
        <button
          onClick={() => setShowItems(!showItems)}
          className="w-full flex items-center justify-between text-left mb-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-textSecondary" />
            <span className="font-medium text-textMain">
              {orden.items?.length || 0} producto(s)
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-textSecondary transition-transform ${
              showItems ? "rotate-180" : ""
            }`}
          />
        </button>

        {showItems && (
          <div className="space-y-2 mt-2 ml-2">
            {orden.items?.map((item, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-2 rounded-lg bg-gray-50"
              >
                <div className="flex-1">
                  <p className="font-medium text-textMain">
                    {item.cantidad}x {item.nombre}
                  </p>
                  {item.notas && (
                    <p className="text-xs text-textSecondary mt-1 italic">
                      📝 {item.notas}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notas generales */}
        {orden.notas && (
          <div
            className="mt-3 p-3 rounded-lg border-l-4"
            style={{
              backgroundColor: "#ffd16610",
              borderColor: "#ffd166",
            }}
          >
            <p className="text-sm text-textMain">
              <span className="font-semibold">Notas: </span>
              {orden.notas}
            </p>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div
        className="p-4 bg-gray-50 border-t flex gap-2"
        style={{ borderColor: "#F3F4F6" }}
      >
        <button
          onClick={() => onViewDetail(orden)}
          className="flex-1 px-4 py-2 rounded-lg font-medium border-2 text-textMain hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          style={{ borderColor: "#E5E7EB" }}
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Ver Detalle</span>
        </button>

        {orden.estado === "pendiente" && (
          <button
            onClick={() => onComenzar(orden)}
            className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#581845" }}
          >
            <Play className="w-4 h-4" />
            Comenzar
          </button>
        )}

        {orden.estado === "en_preparacion" && (
          <button
            onClick={() => onTerminar(orden)}
            className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#6bbf59" }}
          >
            <CheckCircle className="w-4 h-4" />
            Listo
          </button>
        )}
      </div>
    </div>
  );
};

export default OrdenCard;
