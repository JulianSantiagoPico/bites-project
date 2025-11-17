import { Mail, Phone, Calendar } from "lucide-react";

export const PerfilHeader = ({ perfil }) => {
  if (!perfil) return null;

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRolColor = (rol) => {
    const colors = {
      ADMIN: "from-[#581845] to-[#6d2254]",
      MESERO: "from-[#35524a] to-[#2d4a43]",
      COCINERO: "from-[#e6af2e] to-[#d89a1a]",
      CAJERO: "from-[#6bbf59] to-[#5aa649]",
      GERENTE: "from-[#ffd166] to-[#f0c04b]",
    };
    return colors[rol?.toUpperCase()] || "from-gray-600 to-gray-700";
  };

  const getRolBadgeColor = (rol) => {
    const colors = {
      ADMIN: "bg-[#581845] text-white",
      MESERO: "bg-[#35524a] text-white",
      COCINERO: "bg-[#e6af2e] text-gray-900",
      CAJERO: "bg-[#6bbf59] text-white",
      GERENTE: "bg-[#ffd166] text-gray-900",
    };
    return colors[rol?.toUpperCase()] || "bg-gray-600 text-white";
  };

  const getInitials = () => {
    const nombre = perfil.nombre || "";
    const apellido = perfil.apellido || "";
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      {/* Banner con gradiente - Reducido */}
      <div className={`h-24 bg-linear-to-r ${getRolColor(perfil.rol)}`} />

      {/* Contenido del header */}
      <div className="relative px-6 pb-5">
        {/* Avatar - Más pequeño */}
        <div className="absolute -top-12 left-6">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
            <div
              className={`w-full h-full rounded-full bg-linear-to-br ${getRolColor(
                perfil.rol
              )} flex items-center justify-center`}
            >
              <span className="text-white text-3xl font-bold">
                {getInitials()}
              </span>
            </div>
          </div>
        </div>

        {/* Información principal */}
        <div className="pt-16">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {perfil.nombre} {perfil.apellido}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getRolBadgeColor(
                    perfil.rol
                  )}`}
                >
                  {perfil.rol}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    perfil.activo
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {perfil.activo ? "● Activo" : "● Inactivo"}
                </span>
              </div>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-700">
              <div className="p-1.5 bg-purple-50 rounded-lg">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Email</p>
                <p className="text-sm font-semibold text-gray-900">
                  {perfil.email}
                </p>
              </div>
            </div>

            {perfil.telefono && (
              <div className="flex items-center gap-2 text-gray-700">
                <div className="p-1.5 bg-green-50 rounded-lg">
                  <Phone className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Teléfono</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {perfil.telefono}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-700">
              <div className="p-1.5 bg-yellow-50 rounded-lg">
                <Calendar className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Miembro desde
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatFecha(perfil.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
