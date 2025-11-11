import { useState } from "react";
import "./RestaurantSetupModal.css";

const RestaurantSetupModal = ({ isOpen, onComplete, restaurantName }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Información básica
    descripcion: "",

    // Información de contacto
    telefono: "",
    email: "",

    // Dirección
    calle: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
    pais: "Colombia",

    // Configuración del negocio
    moneda: "COP",

    // Horarios (día de ejemplo)
    horarioDefault: {
      apertura: "08:00",
      cierre: "22:00",
    },
    aplicarATodos: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("horarioDefault.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        horarioDefault: {
          ...prev.horarioDefault,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.descripcion.trim()) {
        newErrors.descripcion = "La descripción es requerida";
      }
      if (!formData.telefono.trim()) {
        newErrors.telefono = "El teléfono es requerido";
      }
      // Validar email si se proporciona
      if (formData.email && formData.email.trim()) {
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = "El email no es válido";
        }
      }
    } else if (step === 2) {
      if (!formData.calle.trim()) {
        newErrors.calle = "La calle es requerida";
      }
      if (!formData.ciudad.trim()) {
        newErrors.ciudad = "La ciudad es requerida";
      }
      if (!formData.estado.trim()) {
        newErrors.estado = "El estado/departamento es requerido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (validateStep()) {
      setStep(step + 1);
      setErrors({});
    }
  };

  const handleBack = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Solo permitir submit si estamos en el paso 3
    if (step !== 3) {
      return;
    }

    if (!validateStep()) {
      return;
    }

    setLoading(true);

    try {
      // Preparar datos de horarios
      const dias = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo",
      ];
      const horarios = {};

      if (formData.aplicarATodos) {
        dias.forEach((dia) => {
          horarios[dia] = {
            apertura: formData.horarioDefault.apertura,
            cierre: formData.horarioDefault.cierre,
            cerrado: false,
          };
        });
      }

      const restaurantData = {
        descripcion: formData.descripcion,
        telefono: formData.telefono,
        email: formData.email,
        direccion: {
          calle: formData.calle,
          ciudad: formData.ciudad,
          estado: formData.estado,
          codigoPostal: formData.codigoPostal,
          pais: formData.pais,
        },
        moneda: formData.moneda,
        horarios: horarios,
      };

      await onComplete(restaurantData);
    } catch (error) {
      // Procesar el error para determinar qué campo es el problema
      const errorMessage = error.message || "Error al guardar la configuración";
      const newErrors = { submit: errorMessage };

      // Detectar errores específicos y navegar al paso correcto
      if (errorMessage.includes("email") || errorMessage.includes("Email")) {
        newErrors.email = "El email proporcionado no es válido";
        newErrors.submit =
          "Por favor, verifica el email en el Paso 1 y vuelve a intentarlo";
        setStep(1); // Volver al paso 1 donde está el email
      } else if (
        errorMessage.includes("telefono") ||
        errorMessage.includes("Teléfono")
      ) {
        newErrors.telefono = "El teléfono proporcionado no es válido";
        newErrors.submit =
          "Por favor, verifica el teléfono en el Paso 1 y vuelve a intentarlo";
        setStep(1);
      } else if (
        errorMessage.includes("direccion") ||
        errorMessage.includes("dirección")
      ) {
        newErrors.submit =
          "Por favor, verifica la dirección en el Paso 2 y vuelve a intentarlo";
        setStep(2);
      }

      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  // Si el modal no debe estar abierto, no renderizar nada
  if (!isOpen) {
    return null;
  }

  console.log(`Renderizando modal - Paso actual: ${step}, isOpen: ${isOpen}`);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>🍽️ Configura tu Restaurante</h2>
          <p className="modal-subtitle">
            Bienvenido a <strong>{restaurantName}</strong>. Completa la
            información para comenzar.
          </p>
          <div className="progress-bar">
            <div
              className={`progress-step ${step >= 1 ? "active" : ""} ${
                (errors.descripcion || errors.telefono || errors.email) &&
                step !== 1
                  ? "has-error"
                  : ""
              }`}
              title={
                errors.descripcion || errors.telefono || errors.email
                  ? "Hay errores en este paso"
                  : ""
              }
            >
              1
            </div>
            <div className={`progress-line ${step >= 2 ? "active" : ""}`}></div>
            <div
              className={`progress-step ${step >= 2 ? "active" : ""} ${
                (errors.calle || errors.ciudad || errors.estado) && step !== 2
                  ? "has-error"
                  : ""
              }`}
              title={
                errors.calle || errors.ciudad || errors.estado
                  ? "Hay errores en este paso"
                  : ""
              }
            >
              2
            </div>
            <div className={`progress-line ${step >= 3 ? "active" : ""}`}></div>
            <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
              3
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            // Prevenir que Enter dispare el submit
            if (e.key === "Enter") {
              e.preventDefault();
              if (step < 3) {
                handleNext(e);
              }
            }
          }}
        >
          {/* PASO 1: Información Básica */}
          {step === 1 && (
            <div className="modal-step">
              <h3>📋 Información Básica</h3>

              <div className="form-group">
                <label htmlFor="descripcion">
                  Descripción del Restaurante *
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows="3"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Ej: Restaurante de comida italiana con ambiente familiar..."
                  className={errors.descripcion ? "error" : ""}
                />
                {errors.descripcion && (
                  <span className="error-message">{errors.descripcion}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono *</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej: +57 300 1234567"
                    className={errors.telefono ? "error" : ""}
                  />
                  {errors.telefono && (
                    <span className="error-message">{errors.telefono}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email de Contacto (Opcional)</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contacto@restaurante.com"
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                  {formData.email && !errors.email && (
                    <span className="text-xs text-gray-500 mt-1 block">
                      Formato: ejemplo@dominio.com
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="moneda">Moneda</label>
                <select
                  id="moneda"
                  name="moneda"
                  value={formData.moneda}
                  onChange={handleChange}
                >
                  <option value="COP">COP - Peso Colombiano</option>
                  <option value="USD">USD - Dólar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="MXN">MXN - Peso Mexicano</option>
                </select>
              </div>
            </div>
          )}

          {/* PASO 2: Dirección */}
          {step === 2 && (
            <div className="modal-step">
              <h3>📍 Dirección</h3>

              <div className="form-group">
                <label htmlFor="calle">Calle/Dirección *</label>
                <input
                  type="text"
                  id="calle"
                  name="calle"
                  value={formData.calle}
                  onChange={handleChange}
                  placeholder="Ej: Calle 123 #45-67"
                  className={errors.calle ? "error" : ""}
                />
                {errors.calle && (
                  <span className="error-message">{errors.calle}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ciudad">Ciudad *</label>
                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    placeholder="Ej: Bogotá"
                    className={errors.ciudad ? "error" : ""}
                  />
                  {errors.ciudad && (
                    <span className="error-message">{errors.ciudad}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="estado">Estado/Departamento *</label>
                  <input
                    type="text"
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    placeholder="Ej: Cundinamarca"
                    className={errors.estado ? "error" : ""}
                  />
                  {errors.estado && (
                    <span className="error-message">{errors.estado}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="codigoPostal">Código Postal</label>
                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    placeholder="Ej: 110111"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pais">País</label>
                  <input
                    type="text"
                    id="pais"
                    name="pais"
                    value={formData.pais}
                    onChange={handleChange}
                    placeholder="Colombia"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: Horarios */}
          {step === 3 && (
            <div className="modal-step">
              <h3>🕐 Horarios de Atención</h3>

              <div className="info-box">
                <p>
                  Configura el horario de atención de tu restaurante. Puedes
                  personalizar cada día más tarde.
                </p>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="horarioDefault.apertura">
                    Hora de Apertura
                  </label>
                  <input
                    type="time"
                    id="horarioDefault.apertura"
                    name="horarioDefault.apertura"
                    value={formData.horarioDefault.apertura}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="horarioDefault.cierre">Hora de Cierre</label>
                  <input
                    type="time"
                    id="horarioDefault.cierre"
                    name="horarioDefault.cierre"
                    value={formData.horarioDefault.cierre}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="aplicarATodos"
                    checked={formData.aplicarATodos}
                    onChange={handleChange}
                  />
                  Aplicar este horario a todos los días de la semana
                </label>
              </div>

              {errors.submit && (
                <div className="error-box">
                  <strong>⚠️ Error al guardar:</strong>
                  <p className="mt-1">{errors.submit}</p>
                </div>
              )}
            </div>
          )}

          {/* Botones de navegación */}
          <div className="modal-footer">
            {step > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleBack(e);
                }}
                className="btn-secondary"
                disabled={loading}
              >
                ← Atrás
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleNext(e);
                }}
                className="btn-primary"
              >
                Siguiente →
              </button>
            ) : (
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Guardando..." : "✓ Completar Configuración"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantSetupModal;
