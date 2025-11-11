import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import Colors from "../styles/colors.js";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirigir al dashboard si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        // Redirigir al dashboard después del login exitoso
        navigate("/dashboard", { replace: true });
      } else {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error al iniciar sesión. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center"
      style={{ backgroundColor: Colors.background }}
    >
      <div className="w-full max-w-md px-8">
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
              Inicia sesión en tu cuenta
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Mensaje de error */}
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium"
                style={{ color: Colors.text }}
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
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition"
                style={{
                  borderColor: Colors.backgroundSecondary,
                  focusRingColor: Colors.primary,
                  color: Colors.text,
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium"
                style={{ color: Colors.text }}
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
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition"
                style={{
                  borderColor: Colors.backgroundSecondary,
                  focusRingColor: Colors.primary,
                  color: Colors.text,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: Colors.primary }}
                />
                <span style={{ color: Colors.text }}>Recordarme</span>
              </label>
              <a
                href="#"
                className="hover:underline"
                style={{ color: Colors.primary }}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-medium transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: Colors.primary }}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
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

          {/* Sign up link */}
          <div className="text-center text-sm">
            <span style={{ color: Colors.textSecondary }}>
              ¿No tienes una cuenta?{" "}
            </span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
              className="font-medium hover:underline"
              style={{ color: Colors.primary }}
            >
              Regístrate
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

export default Login;
