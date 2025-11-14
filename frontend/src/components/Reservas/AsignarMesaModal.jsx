import { useState, useEffect } from "react";
import { X, MapPin, Users, CheckCircle } from "lucide-react";
import { mesasService } from "../../services/api";

/**
 * Modal para asignar mesa a una reserva
 */
const AsignarMesaModal = ({ isOpen, reserva, onConfirm, onClose }) => {
  const [mesas, setMesas] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState("");
  const [loading, setLoading] = useState(false);
  const [cargandoMesas, setCargandoMesas] = useState(false);

  const textMain = "#1f2937";
  const textSecondary = "#6b7280";

  useEffect(() => {
    if (isOpen && reserva) {
      fetchMesas();
      const mesaId =
        reserva.mesaAsignada?.["_id"] ||
        reserva.mesaAsignada?._id ||
        reserva.mesaAsignada?.id ||
        "";
      setMesaSeleccionada(mesaId);
    }
  }, [isOpen, reserva]);

  const fetchMesas = async () => {
    try {
      setCargandoMesas(true);
      const response = await mesasService.getMesas();

      // La respuesta tiene la estructura: { success, data: { mesas: [...] } }
      const mesasArray = response.data?.mesas || response.data;

      if (response.success && mesasArray && Array.isArray(mesasArray)) {
        // Filtrar solo mesas activas
        const mesasActivas = mesasArray.filter((m) => m.activo);
        setMesas(mesasActivas);
      } else {
        setMesas([]);
      }
    } catch (err) {
      console.error("Error al cargar mesas:", err);
      setMesas([]);
    } finally {
      setCargandoMesas(false);
    }
  };

  const handleAsignar = async () => {
    if (!reserva) return;

    setLoading(true);
    try {
      await onConfirm(reserva, mesaSeleccionada || null);
    } finally {
      setLoading(false);
    }
  };

  const getMesaRecomendada = (mesa) => {
    if (!reserva) return false;
    const capacidadIdeal = reserva.numeroPersonas;
    // Recomendada si la capacidad es suficiente pero no excesiva (máximo +2)
    return (
      mesa.capacidad >= capacidadIdeal && mesa.capacidad <= capacidadIdeal + 2
    );
  };

  if (!isOpen || !reserva) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 px-6 py-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#e5e7eb",
            zIndex: 10,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
            >
              <MapPin size={20} style={{ color: "#3b82f6" }} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: textMain }}>
                Asignar Mesa
              </h2>
              <p className="text-sm" style={{ color: textSecondary }}>
                {reserva.nombreCliente} - {reserva.numeroPersonas} personas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} style={{ color: textSecondary }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {cargandoMesas ? (
            <div className="text-center py-8">
              <p style={{ color: textSecondary }}>Cargando mesas...</p>
            </div>
          ) : mesas.length === 0 ? (
            <div className="text-center py-8">
              <p style={{ color: textSecondary }}>
                No hay mesas disponibles en este momento
              </p>
            </div>
          ) : (
            <>
              {/* Opción para desasignar */}
              <div
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  mesaSeleccionada === "" ? "ring-2" : ""
                }`}
                style={{
                  borderColor: mesaSeleccionada === "" ? "#3b82f6" : "#e5e7eb",
                  backgroundColor:
                    mesaSeleccionada === ""
                      ? "rgba(59, 130, 246, 0.05)"
                      : "#ffffff",
                  boxShadow:
                    mesaSeleccionada === ""
                      ? "0 0 0 3px rgba(59, 130, 246, 0.1)"
                      : "none",
                }}
                onClick={() => setMesaSeleccionada("")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "rgba(107, 114, 128, 0.1)" }}
                    >
                      <X size={24} style={{ color: "#6b7280" }} />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: textMain }}>
                        Sin mesa asignada
                      </p>
                      <p className="text-sm" style={{ color: textSecondary }}>
                        La mesa se asignará después
                      </p>
                    </div>
                  </div>
                  {mesaSeleccionada === "" && (
                    <CheckCircle size={24} style={{ color: "#3b82f6" }} />
                  )}
                </div>
              </div>

              {/* Lista de mesas */}
              <div className="space-y-3">
                <h3 className="font-semibold" style={{ color: textMain }}>
                  Seleccionar Mesa
                </h3>
                {mesas.map((mesa, index) => {
                  const mesaId = mesa["_id"] || mesa._id || mesa.id;
                  const esRecomendada = getMesaRecomendada(mesa);
                  const esSeleccionada = mesaSeleccionada === mesaId;
                  const capacidadSuficiente =
                    mesa.capacidad >= reserva.numeroPersonas;

                  return (
                    <div
                      key={mesaId || `mesa-${index}`}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        esSeleccionada ? "ring-2" : ""
                      } ${!capacidadSuficiente ? "opacity-50" : ""}`}
                      style={{
                        borderColor: esSeleccionada
                          ? "#3b82f6"
                          : esRecomendada
                          ? "#10b981"
                          : "#e5e7eb",
                        backgroundColor: esSeleccionada
                          ? "rgba(59, 130, 246, 0.05)"
                          : esRecomendada
                          ? "rgba(16, 185, 129, 0.05)"
                          : "#ffffff",
                        boxShadow: esSeleccionada
                          ? "0 0 0 3px rgba(59, 130, 246, 0.1)"
                          : "none",
                        cursor: capacidadSuficiente ? "pointer" : "not-allowed",
                      }}
                      onClick={() => {
                        if (capacidadSuficiente) {
                          setMesaSeleccionada(mesaId);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: esRecomendada
                                ? "rgba(16, 185, 129, 0.1)"
                                : "rgba(59, 130, 246, 0.1)",
                            }}
                          >
                            <MapPin
                              size={24}
                              style={{
                                color: esRecomendada ? "#10b981" : "#3b82f6",
                              }}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p
                                className="font-semibold"
                                style={{ color: textMain }}
                              >
                                Mesa {mesa.numero}
                              </p>
                              {esRecomendada && (
                                <span
                                  className="text-xs px-2 py-1 rounded-full font-medium"
                                  style={{
                                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                                    color: "#10b981",
                                  }}
                                >
                                  Recomendada
                                </span>
                              )}
                              {!capacidadSuficiente && (
                                <span
                                  className="text-xs px-2 py-1 rounded-full font-medium"
                                  style={{
                                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                                    color: "#ef4444",
                                  }}
                                >
                                  Capacidad insuficiente
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <div
                                className="flex items-center gap-1 text-sm"
                                style={{ color: textSecondary }}
                              >
                                <Users size={16} />
                                <span>Capacidad: {mesa.capacidad}</span>
                              </div>
                              <span
                                className="text-sm"
                                style={{ color: textSecondary }}
                              >
                                {mesa.ubicacion}
                              </span>
                            </div>
                          </div>
                        </div>
                        {esSeleccionada && (
                          <CheckCircle size={24} style={{ color: "#3b82f6" }} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="sticky bottom-0 px-6 py-4 border-t flex items-center justify-end gap-3"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#e5e7eb",
          }}
        >
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium transition-colors"
            style={{
              color: textSecondary,
              backgroundColor: "#f3f4f6",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#e5e7eb";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
            }}
          >
            Cancelar
          </button>

          <button
            onClick={handleAsignar}
            disabled={loading || cargandoMesas}
            className="px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            style={{
              color: "#ffffff",
              backgroundColor: loading || cargandoMesas ? "#9ca3af" : "#3b82f6",
              cursor: loading || cargandoMesas ? "not-allowed" : "pointer",
            }}
            onMouseOver={(e) => {
              if (!loading && !cargandoMesas) {
                e.currentTarget.style.backgroundColor = "#2563eb";
              }
            }}
            onMouseOut={(e) => {
              if (!loading && !cargandoMesas) {
                e.currentTarget.style.backgroundColor = "#3b82f6";
              }
            }}
          >
            <MapPin size={18} />
            {loading ? "Asignando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignarMesaModal;
