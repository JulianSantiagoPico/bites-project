import { useState, useEffect } from "react";
import { X, Calendar, Save } from "lucide-react";
import { mesasService } from "../../services/api";
import {
  OCASIONES,
  getOcasionLabel,
  validarTelefono,
  validarEmail,
  validarHora,
  validarFechaFutura,
  generarOpcionesHora,
} from "../../utils/reservasUtils";

/**
 * Modal para crear o editar una reserva
 */
const ReservaModal = ({ isOpen, reserva, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    nombreCliente: "",
    telefonoCliente: "",
    emailCliente: "",
    fecha: "",
    hora: "",
    numeroPersonas: 2,
    mesaAsignada: "",
    notas: "",
    ocasion: "ninguna",
  });

  const [mesas, setMesas] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const textMain = "#1f2937";
  const textSecondary = "#6b7280";
  const opcionesHora = generarOpcionesHora("11:00", "23:00");

  // Cargar datos de la reserva si está en modo edición
  useEffect(() => {
    if (reserva) {
      setFormData({
        nombreCliente: reserva.nombreCliente || "",
        telefonoCliente: reserva.telefonoCliente || "",
        emailCliente: reserva.emailCliente || "",
        fecha: reserva.fecha
          ? new Date(reserva.fecha).toISOString().split("T")[0]
          : "",
        hora: reserva.hora || "",
        numeroPersonas: reserva.numeroPersonas || 2,
        mesaAsignada: reserva.mesaAsignada?._id || "",
        notas: reserva.notas || "",
        ocasion: reserva.ocasion || "ninguna",
      });
    } else {
      // Resetear formulario en modo creación
      setFormData({
        nombreCliente: "",
        telefonoCliente: "",
        emailCliente: "",
        fecha: "",
        hora: "",
        numeroPersonas: 2,
        mesaAsignada: "",
        notas: "",
        ocasion: "ninguna",
      });
    }
    setErrors({});
  }, [reserva, isOpen]);

  // Cargar mesas disponibles
  useEffect(() => {
    if (isOpen) {
      fetchMesas();
    }
  }, [isOpen]);

  const fetchMesas = async () => {
    try {
      const response = await mesasService.getMesas();

      // La respuesta tiene la estructura: { success, data: { mesas: [...] } }
      const mesasArray = response.data?.mesas || response.data;

      if (response.success && mesasArray && Array.isArray(mesasArray)) {
        const mesasActivas = mesasArray.filter((m) => m.activo);
        setMesas(mesasActivas);
      } else {
        setMesas([]);
      }
    } catch (err) {
      setMesas([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar que existan mesas disponibles
    if (!mesas || mesas.length === 0) {
      newErrors.general =
        "No hay mesas disponibles. Por favor, crea al menos una mesa antes de hacer una reserva.";
    }

    // Validar nombre
    if (!formData.nombreCliente.trim()) {
      newErrors.nombreCliente = "El nombre del cliente es requerido";
    }

    // Validar teléfono
    if (!formData.telefonoCliente.trim()) {
      newErrors.telefonoCliente = "El teléfono es requerido";
    } else if (!validarTelefono(formData.telefonoCliente)) {
      newErrors.telefonoCliente = "Formato de teléfono inválido";
    }

    // Validar email (opcional, pero debe ser válido si se proporciona)
    if (formData.emailCliente && !validarEmail(formData.emailCliente)) {
      newErrors.emailCliente = "Formato de email inválido";
    }

    // Validar fecha
    if (!formData.fecha) {
      newErrors.fecha = "La fecha es requerida";
    } else if (!validarFechaFutura(formData.fecha)) {
      newErrors.fecha = "La fecha no puede ser en el pasado";
    }

    // Validar hora
    if (!formData.hora) {
      newErrors.hora = "La hora es requerida";
    } else if (!validarHora(formData.hora)) {
      newErrors.hora = "Formato de hora inválido (HH:MM)";
    }

    // Validar número de personas
    if (formData.numeroPersonas < 1 || formData.numeroPersonas > 30) {
      newErrors.numeroPersonas =
        "El número de personas debe estar entre 1 y 30";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Preparar datos para enviar
    const dataToSend = {
      ...formData,
    };

    // Remover mesaAsignada si está vacío o es una cadena vacía
    if (!dataToSend.mesaAsignada || dataToSend.mesaAsignada === "") {
      delete dataToSend.mesaAsignada;
    }

    try {
      await onSubmit(dataToSend);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 px-6 py-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#e5e7eb",
            zIndex: 10,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
            >
              <Calendar size={20} style={{ color: "#3b82f6" }} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: textMain }}>
              {reserva ? "Editar Reserva" : "Nueva Reserva"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} style={{ color: textSecondary }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error general */}
          {errors.general && (
            <div
              className="p-4 rounded-lg flex items-start gap-3"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
            >
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "#ef4444" }}>
                  {errors.general}
                </p>
              </div>
            </div>
          )}

          {/* Información del Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: textMain }}>
              Información del Cliente
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: textSecondary }}
                >
                  Nombre del Cliente <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="nombreCliente"
                  value={formData.nombreCliente}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: errors.nombreCliente ? "#ef4444" : "#d1d5db",
                    color: textMain,
                  }}
                  placeholder="Juan Pérez"
                />
                {errors.nombreCliente && (
                  <p className="mt-1 text-sm" style={{ color: "#ef4444" }}>
                    {errors.nombreCliente}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: textSecondary }}
                >
                  Teléfono <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="tel"
                  name="telefonoCliente"
                  value={formData.telefonoCliente}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: errors.telefonoCliente ? "#ef4444" : "#d1d5db",
                    color: textMain,
                  }}
                  placeholder="+1-555-0101"
                />
                {errors.telefonoCliente && (
                  <p className="mt-1 text-sm" style={{ color: "#ef4444" }}>
                    {errors.telefonoCliente}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: textSecondary }}
                >
                  Email (Opcional)
                </label>
                <input
                  type="email"
                  name="emailCliente"
                  value={formData.emailCliente}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: errors.emailCliente ? "#ef4444" : "#d1d5db",
                    color: textMain,
                  }}
                  placeholder="juan.perez@email.com"
                />
                {errors.emailCliente && (
                  <p className="mt-1 text-sm" style={{ color: "#ef4444" }}>
                    {errors.emailCliente}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Detalles de la Reserva */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: textMain }}>
              Detalles de la Reserva
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: textSecondary }}
                >
                  Fecha <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: errors.fecha ? "#ef4444" : "#d1d5db",
                    color: textMain,
                  }}
                />
                {errors.fecha && (
                  <p className="mt-1 text-sm" style={{ color: "#ef4444" }}>
                    {errors.fecha}
                  </p>
                )}
              </div>

              {/* Hora */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: textSecondary }}
                >
                  Hora <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: errors.hora ? "#ef4444" : "#d1d5db",
                    color: textMain,
                  }}
                >
                  <option value="">Seleccionar hora</option>
                  {opcionesHora.map((opcion) => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </select>
                {errors.hora && (
                  <p className="mt-1 text-sm" style={{ color: "#ef4444" }}>
                    {errors.hora}
                  </p>
                )}
              </div>

              {/* Número de Personas */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: textSecondary }}
                >
                  Número de Personas <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="number"
                  name="numeroPersonas"
                  value={formData.numeroPersonas}
                  onChange={handleChange}
                  min="1"
                  max="30"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: errors.numeroPersonas ? "#ef4444" : "#d1d5db",
                    color: textMain,
                  }}
                />
                {errors.numeroPersonas && (
                  <p className="mt-1 text-sm" style={{ color: "#ef4444" }}>
                    {errors.numeroPersonas}
                  </p>
                )}
              </div>

              {/* Ocasión */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: textSecondary }}
                >
                  Ocasión
                </label>
                <select
                  name="ocasion"
                  value={formData.ocasion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "#d1d5db",
                    color: textMain,
                  }}
                >
                  {Object.values(OCASIONES).map((ocasion) => (
                    <option key={ocasion} value={ocasion}>
                      {getOcasionLabel(ocasion)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mesa Asignada */}
              <div className="md:col-span-2">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: textSecondary }}
                >
                  Mesa Asignada (Opcional)
                </label>
                <select
                  name="mesaAsignada"
                  value={formData.mesaAsignada}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "#d1d5db",
                    color: textMain,
                  }}
                >
                  <option value="">Sin asignar</option>
                  {mesas.map((mesa, index) => {
                    // Intentar ambas formas de acceder al ID
                    const mesaId = mesa["_id"] || mesa._id || mesa.id;
                    return (
                      <option key={mesaId || `mesa-${index}`} value={mesaId}>
                        Mesa {mesa.numero} - Capacidad: {mesa.capacidad} -{" "}
                        {mesa.ubicacion}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Notas */}
              <div className="md:col-span-2">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: textSecondary }}
                >
                  Notas (Opcional)
                </label>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none"
                  style={{
                    borderColor: "#d1d5db",
                    color: textMain,
                  }}
                  placeholder="Preferencias especiales, alergias, etc."
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 pt-4 border-t"
            style={{ borderColor: "#e5e7eb" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              style={{
                color: textSecondary,
                backgroundColor: "#f3f4f6",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#e5e7eb";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6";
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              style={{
                color: "#ffffff",
                backgroundColor: loading ? "#9ca3af" : "#3b82f6",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#3b82f6";
                }
              }}
            >
              <Save size={18} />
              {loading
                ? "Guardando..."
                : reserva
                ? "Actualizar"
                : "Crear Reserva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservaModal;
