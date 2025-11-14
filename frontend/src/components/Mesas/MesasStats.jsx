const MesasStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Total Mesas */}
      <div className="rounded-xl p-6 shadow-md bg-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-textSecondary">Total Mesas</p>
          <span className="text-2xl">🏢</span>
        </div>
        <p className="text-3xl font-bold text-primary">{stats.total}</p>
      </div>

      {/* Disponibles */}
      <div className="rounded-xl p-6 shadow-md bg-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-textSecondary">Disponibles</p>
          <span className="text-2xl">✅</span>
        </div>
        <p className="text-3xl font-bold text-[#10B981]">{stats.disponibles}</p>
      </div>

      {/* Ocupadas */}
      <div className="rounded-xl p-6 shadow-md bg-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-textSecondary">Ocupadas</p>
          <span className="text-2xl">🔴</span>
        </div>
        <p className="text-3xl font-bold text-[#EF4444]">{stats.ocupadas}</p>
      </div>

      {/* Reservadas */}
      <div className="rounded-xl p-6 shadow-md bg-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-textSecondary">Reservadas</p>
          <span className="text-2xl">📅</span>
        </div>
        <p className="text-3xl font-bold text-[#3B82F6]">{stats.reservadas}</p>
      </div>

      {/* En Limpieza */}
      <div className="rounded-xl p-6 shadow-md bg-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-textSecondary">En Limpieza</p>
          <span className="text-2xl">🧹</span>
        </div>
        <p className="text-3xl font-bold text-[#F59E0B]">{stats.enLimpieza}</p>
      </div>

      {/* Capacidad Total */}
      <div className="rounded-xl p-6 shadow-md bg-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-textSecondary">Capacidad Total</p>
          <span className="text-2xl">👥</span>
        </div>
        <p className="text-2xl font-bold text-accent">{stats.capacidadTotal}</p>
        <p className="text-xs text-textSecondary mt-1">personas</p>
      </div>
    </div>
  );
};

export default MesasStats;
