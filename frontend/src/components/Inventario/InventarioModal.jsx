import { X, Package } from "lucide-react";
import InventarioForm from "./InventarioForm";

/**
 * Modal para crear o editar un item del inventario
 */
const InventarioModal = ({ isOpen, item, onSubmit, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con título morado y línea divisora */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5" />
            {item ? "Editar Item" : "Agregar al Inventario"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <InventarioForm item={item} onSubmit={onSubmit} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
};

export default InventarioModal;
