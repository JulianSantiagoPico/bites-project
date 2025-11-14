import { useState, useEffect } from "react";

const MesaModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    numero: "",
    capacidad: "",
    ubicacion: "Interior",
    estado: "disponible",
    notas: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos iniciales cuando se edita
  useEffect(() => {
    if (initialData) {
      setFormData({
        numero: initialData.numero || "",
        capacidad: initialData.capacidad || "",
        ubicacion: initialData.ubicacion || "Interior",
        estado: initialData.estado || "disponible",
        notas: initialData.notas || "",
      });
    } else {
      setFormData({
        numero: "",
        capacidad: "",
        ubicacion: "Interior",
        estado: "disponible",
        notas: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.numero || formData.numero < 1) {
      newErrors.numero = "El número de mesa debe ser mayor a 0";
    }

    if (
      !formData.capacidad ||
      formData.capacidad < 1 ||
      formData.capacidad > 20
    ) {
      newErrors.capacidad = "La capacidad debe estar entre 1 y 20 personas";
    }

    if (!formData.ubicacion) {
      newErrors.ubicacion = "La ubicación es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convertir a números
      const dataToSubmit = {
        ...formData,
        numero: parseInt(formData.numero),
        capacidad: parseInt(formData.capacidad),
      };

      await onSubmit(dataToSubmit);
      onClose();
    } catch (error) {
      console.error("Error al guardar mesa:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "white" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-primary">
            {initialData ? "Editar Mesa" : "Nueva Mesa"}
          </h3>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Número */}
          <div>
            <label
              htmlFor="numero"
              className="block text-sm font-medium text-textMain mb-1"
            >
              Número de Mesa <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              min="1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-textMain ${
                errors.numero ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: 5"
            />
            {errors.numero && (
              <p className="mt-1 text-sm text-red-500">{errors.numero}</p>
            )}
          </div>

          {/* Capacidad */}
          <div>
            <label
              htmlFor="capacidad"
              className="block text-sm font-medium text-textMain mb-1"
            >
              Capacidad <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="capacidad"
              name="capacidad"
              value={formData.capacidad}
              onChange={handleChange}
              min="1"
              max="20"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-textMain ${
                errors.capacidad ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: 4"
            />
            {errors.capacidad && (
              <p className="mt-1 text-sm text-red-500">{errors.capacidad}</p>
            )}
            <p className="mt-1 text-xs text-textSecondary">
              Capacidad en número de personas (1-20)
            </p>
          </div>

          {/* Ubicación */}
          <div>
            <label
              htmlFor="ubicacion"
              className="block text-sm font-medium text-textMain mb-1"
            >
              Ubicación <span className="text-red-500">*</span>
            </label>
            <select
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-textMain ${
                errors.ubicacion ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="Interior">🏠 Interior</option>
              <option value="Terraza">🌳 Terraza</option>
              <option value="Bar">🍷 Bar</option>
              <option value="VIP">⭐ VIP</option>
            </select>
            {errors.ubicacion && (
              <p className="mt-1 text-sm text-red-500">{errors.ubicacion}</p>
            )}
          </div>

          {/* Estado (solo al crear) */}
          {!initialData && (
            <div>
              <label
                htmlFor="estado"
                className="block text-sm font-medium text-textMain mb-1"
              >
                Estado Inicial
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-textMain"
              >
                <option value="disponible">✅ Disponible</option>
                <option value="reservada">📅 Reservada</option>
                <option value="en_limpieza">🧹 En Limpieza</option>
              </select>
            </div>
          )}

          {/* Notas */}
          <div>
            <label
              htmlFor="notas"
              className="block text-sm font-medium text-textMain mb-1"
            >
              Notas (opcional)
            </label>
            <textarea
              id="notas"
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              rows="3"
              maxLength="500"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-textMain"
              placeholder="Ej: Mesa cerca de la ventana"
            />
            <p className="mt-1 text-xs text-textSecondary">
              {formData.notas.length}/500 caracteres
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
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
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Guardando..."
                : initialData
                ? "Actualizar Mesa"
                : "Crear Mesa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MesaModal;
