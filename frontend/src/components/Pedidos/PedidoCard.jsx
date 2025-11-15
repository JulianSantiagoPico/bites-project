import { useState } from "react";
import {
  MoreVertical,
  Eye,
  XCircle,
  Clock,
  UtensilsCrossed,
  User,
  Users,
  StickyNote,
  ChevronDown,
} from "lucide-react";
import {
  formatPrice,
  formatDateTime,
  getEstadoBadgeColor,
  getTimeElapsed,
  getEstadosDisponibles,
} from "../../utils/pedidosUtils";

/**
 * Componente Card para mostrar un pedido
 */
const PedidoCard = ({ pedido, onView, onChangeEstado, onCancel }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEstadoMenu, setShowEstadoMenu] = useState(false);

  const estadoInfo = getEstadoBadgeColor(pedido.estado);
  const timeElapsed = getTimeElapsed(pedido.createdAt);
  const estadosDisponibles = getEstadosDisponibles(pedido.estado);

  const handleChangeEstado = (nuevoEstado) => {
    onChangeEstado(pedido, nuevoEstado);
    setShowEstadoMenu(false);
  };

  return (
    <div
      className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border overflow-hidden bg-white"
      style={{
        borderColor: "#E5E7EB",
      }}
    >
      {/* Header con número de pedido y hora */}
      <div className="p-4 pb-3 border-b" style={{ borderColor: "#F3F4F6" }}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-primary">
            {pedido.numeroPedido}
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
                  style={{
                    backgroundColor: "white",
                    borderColor: "#E5E7EB",
                  }}
                >
                  <button
                    onClick={() => {
                      onView(pedido);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-textMain"
                  >
                    <Eye className="w-4 h-4" />
                    Ver detalles
                  </button>
                  {pedido.estado !== "entregado" &&
                    pedido.estado !== "cancelado" && (
                      <button
                        onClick={() => {
                          onCancel(pedido);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 text-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancelar pedido
                      </button>
                    )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Estado y tiempo */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
            style={{
              backgroundColor: estadoInfo.bgColor,
              color: estadoInfo.color,
            }}
          >
            {estadoInfo.label}
          </span>
          <span className="flex items-center gap-1 text-xs text-textSecondary">
            <Clock className="w-3 h-3" />
            {timeElapsed}
          </span>
        </div>
      </div>

      {/* Body con información */}
      <div className="p-4 space-y-3">
        {/* Mesa y Mesero */}
        <div className="flex items-center gap-1 text-sm text-textMain">
          <UtensilsCrossed className="w-4 h-4 text-gray-400" />
          <span className="font-medium">
            Mesa {pedido.mesaId?.numero || "N/A"}
          </span>
        </div>

        {pedido.meseroId && (
          <div className="flex items-center gap-1 text-sm text-textSecondary">
            <User className="w-4 h-4" />
            <span>
              {pedido.meseroId.nombre} {pedido.meseroId.apellido}
            </span>
          </div>
        )}

        {/* Cliente */}
        {pedido.nombreCliente && (
          <div className="flex items-center gap-1 text-sm text-textSecondary">
            <Users className="w-4 h-4" />
            <span>{pedido.nombreCliente}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t" style={{ borderColor: "#F3F4F6" }}></div>

        {/* Items del pedido */}
        <div>
          <p className="text-xs text-textSecondary font-medium mb-2">
            ITEMS DEL PEDIDO
          </p>
          <div className="space-y-1.5">
            {pedido.items?.slice(0, 3).map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-textMain">
                  <span className="font-semibold text-primary">
                    {item.cantidad}x
                  </span>{" "}
                  <span className="text-gray-600">{item.nombre}</span>
                </span>
                <span className="font-medium text-textMain">
                  {formatPrice(item.subtotal)}
                </span>
              </div>
            ))}
            {pedido.items?.length > 3 && (
              <p className="text-xs text-textSecondary italic">
                +{pedido.items.length - 3} producto
                {pedido.items.length - 3 > 1 ? "s" : ""} más
              </p>
            )}
          </div>
        </div>

        {/* Notas si existen */}
        {pedido.notas && (
          <div
            className="flex gap-2 p-2 rounded-lg text-xs"
            style={{
              backgroundColor: "#FEF3C7",
              color: "#78350F",
            }}
          >
            <StickyNote className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="italic">{pedido.notas}</span>
          </div>
        )}
      </div>

      {/* Footer con total */}
      <div
        className="px-4 py-3 border-t flex justify-between items-center"
        style={{
          backgroundColor: "#FAFAFA",
          borderColor: "#E5E7EB",
        }}
      >
        <div>
          <p className="text-xs text-textSecondary">Total</p>
          <p className="text-xs text-gray-500">
            {new Date(pedido.createdAt).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <p className="text-2xl font-bold text-accent">
          {formatPrice(pedido.total)}
        </p>
      </div>

      {/* Botón de cambiar estado */}
      {pedido.estado !== "entregado" && pedido.estado !== "cancelado" && (
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
                      <span>
                        {estado.icon} {estado.label}
                      </span>
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: estado.color,
                        }}
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidoCard;
