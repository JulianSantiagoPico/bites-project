import { useState, useEffect } from "react";
import { MapPin, Mail, Phone, Save, X } from "lucide-react";

const ConfiguracionContacto = ({ restaurante, onActualizar, loading }) => {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    telefono: "",
    email: "",
    direccion: {
      calle: "",
      ciudad: "",
      estado: "",
      codigoPostal: "",
      pais: "",
    },
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (restaurante) {
      setFormData({
        telefono: restaurante.telefono || "",
        email: restaurante.email || "",
        direccion: {
          calle: restaurante.direccion?.calle || "",
          ciudad: restaurante.direccion?.ciudad || "",
          estado: restaurante.direccion?.estado || "",
          codigoPostal: restaurante.direccion?.codigoPostal || "",
          pais: restaurante.direccion?.pais || "",
        },
      });
    }
  }, [restaurante]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDireccionChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      direccion: {
        ...prev.direccion,
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Validar teléfono
    if (formData.telefono) {
      const telefonoLimpio = formData.telefono.replace(/[\s-()]/g, "");
      if (telefonoLimpio.length < 8) {
        newErrors.telefono = "Teléfono debe tener al menos 8 dígitos";
      }
    }

    // Validar dirección si se proporcionó algún campo
    const direccionCompleta =
      formData.direccion.calle ||
      formData.direccion.ciudad ||
      formData.direccion.estado ||
      formData.direccion.pais;

    if (direccionCompleta) {
      if (!formData.direccion.calle?.trim()) {
        newErrors["direccion.calle"] = "La calle es requerida";
      }
      if (!formData.direccion.ciudad?.trim()) {
        newErrors["direccion.ciudad"] = "La ciudad es requerida";
      }
      if (!formData.direccion.estado?.trim()) {
        newErrors["direccion.estado"] = "El estado es requerido";
      }
      if (!formData.direccion.pais?.trim()) {
        newErrors["direccion.pais"] = "El país es requerido";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await onActualizar(formData);
    if (result.success) {
      setEditando(false);
    }
  };

  const handleCancelar = () => {
    setFormData({
      telefono: restaurante?.telefono || "",
      email: restaurante?.email || "",
      direccion: {
        calle: restaurante?.direccion?.calle || "",
        ciudad: restaurante?.direccion?.ciudad || "",
        estado: restaurante?.direccion?.estado || "",
        codigoPostal: restaurante?.direccion?.codigoPostal || "",
        pais: restaurante?.direccion?.pais || "",
      },
    });
    setErrors({});
    setEditando(false);
  };

  if (!restaurante) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Cargando contacto...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6 bg-linear-to-r from-accent to-[#f0c55a] border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/30 backdrop-blur-sm rounded-xl">
              <Phone className="w-6 h-6 text-gray-800" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Información de Contacto
              </h3>
              <p className="text-sm text-gray-700">
                Teléfono, email y dirección
              </p>
            </div>
          </div>
          {!editando && (
            <button
              onClick={() => setEditando(true)}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white/40 backdrop-blur-sm rounded-lg hover:bg-white/60 transition-all duration-200 border border-gray-900/20"
            >
              Editar
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {editando ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Teléfono
                </div>
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-textMain ${
                  errors.telefono ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="+52 55 1234 5678"
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-textMain ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="contacto@restaurante.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Dirección
                </div>
              </label>

              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={formData.direccion.calle}
                    onChange={(e) =>
                      handleDireccionChange("calle", e.target.value)
                    }
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-textMain ${
                      errors["direccion.calle"]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Calle y número"
                  />
                  {errors["direccion.calle"] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors["direccion.calle"]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={formData.direccion.ciudad}
                      onChange={(e) =>
                        handleDireccionChange("ciudad", e.target.value)
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-textMain ${
                        errors["direccion.ciudad"]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Ciudad"
                    />
                    {errors["direccion.ciudad"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["direccion.ciudad"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      value={formData.direccion.estado}
                      onChange={(e) =>
                        handleDireccionChange("estado", e.target.value)
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-textMain ${
                        errors["direccion.estado"]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Estado"
                    />
                    {errors["direccion.estado"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["direccion.estado"]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.direccion.codigoPostal}
                    onChange={(e) =>
                      handleDireccionChange("codigoPostal", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-textMain"
                    placeholder="Código Postal"
                  />

                  <div>
                    <input
                      type="text"
                      value={formData.direccion.pais}
                      onChange={(e) =>
                        handleDireccionChange("pais", e.target.value)
                      }
                      className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-textMain ${
                        errors["direccion.pais"]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="País"
                    />
                    {errors["direccion.pais"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["direccion.pais"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-accent to-[#f0c55a] text-gray-900 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                <Save className="w-4 h-4" />
                {loading ? "Guardando..." : "Guardar Contacto"}
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
          <div className="space-y-6">
            {/* Teléfono */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                <Phone className="w-4 h-4" />
                Teléfono
              </label>
              <p className="text-gray-900">
                {formData.telefono || "No especificado"}
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <p className="text-gray-900">
                {formData.email || "No especificado"}
              </p>
            </div>

            {/* Dirección */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                <MapPin className="w-4 h-4" />
                Dirección
              </label>
              {formData.direccion.calle ? (
                <div className="text-gray-900 space-y-1">
                  <p>{formData.direccion.calle}</p>
                  <p>
                    {formData.direccion.ciudad}, {formData.direccion.estado}{" "}
                    {formData.direccion.codigoPostal}
                  </p>
                  <p>{formData.direccion.pais}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">No especificada</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfiguracionContacto;
