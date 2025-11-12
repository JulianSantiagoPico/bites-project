import { formatPrice } from "../../utils/inventarioUtils";

/**
 * Componente para mostrar estadísticas del inventario
 * Muestra: Total items, Stock normal, Bajo stock, Crítico/Agotado, Valor total
 */
const InventarioStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {/* Total de items */}
      <div className="rounded-xl p-6 shadow-md bg-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-textSecondary">Total Items</p>
          <span className="text-2xl">📦</span>
        </div>
        <p className="text-3xl font-bold text-primary">{stats.totalItems}</p>
      </div>

      {/* Stock Normal */}
      <div className="rounded-xl p-6 shadow-md bg-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-textSecondary">Stock Normal</p>
          <span className="text-2xl">✅</span>
        </div>
        <p className="text-3xl font-bold text-[#10B981]">
          {stats.itemsNormales}
        </p>
      </div>

      {/* Bajo Stock */}
      <div className="rounded-xl p-6 shadow-md bg-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-textSecondary">Bajo Stock</p>
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-3xl font-bold text-[#F59E0B]">
          {stats.itemsBajoStock}
        </p>
      </div>

      {/* Crítico/Agotado */}
      <div className="rounded-xl p-6 shadow-md bg-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-textSecondary">Crítico/Agotado</p>
          <span className="text-2xl">🚨</span>
        </div>
        <p className="text-3xl font-bold text-[#EF4444]">
          {stats.itemsCriticos + stats.itemsAgotados}
        </p>
      </div>

      {/* Valor Total */}
      <div className="rounded-xl p-6 shadow-md bg-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-textSecondary">Valor Total</p>
          <span className="text-2xl">💰</span>
        </div>
        <p className="text-2xl font-bold text-accent">
          {formatPrice(stats.valorTotalInventario)}
        </p>
      </div>
    </div>
  );
};

export default InventarioStats;
