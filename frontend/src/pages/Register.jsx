import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Register.css";
import Colors from "../styles/colors.js";

function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    restaurantName: "",
    phone: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Redirigir al dashboard si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Debes aceptar los términos y condiciones";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      setErrors({});

      try {
        // Separar nombre y apellido
        const nameParts = formData.name.trim().split(" ");
        const nombre = nameParts[0] || "";
        const apellido = nameParts.slice(1).join(" ") || "N/A"; // Usar "N/A" si no hay apellido

        // Preparar datos para el backend
        const userData = {
          nombre,
          apellido,
          email: formData.email,
          password: formData.password,
          restaurante: {
            nombre: formData.restaurantName,
            telefono: formData.phone,
            email: formData.email,
          },
        };

        const result = await register(userData);

        if (result.success) {
          // Redirigir al dashboard después del registro exitoso
          navigate("/dashboard", { replace: true });
        } else {
          // Procesar errores de validación del backend
          if (result.errors && Array.isArray(result.errors)) {
            const fieldErrors = {};
            result.errors.forEach((err) => {
              fieldErrors[err.field] = err.message;
            });
            setErrors(fieldErrors);
          } else {
            // Error general
            setErrors({
              general: result.error || "Error al registrar usuario",
            });
          }
        }
      } catch (error) {
        setErrors({
          general: "Error al registrar usuario. Por favor, intenta de nuevo.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center py-12"
      style={{ backgroundColor: Colors.background }}
    >
      <div className="w-full max-w-2xl px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Logo/Title */}
          <div className="flex flex-col items-center mb-8">
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: Colors.primary }}
            >
              Bites
            </h1>
            <p className="text-base" style={{ color: Colors.textSecondary }}>
              Crea tu cuenta y empieza a gestionar tu restaurante
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Mensaje de error general */}
            {errors.general && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Información Personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium"
                  style={{ color: Colors.text }}
                >
                  Nombre completo{" "}
                  <span style={{ color: Colors.accent }}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  required
                  className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition ${
                    errors.nombre ? "border-red-500" : "border-gray-300"
                  }`}
                  style={{ color: Colors.text }}
                />
                {errors.nombre && (
                  <span className="text-xs text-red-600">{errors.nombre}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium"
                  style={{ color: Colors.text }}
                >
                  Correo electrónico{" "}
                  <span style={{ color: Colors.accent }}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                  className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  style={{ color: Colors.text }}
                />
                {errors.email && (
                  <span className="text-xs text-red-600">{errors.email}</span>
                )}
              </div>
            </div>

            {/* Información del Restaurante */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="restaurantName"
                  className="text-sm font-medium"
                  style={{ color: Colors.text }}
                >
                  Nombre del restaurante{" "}
                  <span style={{ color: Colors.accent }}>*</span>
                </label>
                <input
                  type="text"
                  id="restaurantName"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  placeholder="Mi Restaurante"
                  required
                  className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition ${
                    errors["restaurante.nombre"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  style={{ color: Colors.text }}
                />
                {errors["restaurante.nombre"] && (
                  <span className="text-xs text-red-600">
                    {errors["restaurante.nombre"]}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium"
                  style={{ color: Colors.text }}
                >
                  Teléfono <span style={{ color: Colors.accent }}>*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+57 300 123 4567"
                  required
                  className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition ${
                    errors["restaurante.telefono"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  style={{ color: Colors.text }}
                />
                {errors["restaurante.telefono"] && (
                  <span className="text-xs text-red-600">
                    {errors["restaurante.telefono"]}
                  </span>
                )}
              </div>
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium"
                  style={{ color: Colors.text }}
                >
                  Contraseña <span style={{ color: Colors.accent }}>*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition"
                  style={{ color: Colors.text }}
                />
                {errors.password && (
                  <span className="text-xs" style={{ color: Colors.accent }}>
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                  style={{ color: Colors.text }}
                >
                  Confirmar contraseña{" "}
                  <span style={{ color: Colors.accent }}>*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition"
                  style={{ color: Colors.text }}
                />
                {errors.confirmPassword && (
                  <span className="text-xs" style={{ color: Colors.accent }}>
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="flex flex-col gap-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-5 h-5 mt-0.5 rounded cursor-pointer"
                  style={{ accentColor: Colors.primary }}
                />
                <span className="text-sm" style={{ color: Colors.text }}>
                  Acepto los{" "}
                  <a
                    href="#"
                    className="hover:underline"
                    style={{ color: Colors.primary }}
                  >
                    términos y condiciones
                  </a>{" "}
                  y la{" "}
                  <a
                    href="#"
                    className="hover:underline"
                    style={{ color: Colors.primary }}
                  >
                    política de privacidad
                  </a>
                </span>
              </label>
              {errors.acceptTerms && (
                <span className="text-xs" style={{ color: Colors.accent }}>
                  {errors.acceptTerms}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-medium transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: Colors.primary }}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: Colors.backgroundSecondary }}
            />
            <span className="text-sm" style={{ color: Colors.textSecondary }}>
              o
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: Colors.backgroundSecondary }}
            />
          </div>

          {/* Login link */}
          <div className="text-center text-sm">
            <span style={{ color: Colors.textSecondary }}>
              ¿Ya tienes una cuenta?{" "}
            </span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
              className="font-medium hover:underline"
              style={{ color: Colors.primary }}
            >
              Inicia sesión
            </a>
          </div>

          {/* Back to home */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/")}
              className="text-sm hover:underline"
              style={{ color: Colors.textSecondary }}
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
