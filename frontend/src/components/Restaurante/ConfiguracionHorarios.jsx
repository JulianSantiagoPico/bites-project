import { useState, useEffect } from "react";
import { Clock, Save, X } from "lucide-react";

const DIAS_SEMANA = [
  { key: "lunes", label: "Lunes" },
  { key: "martes", label: "Martes" },
  { key: "miercoles", label: "Miércoles" },
  { key: "jueves", label: "Jueves" },
  { key: "viernes", label: "Viernes" },
  { key: "sabado", label: "Sábado" },
  { key: "domingo", label: "Domingo" },
];

const ConfiguracionHorarios = ({ restaurante, onActualizar, loading }) => {
  const [editando, setEditando] = useState(false);
  const [horarios, setHorarios] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (restaurante?.horarios) {
      setHorarios(restaurante.horarios);
    }
  }, [restaurante]);

  const handleDiaChange = (dia, field, value) => {
    setHorarios((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [field]: value,
      },
    }));
  };

  const handleCerradoToggle = (dia) => {
    setHorarios((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        cerrado: !prev[dia]?.cerrado,
        apertura: prev[dia]?.cerrado ? "" : prev[dia]?.apertura || "",
        cierre: prev[dia]?.cerrado ? "" : prev[dia]?.cierre || "",
      },
    }));
  };

  const validateHorarios = () => {
    const newErrors = {};

    DIAS_SEMANA.forEach(({ key }) => {
      const horario = horarios[key];
      if (!horario?.cerrado) {
        if (!horario?.apertura) {
          newErrors[`${key}-apertura`] = "Requerido";
        } else if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(horario.apertura)) {
          newErrors[`${key}-apertura`] = "Formato HH:MM";
        }

        if (!horario?.cierre) {
          newErrors[`${key}-cierre`] = "Requerido";
        } else if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(horario.cierre)) {
          newErrors[`${key}-cierre`] = "Formato HH:MM";
        }
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateHorarios();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await onActualizar(horarios);
    if (result.success) {
      setEditando(false);
    }
  };

  const handleCancelar = () => {
    setHorarios(restaurante?.horarios || {});
    setErrors({});
    setEditando(false);
  };

  if (!restaurante) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Cargando horarios...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6 bg-linear-to-r from-secondary to-[#436459] border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Horarios de Atención
              </h3>
              <p className="text-sm text-white/80">
                Configura los horarios de apertura y cierre
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
          <form onSubmit={handleSubmit} className="space-y-3">
            {DIAS_SEMANA.map(({ key, label }) => {
              const horario = horarios[key] || {
                cerrado: true,
                apertura: "",
                cierre: "",
              };

              return (
                <div
                  key={key}
                  className="flex items-center gap-4 p-4 bg-linear-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow"
                >
                  <div className="w-32">
                    <p className="font-medium text-gray-900">{label}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`${key}-cerrado`}
                      checked={!horario.cerrado}
                      onChange={() => handleCerradoToggle(key)}
                      className="w-4 h-4 text-secondary rounded focus:ring-secondary focus:ring-offset-0"
                    />
                    <label
                      htmlFor={`${key}-cerrado`}
                      className="text-sm text-gray-700"
                    >
                      Abierto
                    </label>
                  </div>

                  {!horario.cerrado ? (
                    <>
                      <div className="flex-1">
                        <input
                          type="time"
                          value={horario.apertura || ""}
                          onChange={(e) =>
                            handleDiaChange(key, "apertura", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-textMain ${
                            errors[`${key}-apertura`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[`${key}-apertura`] && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors[`${key}-apertura`]}
                          </p>
                        )}
                      </div>

                      <span className="text-gray-500">a</span>

                      <div className="flex-1">
                        <input
                          type="time"
                          value={horario.cierre || ""}
                          onChange={(e) =>
                            handleDiaChange(key, "cierre", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-textMain ${
                            errors[`${key}-cierre`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors[`${key}-cierre`] && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors[`${key}-cierre`]}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex-1">
                      <span className="text-gray-500 italic">Cerrado</span>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-secondary to-[#436459] text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                <Save className="w-4 h-4" />
                {loading ? "Guardando..." : "Guardar Horarios"}
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
          <div className="space-y-2">
            {DIAS_SEMANA.map(({ key, label }) => {
              const horario = horarios[key] || { cerrado: true };

              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-linear-to-r from-gray-50 to-white rounded-xl border border-gray-100"
                >
                  <span className="font-medium text-gray-900 w-32">
                    {label}
                  </span>
                  {horario.cerrado ? (
                    <span className="text-gray-500 italic">Cerrado</span>
                  ) : (
                    <span className="text-gray-700">
                      {horario.apertura} - {horario.cierre}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfiguracionHorarios;
