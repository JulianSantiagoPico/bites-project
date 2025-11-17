import { useState, useEffect } from "react";
import { Store, Save, X } from "lucide-react";

const ConfiguracionGeneral = ({ restaurante, onActualizar, loading }) => {
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (restaurante) {
      setNombre(restaurante.nombre || "");
      setDescripcion(restaurante.descripcion || "");
    }
  }, [restaurante]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validaciones
    const newErrors = {};
    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await onActualizar(nombre.trim());
    if (result.success) {
      setEditando(false);
    }
  };

  const handleCancelar = () => {
    setNombre(restaurante?.nombre || "");
    setDescripcion(restaurante?.descripcion || "");
    setErrors({});
    setEditando(false);
  };

  if (!restaurante) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6 bg-linear-to-r from-primary to-[#6d2254] border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Información General
              </h3>
              <p className="text-sm text-white/80">
                Nombre y descripción del restaurante
              </p>
            </div>
          </div>
          {!editando && (
            <button
              onClick={() => setEditando(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 border border-white/30"
            >
              Editar
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {editando ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Restaurante *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-textMain ${
                  errors.nombre ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: Restaurante El Buen Sabor"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-gray-50 text-textMain"
                placeholder="Descripción breve de tu restaurante..."
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">
                La descripción se actualiza desde la configuración general
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-primary to-[#6d2254] text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                <Save className="w-4 h-4" />
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button
                type="button"
                onClick={handleCancelar}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium border border-gray-300"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Nombre del Restaurante
              </label>
              <p className="text-gray-900 text-lg font-medium">{nombre}</p>
            </div>

            {descripcion && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Descripción
                </label>
                <p className="text-gray-700">{descripcion}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfiguracionGeneral;
