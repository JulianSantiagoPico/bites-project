import { useState } from "react";
import { User, Mail, Phone, Save, X, Edit2 } from "lucide-react";

export const InformacionPersonal = ({ perfil, onActualizar, actualizando }) => {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: perfil?.nombre || "",
    apellido: perfil?.apellido || "",
    telefono: perfil?.telefono || "",
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

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es requerido";
    } else if (formData.nombre.length < 2) {
      nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es requerido";
    } else if (formData.apellido.length < 2) {
      nuevosErrores.apellido = "El apellido debe tener al menos 2 caracteres";
    }

    if (formData.telefono && formData.telefono.length < 8) {
      nuevosErrores.telefono = "El teléfono debe tener al menos 8 dígitos";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const resultado = await onActualizar(formData);
    if (resultado.success) {
      setEditando(false);
    }
  };

  const handleCancelar = () => {
    setFormData({
      nombre: perfil?.nombre || "",
      apellido: perfil?.apellido || "",
      telefono: perfil?.telefono || "",
    });
    setErrores({});
    setEditando(false);
  };

  if (!perfil) return null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-linear-to-r from-accent to-[#f0c55a] px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Información Personal
          </h2>
          {!editando && (
            <button
              onClick={() => setEditando(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {!editando ? (
          // Vista de lectura
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Nombre
              </label>
              <p className="text-lg text-gray-800 mt-1">{perfil.nombre}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Apellido
              </label>
              <p className="text-lg text-gray-800 mt-1">{perfil.apellido}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg text-gray-800 mt-1">{perfil.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                No puedes cambiar tu email
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Teléfono
              </label>
              <p className="text-lg text-gray-800 mt-1">
                {perfil.telefono || "No especificado"}
              </p>
            </div>
          </div>
        ) : (
          // Vista de edición
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errores.nombre ? "border-red-500" : "border-gray-300"
                }`}
                disabled={actualizando}
              />
              {errores.nombre && (
                <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errores.apellido ? "border-red-500" : "border-gray-300"
                }`}
                disabled={actualizando}
              />
              {errores.apellido && (
                <p className="text-red-500 text-sm mt-1">{errores.apellido}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={perfil.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                No puedes cambiar tu email
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: 12345678"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errores.telefono ? "border-red-500" : "border-gray-300"
                }`}
                disabled={actualizando}
              />
              {errores.telefono && (
                <p className="text-red-500 text-sm mt-1">{errores.telefono}</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={actualizando}
                className="flex-1 bg-linear-to-r from-primary to-[#6d2254] text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                <Save className="w-4 h-4" />
                {actualizando ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button
                type="button"
                onClick={handleCancelar}
                disabled={actualizando}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
