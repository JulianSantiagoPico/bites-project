import { useState } from "react";

/**
 * Modal para ajustar el stock de un item (entrada o salida)
 */
const StockAdjustmentModal = ({ isOpen, item, onAdjust, onClose }) => {
  const [tipo, setTipo] = useState("entrada");
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!cantidad || cantidad <= 0) {
      newErrors.cantidad = "La cantidad debe ser mayor a 0";
    }

    if (tipo === "salida" && parseFloat(cantidad) > item.cantidad) {
      newErrors.cantidad = "No hay suficiente stock para esta salida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onAdjust(item, {
        tipo,
        cantidad: parseFloat(cantidad),
        motivo,
      });

      // Resetear formulario
      setCantidad("");
      setMotivo("");
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error al ajustar stock:", error);
      setErrors({ general: error.message || "Error al ajustar el stock" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calcularNuevaCantidad = () => {
    if (!cantidad) return item.cantidad;
    const cantidadNum = parseFloat(cantidad);
    if (tipo === "entrada") {
      return item.cantidad + cantidadNum;
    } else {
      return Math.max(0, item.cantidad - cantidadNum);
    }
  };

  const nuevaCantidad = calcularNuevaCantidad();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-8 max-w-2xl w-full"
        style={{ backgroundColor: "white" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-primary">Ajustar Stock</h3>
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

        {/* Información del item */}
        <div className="p-4 rounded-lg bg-background mb-6">
          <h4 className="font-semibold text-primary mb-2">{item.nombre}</h4>
          <div className="flex items-center gap-4 text-sm text-textSecondary">
            <span>
              Stock actual:{" "}
              <strong className="text-primary">
                {item.cantidad} {item.unidadMedida}
              </strong>
            </span>
            <span>•</span>
            <span>Categoría: {item.categoria}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error general */}
          {errors.general && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm font-medium text-red-800">
                {errors.general}
              </p>
            </div>
          )}

          {/* Tipo de ajuste */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-textMain">
              Tipo de Ajuste <span className="text-primary">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  tipo === "entrada"
                    ? "border-green-500 bg-green-50"
                    : "border-secondary bg-background"
                }`}
              >
                <input
                  type="radio"
                  name="tipo"
                  value="entrada"
                  checked={tipo === "entrada"}
                  onChange={(e) => setTipo(e.target.value)}
                  className="hidden"
                />
                <span className="text-2xl">📦</span>
                <div>
                  <p className="font-semibold text-textMain">Entrada</p>
                  <p className="text-xs text-textSecondary">Agregar stock</p>
                </div>
              </label>

              <label
                className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  tipo === "salida"
                    ? "border-orange-500 bg-orange-50"
                    : "border-secondary bg-background"
                }`}
              >
                <input
                  type="radio"
                  name="tipo"
                  value="salida"
                  checked={tipo === "salida"}
                  onChange={(e) => setTipo(e.target.value)}
                  className="hidden"
                />
                <span className="text-2xl">📤</span>
                <div>
                  <p className="font-semibold text-textMain">Salida</p>
                  <p className="text-xs text-textSecondary">Retirar stock</p>
                </div>
              </label>
            </div>
          </div>

          {/* Cantidad */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-textMain">
              Cantidad <span className="text-primary">*</span>
            </label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => {
                setCantidad(e.target.value);
                if (errors.cantidad) setErrors({});
              }}
              step="0.01"
              min="0.01"
              className={`px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all text-textMain ${
                errors.cantidad ? "border-primary" : "border-secondary"
              }`}
              placeholder="Cantidad a ajustar"
            />
            {errors.cantidad && (
              <span className="text-xs text-primary">{errors.cantidad}</span>
            )}
          </div>

          {/* Motivo */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-textMain">Motivo</label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              className="px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all text-textMain border-secondary resize-none"
              placeholder="Ej: Compra de mercancía nueva, Uso en cocina, Merma por deterioro..."
            />
          </div>

          {/* Preview del ajuste */}
          {cantidad && (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-medium text-blue-800">
                  Vista Previa del Ajuste
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-blue-700">
                  {item.cantidad} {item.unidadMedida}
                </span>
                <span className="text-blue-600 font-bold">
                  {tipo === "entrada" ? "+" : "-"} {cantidad}{" "}
                  {item.unidadMedida}
                </span>
                <span className="text-blue-600">→</span>
                <span className="text-blue-800 font-bold">
                  {nuevaCantidad} {item.unidadMedida}
                </span>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg border border-secondary bg-white text-textMain text-sm font-medium cursor-pointer transition-all hover:opacity-80"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-lg border-none text-sm font-semibold cursor-pointer transition-all ${
                isSubmitting
                  ? "bg-backgroundSecondary text-textSecondary cursor-not-allowed"
                  : tipo === "entrada"
                  ? "bg-green-500 text-white hover:opacity-90"
                  : "bg-orange-500 text-white hover:opacity-90"
              }`}
            >
              {isSubmitting
                ? "Ajustando..."
                : tipo === "entrada"
                ? "Agregar Stock"
                : "Retirar Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;
