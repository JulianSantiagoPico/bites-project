import { useMemo } from "react";
import { TrendingUp, Package } from "lucide-react";

/**
 * Widget que muestra los productos más vendidos
 * Con barras de progreso y métricas de ventas
 */
const TopProductsWidget = ({ products, loading }) => {
  // Calcular el máximo de ventas para las barras de progreso
  const maxVentas = useMemo(() => {
    if (!products || products.length === 0) return 0;
    return Math.max(
      ...products.map((p) => p.cantidadVendida || p.cantidad || p.ventas || 0)
    );
  }, [products]);

  // Preparar productos para mostrar
  const productsToDisplay = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.slice(0, 4);
  }, [products]);

  if (loading) {
    return (
      <div className="rounded-xl shadow-md bg-white">
        <div className="p-6 border-b border-secondary/20">
          <h3 className="text-xl font-bold text-primary">Productos Top</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-full h-2 rounded-full bg-background">
                  <div className="h-full rounded-full bg-gray-200 w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="rounded-xl shadow-md bg-white">
        <div className="p-6 border-b border-secondary/20">
          <h3 className="text-xl font-bold text-primary">Productos Top</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-textSecondary" />
            <p className="text-textSecondary">No hay datos de productos aún</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-md bg-white">
      <div className="p-6 border-b border-secondary/20">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-bold text-primary">Productos Top</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {productsToDisplay.map((product, index) => {
            // El backend devuelve cantidadVendida e ingresos
            const cantidad =
              product.cantidadVendida ||
              product.cantidad ||
              product.ventas ||
              0;
            const revenue =
              typeof product.ingresos === "string"
                ? parseFloat(product.ingresos)
                : product.ingresos || product.revenue || 0;
            const porcentaje = maxVentas > 0 ? (cantidad / maxVentas) * 100 : 0;

            return (
              <div
                key={product.productoId || product._id || product.id || index}
                className="space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-primary">
                      {product.nombre || product.name || "Producto"}
                    </p>
                    <p className="text-sm text-textSecondary">
                      {cantidad} ventas
                    </p>
                  </div>
                  <p className="font-bold text-accent">${revenue.toFixed(2)}</p>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-background">
                  <div
                    className="h-full rounded-full transition-all duration-300 bg-accent"
                    style={{
                      width: `${porcentaje}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopProductsWidget;
