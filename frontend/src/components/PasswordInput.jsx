import { useState } from "react";
import { Eye, EyeOff, AlertCircle, Check } from "lucide-react";

/**
 * Componente reutilizable de input de contraseña con validaciones visuales
 * Incluye toggle para mostrar/ocultar y requisitos de seguridad opcionales
 */
const PasswordInput = ({
  value,
  onChange,
  name = "password",
  label = "Contraseña",
  error = null,
  showRequirements = false,
  disabled = false,
  required = true,
  placeholder = "••••••••",
  className = "",
}) => {
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const validarPassword = (password) => {
    return {
      longitud: password.length >= 8,
      mayuscula: /[A-Z]/.test(password),
      minuscula: /[a-z]/.test(password),
      numero: /[0-9]/.test(password),
      simbolo: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const requisitos = validarPassword(value);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={name} className="text-sm font-medium text-textMain">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <input
          type={mostrarPassword ? "text" : "password"}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`text-textMain w-full px-4 py-3 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={() => setMostrarPassword(!mostrarPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={-1}
        >
          {mostrarPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mensaje de error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Requisitos de contraseña */}
      {showRequirements && value && (
        <div className="mt-1 space-y-1">
          <RequisitoPassword
            cumple={requisitos.longitud}
            texto="Al menos 8 caracteres"
          />
          <RequisitoPassword
            cumple={requisitos.mayuscula}
            texto="Una letra mayúscula"
          />
          <RequisitoPassword
            cumple={requisitos.minuscula}
            texto="Una letra minúscula"
          />
          <RequisitoPassword cumple={requisitos.numero} texto="Un número" />
          <RequisitoPassword
            cumple={requisitos.simbolo}
            texto="Un símbolo (!@#$...)"
          />
        </div>
      )}
    </div>
  );
};

// Componente auxiliar para mostrar requisitos
const RequisitoPassword = ({ cumple, texto }) => {
  return (
    <div
      className={`flex items-center gap-2 text-sm ${
        cumple ? "text-green-600" : "text-gray-500"
      }`}
    >
      {cumple ? (
        <Check className="w-4 h-4" />
      ) : (
        <div className="w-4 h-4 rounded-full border-2 border-current" />
      )}
      {texto}
    </div>
  );
};

// Función helper para validar contraseña (exportable)
export const validatePassword = (password) => {
  const requisitos = {
    longitud: password.length >= 8,
    mayuscula: /[A-Z]/.test(password),
    minuscula: /[a-z]/.test(password),
    numero: /[0-9]/.test(password),
    simbolo: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const cumpleTodos = Object.values(requisitos).every(Boolean);

  return {
    requisitos,
    cumpleTodos,
    mensaje: cumpleTodos
      ? ""
      : "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo",
  };
};

export default PasswordInput;
