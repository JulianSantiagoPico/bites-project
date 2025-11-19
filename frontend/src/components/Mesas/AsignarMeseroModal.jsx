import { useState, useEffect } from "react";
import { getMeseroNombre } from "../../utils/mesasUtils";
import { X, User, Save } from "lucide-react";

const AsignarMeseroModal = ({ mesa, meseros, isOpen, onClose, onConfirm }) => {
  const [selectedMesero, setSelectedMesero] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mesa?.meseroAsignado) {
      // Handle both populated object and ID string
      const meseroId =
        typeof mesa.meseroAsignado === "object"
          ? mesa.meseroAsignado.id || mesa.meseroAsignado._id
          : mesa.meseroAsignado;

      setSelectedMesero(meseroId || "");
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Asignar Mesero
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información de la mesa */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-sm text-gray-600 mb-1">Asignando mesero para:</p>
            <p className="text-lg font-bold text-primary">
              Mesa #{mesa.numero}
            </p>
            <p className="text-sm text-gray-500">
              {mesa.ubicacion} • Capacidad: {mesa.capacidad} personas
            </p>
          </div>

          {/* Mesero actual */}
          {mesa.meseroAsignado && (
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Mesero actual:</p>
              <p className="text-base font-semibold text-gray-800">
                {getMeseroNombre(mesa.meseroAsignado)}
              </p>
            </div>
          )}

          {/* Selector de mesero */}
          <div>
            <label
              htmlFor="mesero"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Seleccionar Mesero
            </label>
            <select
              id="mesero"
              value={selectedMesero}
              onChange={(e) => setSelectedMesero(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800"
            >
              <option value="">Sin asignar</option>
              {meseros && meseros.length > 0 ? (
                meseros.map((mesero) => (
                  <option
                    key={mesero.id || mesero._id}
                    value={mesero.id || mesero._id}
                  >
                    {mesero.nombre} {mesero.apellido}
                    {!mesero.activo && " (Inactivo)"}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No hay meseros disponibles
                </option>
              )}
            </select>
            {meseros.length === 0 && (
              <p className="mt-2 text-sm text-amber-500">
                ⚠️ No hay meseros disponibles. Crea meseros primero en el módulo
                de Empleados.
              </p>
            )}
          </div>

          {/* Info */}
          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-100">
            <p className="text-xs text-gray-600">
              💡 <strong>Nota:</strong> El mesero asignado será responsable de
              atender esta mesa y sus pedidos.
            </p>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-medium transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary hover:opacity-90 text-white rounded-lg font-medium transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || meseros.length === 0}
            >
              <Save size={18} />
              {isSubmitting ? "Asignando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AsignarMeseroModal;
