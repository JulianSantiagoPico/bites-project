import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Redirigir al dashboard si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        // Redirigir al dashboard después del login exitoso
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
          setErrors({ general: result.error || "Error al iniciar sesión" });
        }
      }
    } catch (err) {
      setErrors({
        general: "Error al iniciar sesión. Por favor, intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Logo/Title */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-primary">Bites</h1>
            <p className="text-base text-secondary">
              Inicia sesión en tu cuenta
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Mensaje de error general */}
            {errors.general && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-textMain"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className={`text-textMain px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <span className="text-xs text-red-600">{errors.email}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-textMain"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`text-textMain px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <span className="text-xs text-red-600">{errors.password}</span>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded cursor-pointer accent-primary"
                />
                <span className="text-textMain">Recordarme</span>
              </label>
              <a href="#" className="hover:underline text-primary">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-medium transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-primary"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-backgroundSecondary" />
            <span className="text-sm text-textSecondary">o</span>
            <div className="flex-1 h-px bg-backgroundSecondary" />
          </div>

          {/* Sign up link */}
          <div className="text-center text-sm">
            <span className="text-textSecondary">¿No tienes una cuenta? </span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
              className="font-medium hover:underline text-primary"
            >
              Regístrate
            </a>
          </div>

          {/* Back to home */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/")}
              className="text-sm hover:underline text-textSecondary"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
