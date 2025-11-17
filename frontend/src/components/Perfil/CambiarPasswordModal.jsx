import { useState } from "react";
import { Lock, Eye, EyeOff, X, AlertCircle, Check } from "lucide-react";

export const CambiarPasswordModal = ({
  isOpen,
  onClose,
  onCambiar,
  actualizando,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [mostrarPasswords, setMostrarPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }));
    }
  };

  const toggleMostrarPassword = (campo) => {
    setMostrarPasswords((prev) => ({ ...prev, [campo]: !prev[campo] }));
  };

  const validarPassword = (password) => {
    const requisitos = {
      longitud: password.length >= 8,
      mayuscula: /[A-Z]/.test(password),
      minuscula: /[a-z]/.test(password),
      numero: /[0-9]/.test(password),
    };
    return requisitos;
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.currentPassword) {
      nuevosErrores.currentPassword = "La contraseña actual es requerida";
    }

    if (!formData.newPassword) {
      nuevosErrores.newPassword = "La nueva contraseña es requerida";
    } else {
      const requisitos = validarPassword(formData.newPassword);
      if (!requisitos.longitud) {
        nuevosErrores.newPassword =
          "La contraseña debe tener al menos 8 caracteres";
      } else if (
        !requisitos.mayuscula ||
        !requisitos.minuscula ||
        !requisitos.numero
      ) {
        nuevosErrores.newPassword =
          "La contraseña debe contener mayúsculas, minúsculas y números";
      }
    }

    if (!formData.confirmPassword) {
      nuevosErrores.confirmPassword = "Debes confirmar la nueva contraseña";
    } else if (formData.newPassword !== formData.confirmPassword) {
      nuevosErrores.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const resultado = await onCambiar(
      formData.currentPassword,
      formData.newPassword,
      formData.confirmPassword
    );

    if (resultado.success) {
      // Resetear formulario
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrores({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrores({});
    onClose();
  };

  const requisitos = validarPassword(formData.newPassword);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-primary to-[#6d2254] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Cambiar Contraseña
          </h2>
          <button
            onClick={handleClose}
            disabled={actualizando}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Contraseña actual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña Actual *
            </label>
            <div className="relative">
              <input
                type={mostrarPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-textMain ${
                  errores.currentPassword ? "border-red-500" : "border-gray-300"
                }`}
                disabled={actualizando}
              />
              <button
                type="button"
                onClick={() => toggleMostrarPassword("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {mostrarPasswords.current ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errores.currentPassword && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errores.currentPassword}
              </p>
            )}
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña *
            </label>
            <div className="relative">
              <input
                type={mostrarPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-textMain ${
                  errores.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                disabled={actualizando}
              />
              <button
                type="button"
                onClick={() => toggleMostrarPassword("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {mostrarPasswords.new ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errores.newPassword && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errores.newPassword}
              </p>
            )}

            {/* Requisitos de contraseña */}
            {formData.newPassword && (
              <div className="mt-2 space-y-1">
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
                <RequisitoPassword
                  cumple={requisitos.numero}
                  texto="Un número"
                />
              </div>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Nueva Contraseña *
            </label>
            <div className="relative">
              <input
                type={mostrarPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-textMain ${
                  errores.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                disabled={actualizando}
              />
              <button
                type="button"
                onClick={() => toggleMostrarPassword("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {mostrarPasswords.confirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errores.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errores.confirmPassword}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={actualizando}
              className="flex-1 bg-linear-to-r from-primary to-[#6d2254] text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {actualizando ? "Cambiando..." : "Cambiar Contraseña"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={actualizando}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
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
