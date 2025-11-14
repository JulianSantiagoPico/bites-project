import { useState, useEffect } from "react";
import { getMeseroNombre } from "../../utils/mesasUtils";

const AsignarMeseroModal = ({ mesa, meseros, isOpen, onClose, onConfirm }) => {
  const [selectedMesero, setSelectedMesero] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mesa?.meseroAsignado) {
      setSelectedMesero(
        mesa.meseroAsignado.id || mesa.meseroAsignado._id || ""
      );
    } else {
      setSelectedMesero("");
    }
  }, [mesa, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onConfirm(mesa, selectedMesero || null);
      onClose();
    } catch (error) {
      console.error("Error al asignar mesero:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mesa) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-8 max-w-md w-full"
        style={{ backgroundColor: "white" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-primary">Asignar Mesero</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-textMain"
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información de la mesa */}
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: "#EFF6FF",
              borderColor: "#BFDBFE",
            }}
          >
            <p className="text-sm text-textSecondary mb-1">
              Asignando mesero para:
            </p>
            <p className="text-lg font-bold text-primary">
              Mesa #{mesa.numero}
            </p>
            <p className="text-sm text-textSecondary">
              {mesa.ubicacion} • Capacidad: {mesa.capacidad} personas
            </p>
          </div>

          {/* Mesero actual */}
          {mesa.meseroAsignado && (
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              <p className="text-sm text-textSecondary mb-1">Mesero actual:</p>
              <p className="text-base font-semibold text-textMain">
                {getMeseroNombre(mesa.meseroAsignado)}
              </p>
            </div>
          )}

          {/* Selector de mesero */}
          <div>
            <label
              htmlFor="mesero"
              className="block text-sm font-medium text-textMain mb-2"
            >
              Seleccionar Mesero
            </label>
            <select
              id="mesero"
              value={selectedMesero}
              onChange={(e) => setSelectedMesero(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-textMain"
            >
              <option value="">Sin asignar</option>
              {meseros.map((mesero) => (
                <option key={mesero.id} value={mesero.id}>
                  {mesero.nombre} {mesero.apellido}
                  {!mesero.activo && " (Inactivo)"}
                </option>
              ))}
            </select>
            {meseros.length === 0 && (
              <p className="mt-2 text-sm" style={{ color: "#F59E0B" }}>
                ⚠️ No hay meseros disponibles. Crea meseros primero en el módulo
                de Empleados.
              </p>
            )}
          </div>

          {/* Info */}
          <div
            className="p-3 rounded-lg border"
            style={{
              backgroundColor: "#FFFBEB",
              borderColor: "#FDE68A",
            }}
          >
            <p className="text-xs text-textSecondary">
              💡 <strong>Nota:</strong> El mesero asignado será responsable de
              atender esta mesa y sus pedidos.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity bg-gray-100 text-textMain"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || meseros.length === 0}
            >
              {isSubmitting ? "Asignando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AsignarMeseroModal;
