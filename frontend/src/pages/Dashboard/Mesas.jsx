import { useState } from "react";

const Mesas = () => {
  const [selectedTable, setSelectedTable] = useState(null);

  const [tables, setTables] = useState([
    {
      id: 1,
      numero: 1,
      capacidad: 4,
      estado: "Disponible",
      reservada: false,
      tiempo: null,
    },
    {
      id: 2,
      numero: 2,
      capacidad: 2,
      estado: "Ocupada",
      reservada: false,
      tiempo: "45 min",
    },
    {
      id: 3,
      numero: 3,
      capacidad: 6,
      estado: "Ocupada",
      reservada: false,
      tiempo: "30 min",
    },
    {
      id: 4,
      numero: 4,
      capacidad: 4,
      estado: "Disponible",
      reservada: false,
      tiempo: null,
    },
    {
      id: 5,
      numero: 5,
      capacidad: 4,
      estado: "Ocupada",
      reservada: false,
      tiempo: "15 min",
    },
    {
      id: 6,
      numero: 6,
      capacidad: 2,
      estado: "Disponible",
      reservada: false,
      tiempo: null,
    },
    {
      id: 7,
      numero: 7,
      capacidad: 8,
      estado: "Reservada",
      reservada: true,
      tiempo: null,
    },
    {
      id: 8,
      numero: 8,
      capacidad: 4,
      estado: "Ocupada",
      reservada: false,
      tiempo: "60 min",
    },
    {
      id: 9,
      numero: 9,
      capacidad: 2,
      estado: "Disponible",
      reservada: false,
      tiempo: null,
    },
    {
      id: 10,
      numero: 10,
      capacidad: 6,
      estado: "Disponible",
      reservada: false,
      tiempo: null,
    },
    {
      id: 11,
      numero: 11,
      capacidad: 4,
      estado: "Ocupada",
      reservada: false,
      tiempo: "20 min",
    },
    {
      id: 12,
      numero: 12,
      capacidad: 4,
      estado: "Ocupada",
      reservada: false,
      tiempo: "55 min",
    },
    {
      id: 13,
      numero: 13,
      capacidad: 2,
      estado: "Mantenimiento",
      reservada: false,
      tiempo: null,
    },
    {
      id: 14,
      numero: 14,
      capacidad: 4,
      estado: "Disponible",
      reservada: false,
      tiempo: null,
    },
    {
      id: 15,
      numero: 15,
      capacidad: 6,
      estado: "Reservada",
      reservada: true,
      tiempo: null,
    },
    {
      id: 16,
      numero: 16,
      capacidad: 2,
      estado: "Disponible",
      reservada: false,
      tiempo: null,
    },
    {
      id: 17,
      numero: 17,
      capacidad: 4,
      estado: "Disponible",
      reservada: false,
      tiempo: null,
    },
    {
      id: 18,
      numero: 18,
      capacidad: 8,
      estado: "Ocupada",
      reservada: false,
      tiempo: "35 min",
    },
    {
      id: 19,
      numero: 19,
      capacidad: 2,
      estado: "Disponible",
      reservada: false,
      tiempo: null,
    },
    {
      id: 20,
      numero: 20,
      capacidad: 4,
      estado: "Disponible",
      reservada: false,
      tiempo: null,
    },
  ]);

  const getStatusColor = (estado) => {
    const statusColors = {
      Disponible: { bg: "#10B98120", color: "#10B981", border: "#10B981" },
      Ocupada: { bg: "#EF444420", color: "#EF4444", border: "#EF4444" },
      Reservada: { bg: "#3B82F620", color: "#3B82F6", border: "#3B82F6" },
      Mantenimiento: { bg: "#6B728020", color: "#6B7280", border: "#6B7280" },
    };
    return statusColors[estado] || statusColors["Disponible"];
  };

  const stats = {
    total: tables.length,
    disponibles: tables.filter((t) => t.estado === "Disponible").length,
    ocupadas: tables.filter((t) => t.estado === "Ocupada").length,
    reservadas: tables.filter((t) => t.estado === "Reservada").length,
  };

  const changeTableStatus = (tableId, newStatus) => {
    setTables(
      tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              estado: newStatus,
              tiempo: newStatus === "Ocupada" ? "0 min" : null,
            }
          : table
      )
    );
  };

  const TableModal = ({ table, onClose }) => (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-8 max-w-md w-full"
        style={{ backgroundColor: "white" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-primary">
            Mesa {table.numero}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-textMain"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg text-center bg-background">
              <p className="text-sm mb-1 text-textSecondary">Capacidad</p>
              <p className="text-2xl font-bold text-primary">
                {table.capacidad}
              </p>
            </div>
            <div className="p-4 rounded-lg text-center bg-background">
              <p className="text-sm mb-1 text-textSecondary">Estado</p>
              <p
                className="text-lg font-bold"
                style={{ color: getStatusColor(table.estado).color }}
              >
                {table.estado}
              </p>
            </div>
          </div>

          {table.tiempo && (
            <div className="p-4 rounded-lg bg-accent/20">
              <p className="text-sm mb-1 text-textSecondary">
                Tiempo de ocupación
              </p>
              <p className="text-xl font-bold text-accent">{table.tiempo}</p>
            </div>
          )}

          <div>
            <h4 className="font-bold mb-3 text-primary">Cambiar Estado</h4>
            <div className="grid grid-cols-2 gap-2">
              {["Disponible", "Ocupada", "Reservada", "Mantenimiento"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => {
                      changeTableStatus(table.id, status);
                      onClose();
                    }}
                    className="px-4 py-3 rounded-lg font-medium transition-all"
                    style={{
                      backgroundColor:
                        table.estado === status
                          ? getStatusColor(status).bg
                          : "#faf3e0",
                      color:
                        table.estado === status
                          ? getStatusColor(status).color
                          : "#4a4a4a",
                      border: `2px solid ${
                        table.estado === status
                          ? getStatusColor(status).border
                          : "transparent"
                      }`,
                    }}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>

          <button className="w-full py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary">
            Ver Orden Actual
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Gestión de Mesas</h2>
          <p className="text-textSecondary">
            Control de ocupación y estado de las mesas
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1 text-textSecondary">Total Mesas</p>
          <p className="text-3xl font-bold text-primary">{stats.total}</p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1 text-textSecondary">Disponibles</p>
          <p className="text-3xl font-bold text-[#10B981]">
            {stats.disponibles}
          </p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1 text-textSecondary">Ocupadas</p>
          <p className="text-3xl font-bold text-[#EF4444]">{stats.ocupadas}</p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1 text-textSecondary">Reservadas</p>
          <p className="text-3xl font-bold text-[#3B82F6]">
            {stats.reservadas}
          </p>
        </div>
      </div>

      {/* Occupancy Bar */}
      <div
        className="rounded-xl p-6 shadow-md"
        style={{ backgroundColor: "white" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-primary">Ocupación del Restaurante</h3>
          <span className="font-bold text-accent">
            {Math.round((stats.ocupadas / stats.total) * 100)}%
          </span>
        </div>
        <div className="w-full h-4 rounded-full overflow-hidden bg-background">
          <div
            className="h-full transition-all duration-300 bg-accent"
            style={{
              width: `${(stats.ocupadas / stats.total) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tables.map((table) => {
          const statusColor = getStatusColor(table.estado);
          return (
            <button
              key={table.id}
              onClick={() => setSelectedTable(table)}
              className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{
                backgroundColor: "white",
                borderLeft: `4px solid ${statusColor.border}`,
              }}
            >
              <div className="text-center space-y-2">
                <div className="text-4xl mb-2">
                  {table.estado === "Disponible"
                    ? "🪑"
                    : table.estado === "Ocupada"
                    ? "🍽️"
                    : table.estado === "Reservada"
                    ? "📅"
                    : "🔧"}
                </div>
                <h3 className="font-bold text-xl text-primary">
                  Mesa {table.numero}
                </h3>
                <div className="flex items-center justify-center gap-1 text-sm text-textSecondary">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span>{table.capacidad} personas</span>
                </div>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: statusColor.bg,
                    color: statusColor.color,
                  }}
                >
                  {table.estado}
                </span>
                {table.tiempo && (
                  <p className="text-sm font-medium text-accent">
                    ⏱️ {table.tiempo}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div
        className="rounded-xl p-6 shadow-md"
        style={{ backgroundColor: "white" }}
      >
        <h3 className="font-bold mb-4 text-primary">Leyenda</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Disponible", "Ocupada", "Reservada", "Mantenimiento"].map(
            (status) => {
              const statusColor = getStatusColor(status);
              return (
                <div key={status} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: statusColor.color }}
                  />
                  <span className="text-sm text-textMain">{status}</span>
                </div>
              );
            }
          )}
        </div>
      </div>

      {selectedTable && (
        <TableModal
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
        />
      )}
    </div>
  );
};

export default Mesas;
