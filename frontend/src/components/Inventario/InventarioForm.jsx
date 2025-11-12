import { useState, useEffect } from "react";

const InventarioForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "Carnes",
    cantidad: "",
    unidadMedida: "kg",
    cantidadMinima: "",
    precioUnitario: "",
    proveedor: "",
    lote: "",
    fechaVencimiento: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (item) {
      setFormData({
        nombre: item.nombre || "",
        descripcion: item.descripcion || "",
        categoria: item.categoria || "Carnes",
        cantidad: item.cantidad || "",
        unidadMedida: item.unidadMedida || "kg",
        cantidadMinima: item.cantidadMinima || "",
        precioUnitario: item.precioUnitario || "",
        proveedor: item.proveedor || "",
        lote: item.lote || "",
        fechaVencimiento: item.fechaVencimiento
          ? new Date(item.fechaVencimiento).toISOString().split("T")[0]
          : "",
      });
    }
  }, [item]);

  const categories = [
    { value: "Carnes", label: "Carnes", icon: "🥩" },
    { value: "Vegetales", label: "Vegetales", icon: "🥬" },
    { value: "Lácteos", label: "Lácteos", icon: "🧀" },
    { value: "Bebidas", label: "Bebidas", icon: "🥤" },
    { value: "Especias", label: "Especias", icon: "🌶️" },
    { value: "Otros", label: "Otros", icon: "📦" },
  ];

  const unidades = [
    { value: "kg", label: "Kilogramos (kg)" },
    { value: "litros", label: "Litros" },
    { value: "unidades", label: "Unidades" },
    { value: "cajas", label: "Cajas" },
  ];

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    // Validar cantidad
    if (formData.cantidad === "" || formData.cantidad === null) {
      newErrors.cantidad = "La cantidad es requerida";
    } else if (formData.cantidad < 0) {
      newErrors.cantidad = "La cantidad no puede ser negativa";
    }

    // Validar cantidad mínima
    if (formData.cantidadMinima === "" || formData.cantidadMinima === null) {
      newErrors.cantidadMinima = "La cantidad mínima es requerida";
    } else if (formData.cantidadMinima < 0) {
      newErrors.cantidadMinima = "La cantidad mínima no puede ser negativa";
    }

    // Validar precio
    if (formData.precioUnitario === "" || formData.precioUnitario === null) {
      newErrors.precioUnitario = "El precio unitario es requerido";
    } else if (formData.precioUnitario < 0) {
      newErrors.precioUnitario = "El precio no puede ser negativo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Limpiar error del servidor al hacer cambios
    if (serverError) {
      setServerError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar errores previos
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar datos para enviar
      const dataToSend = {
        ...formData,
        cantidad: parseFloat(formData.cantidad),
        cantidadMinima: parseFloat(formData.cantidadMinima),
        precioUnitario: parseFloat(formData.precioUnitario),
      };

      // Si no hay fecha de vencimiento, no enviarla
      if (!dataToSend.fechaVencimiento) {
        delete dataToSend.fechaVencimiento;
      }

      // Limpiar campos vacíos opcionales
      if (!dataToSend.descripcion) delete dataToSend.descripcion;
      if (!dataToSend.proveedor) delete dataToSend.proveedor;
      if (!dataToSend.lote) delete dataToSend.lote;

      await onSubmit(dataToSend);

      // Resetear formulario si es creación exitosa
      if (!item) {
        setFormData({
          nombre: "",
          descripcion: "",
          categoria: "Carnes",
          cantidad: "",
          unidadMedida: "kg",
          cantidadMinima: "",
          precioUnitario: "",
          proveedor: "",
          lote: "",
          fechaVencimiento: "",
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Error al enviar formulario:", error);

      // Manejar errores del servidor
      if (error.errors && Array.isArray(error.errors)) {
        // Errores de validación del backend
        const newErrors = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.msg;
          }
        });
        setErrors(newErrors);
        setServerError("Por favor corrige los errores en el formulario");
      } else if (error.message) {
        // Error general del servidor
        setServerError(error.message);
      } else {
        setServerError("Error al guardar item. Por favor intenta de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Error del servidor */}
      {serverError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{serverError}</p>
          </div>
          <button
            type="button"
            onClick={() => setServerError("")}
            className="text-red-500 hover:text-red-700"
          >
            <svg
              className="w-5 h-5"
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
      )}

      {/* Nombre */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-textMain">
          Nombre del Producto <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={`px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all text-textMain ${
            errors.nombre ? "border-primary" : "border-secondary"
          }`}
          placeholder="Ej: Tomate Cherry"
        />
        {errors.nombre && (
          <span className="text-xs text-primary">{errors.nombre}</span>
        )}
      </div>

      {/* Descripción */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-textMain">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={2}
          className="px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all text-textMain border-secondary resize-none"
          placeholder="Descripción del producto (opcional)"
        />
      </div>

      {/* Categoría */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-textMain">
          Categoría <span className="text-primary">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((category) => (
            <label
              key={category.value}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all text-textMain ${
                formData.categoria === category.value
                  ? "border-accent bg-backgroundSecondary shadow-[0_0_0_3px_rgba(230,175,46,0.2)]"
                  : "border-secondary bg-background"
              }`}
            >
              <input
                type="radio"
                name="categoria"
                value={category.value}
                checked={formData.categoria === category.value}
                onChange={handleChange}
                className="hidden"
              />
              <span className="text-2xl mb-1">{category.icon}</span>
              <span className="text-xs font-medium text-textMain">
                {category.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Cantidad y Unidad de Medida */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-textMain">
            Cantidad <span className="text-primary">*</span>
          </label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={`px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all text-textMain ${
              errors.cantidad ? "border-primary" : "border-secondary"
            }`}
            placeholder="0"
          />
          {errors.cantidad && (
            <span className="text-xs text-primary">{errors.cantidad}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-textMain">
            Unidad <span className="text-primary">*</span>
          </label>
          <select
            name="unidadMedida"
            value={formData.unidadMedida}
            onChange={handleChange}
            className="px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all text-textMain border-secondary"
          >
            {unidades.map((unidad) => (
              <option key={unidad.value} value={unidad.value}>
                {unidad.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cantidad Mínima y Precio */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-textMain">
            Stock Mínimo <span className="text-primary">*</span>
          </label>
          <input
            type="number"
            name="cantidadMinima"
            value={formData.cantidadMinima}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={`px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all text-textMain ${
              errors.cantidadMinima ? "border-primary" : "border-secondary"
            }`}
            placeholder="0"
          />
          {errors.cantidadMinima && (
            <span className="text-xs text-primary">
              {errors.cantidadMinima}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-textMain">
            Precio Unitario ($) <span className="text-primary">*</span>
          </label>
          <input
            type="number"
            name="precioUnitario"
            value={formData.precioUnitario}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={`px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all text-textMain ${
              errors.precioUnitario ? "border-primary" : "border-secondary"
            }`}
            placeholder="0.00"
          />
          {errors.precioUnitario && (
            <span className="text-xs text-primary">
              {errors.precioUnitario}
            </span>
          )}
        </div>
      </div>

      {/* Proveedor */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-textMain">Proveedor</label>
        <input
          type="text"
          name="proveedor"
          value={formData.proveedor}
          onChange={handleChange}
          className="px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all text-textMain border-secondary"
          placeholder="Nombre del proveedor (opcional)"
        />
      </div>

      {/* Lote y Fecha de Vencimiento */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-textMain">Lote</label>
          <input
            type="text"
            name="lote"
            value={formData.lote}
            onChange={handleChange}
            className="px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all text-textMain border-secondary"
            placeholder="Ej: LOT-2024-001"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-textMain">
            Fecha de Vencimiento
          </label>
          <input
            type="date"
            name="fechaVencimiento"
            value={formData.fechaVencimiento}
            onChange={handleChange}
            className="px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-all text-textMain border-secondary"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-lg border border-secondary bg-white text-textMain text-sm font-medium cursor-pointer transition-all hover:opacity-80"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2.5 rounded-lg border-none text-sm font-semibold cursor-pointer transition-all ${
            isSubmitting
              ? "bg-backgroundSecondary text-textSecondary cursor-not-allowed"
              : "bg-accent text-primary hover:opacity-90"
          }`}
        >
          {isSubmitting
            ? "Guardando..."
            : item
            ? "Actualizar Item"
            : "Agregar Item"}
        </button>
      </div>
    </form>
  );
};

export default InventarioForm;
