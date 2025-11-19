import { useState, useEffect } from "react";
import PasswordInput, { validatePassword } from "../PasswordInput";

const EmpleadoForm = ({
  employee,
  onSubmit,
  onCancel,
  rolesDisplay,
  rolesIcons,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol: "mesero",
    telefono: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (employee) {
      setFormData({
        nombre: employee.nombre || "",
        apellido: employee.apellido || "",
        email: employee.email || "",
        password: "", // No prellenar password al editar
        rol: employee.rol || "mesero",
        telefono: employee.telefono || "",
      });
    }
  }, [employee]);

  // Construir roles dinámicamente desde rolesDisplay (props)
  const roles = Object.entries(rolesDisplay || {}).map(([value, label]) => ({
    value,
    label,
    icon: (rolesIcons && rolesIcons[value]) || "👤",
  }));

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }

    // Validar email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Validar password (solo al crear)
    if (!employee) {
      if (!formData.password) {
        newErrors.password = "La contraseña es requerida";
      } else {
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.cumpleTodos) {
          newErrors.password = passwordValidation.mensaje;
        }
      }
    }

    // Validar teléfono (opcional)
    if (formData.telefono && formData.telefono.length < 10) {
      newErrors.telefono = "El teléfono debe tener al menos 10 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Limpiar error del servidor al hacer cambios
    if (serverError) {
      setServerError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar errores previos
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Si es edición, no enviar el password si está vacío
      const dataToSend = { ...formData };
      if (employee && !dataToSend.password) {
        delete dataToSend.password;
      }
      if (employee) {
        delete dataToSend.email; // No permitir cambiar email al editar
      }

      await onSubmit(dataToSend);

      // Resetear formulario si es creación exitosa
      if (!employee) {
        setFormData({
          nombre: "",
          apellido: "",
          email: "",
          password: "",
          rol: "mesero",
          telefono: "",
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Error al enviar formulario:", error);

      // Manejar errores del servidor
      if (error.errors && Array.isArray(error.errors)) {
        // Errores de validación del backend
        const newErrors = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.msg;
          }
        });
        setErrors(newErrors);
        setServerError("Por favor corrige los errores en el formulario");
      } else if (error.message) {
        // Error general del servidor
        setServerError(error.message);
      } else {
        setServerError(
          "Error al guardar empleado. Por favor intenta de nuevo."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Error del servidor */}
      {serverError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{serverError}</p>
          </div>
          <button
            type="button"
            onClick={() => setServerError("")}
            className="text-red-500 hover:text-red-700"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Nombre y Apellido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-textMain">
            Nombre <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all text-textMain ${
              errors.nombre ? "border-primary" : "border-secondary"
            }`}
            placeholder="Ej: Juan"
          />
          {errors.nombre && (
            <span className="text-xs text-primary">{errors.nombre}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-textMain">
            Apellido <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className={`px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all text-textMain ${
              errors.apellido ? "border-primary" : "border-secondary"
            }`}
            placeholder="Ej: Pérez"
          />
          {errors.apellido && (
            <span className="text-xs text-primary">{errors.apellido}</span>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-textMain">
          Email <span className="text-primary">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!!employee}
          className={`px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all text-textMain ${
            errors.email ? "border-primary" : "border-secondary"
          } ${
            employee
              ? "bg-backgroundSecondary cursor-not-allowed text-textSecondary"
              : "bg-white"
          }`}
          placeholder="empleado@email.com"
        />
        {errors.email && (
          <span className="text-xs text-primary">{errors.email}</span>
        )}
        {employee && (
          <small className="text-xs text-textSecondary">
            El email no se puede modificar
          </small>
        )}
      </div>

      {/* Password */}
      {!employee && (
        <PasswordInput
          value={formData.password}
          onChange={handleChange}
          name="password"
          label="Contraseña"
          error={errors.password}
          showRequirements={true}
          disabled={isSubmitting}
          required={true}
          className="outline-none border transition-all"
        />
      )}

      {/* Rol */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-textMain">
          Rol <span className="text-primary">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {roles.map((role) => (
            <label
              key={role.value}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all text-textMain ${
                formData.rol === role.value
                  ? "border-accent bg-backgroundSecondary shadow-[0_0_0_3px_rgba(230,175,46,0.2)]"
                  : "border-secondary bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="rol"
                value={role.value}
                checked={formData.rol === role.value}
                onChange={handleChange}
                className="hidden"
              />
              <span className="text-3xl mb-2">{role.icon}</span>
              <span className="text-sm font-medium text-textMain">
                {role.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Teléfono */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-textMain">Teléfono</label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className={`px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all text-textMain ${
            errors.telefono ? "border-primary" : "border-secondary"
          }`}
          placeholder="Ej: 3001234567"
        />
        {errors.telefono && (
          <span className="text-xs text-primary">{errors.telefono}</span>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={onCancel}
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
              : "bg-accent text-primary hover:opacity-90"
          }`}
        >
          {isSubmitting
            ? "Guardando..."
            : employee
            ? "Actualizar Empleado"
            : "Crear Empleado"}
        </button>
      </div>
    </form>
  );
};

export default EmpleadoForm;
