import { X, UtensilsCrossed } from "lucide-react";
import ProductoForm from "./ProductoForm";

/**
 * Modal para crear o editar productos
 * Wrapper del formulario con estilos de modal
 */
const ProductoModal = ({ isOpen, onClose, producto, onSubmit }) => {
  if (!isOpen) return null;

  const handleSubmit = async (formData) => {
    await onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-scale-in bg-white">
        {/* Header con título morado y línea divisora */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5" />
            {producto ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <ProductoForm
            producto={producto}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductoModal;
