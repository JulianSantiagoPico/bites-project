import { useState, useEffect } from "react";
import { CATEGORIAS_FORM, TAGS_SUGERIDOS } from "../../utils/productosUtils";

const ProductoForm = ({ producto, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "Platos Fuertes",
    precio: "",
    imagen: "",
    disponible: true,
    destacado: false,
    tiempoPreparacion: "",
    tags: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        categoria: producto.categoria || "Platos Fuertes",
        precio: producto.precio || "",
        imagen: producto.imagen || "",
        disponible:
          producto.disponible !== undefined ? producto.disponible : true,
        destacado: producto.destacado || false,
        tiempoPreparacion: producto.tiempoPreparacion || "",
        tags: producto.tags || [],
      });
    }
  }, [producto]);

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    // Validar precio
    if (formData.precio === "" || formData.precio === null) {
      newErrors.precio = "El precio es requerido";
    } else if (formData.precio < 0) {
      newErrors.precio = "El precio no puede ser negativo";
    }

    // Validar tiempo de preparación
    if (formData.tiempoPreparacion && formData.tiempoPreparacion < 0) {
      newErrors.tiempoPreparacion =
        "El tiempo de preparación no puede ser negativo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

  const handleAddTag = (tag) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(tagInput);
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
        precio: parseFloat(formData.precio),
        tiempoPreparacion: formData.tiempoPreparacion
          ? parseInt(formData.tiempoPreparacion)
          : null,
      };

      // Limpiar campos vacíos opcionales
      if (!dataToSend.descripcion) delete dataToSend.descripcion;
      if (!dataToSend.imagen) dataToSend.imagen = "🍽️";
      if (!dataToSend.tiempoPreparacion) delete dataToSend.tiempoPreparacion;

      await onSubmit(dataToSend);

      // Resetear formulario si es creación exitosa
      if (!producto) {
        setFormData({
          nombre: "",
          descripcion: "",
          categoria: "Platos Fuertes",
          precio: "",
          imagen: "",
          disponible: true,
          destacado: false,
          tiempoPreparacion: "",
          tags: [],
        });
      }
    } catch (error) {
      // Manejar errores de validación del servidor
      if (error.errors && Array.isArray(error.errors)) {
        const serverErrors = {};
        error.errors.forEach((err) => {
          serverErrors[err.path] = err.message;
        });
        setErrors(serverErrors);
      } else {
        setServerError(error.message || "Error al guardar el producto");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error del servidor */}
      {serverError && (
        <div className="p-4 rounded-lg bg-error/10 border-2 border-error/20">
          <p className="text-sm text-error font-medium">{serverError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-textMain">
            Nombre del Producto *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors text-textMain ${
              errors.nombre
                ? "border-error focus:border-error"
                : "border-secondary/30 focus:border-primary"
            }`}
            placeholder="Ej: Pizza Margherita"
          />
          {errors.nombre && (
            <p className="text-sm text-error mt-1">{errors.nombre}</p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium mb-2 text-textMain">
            Categoría *
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer border-secondary/30 bg-white text-textMain"
          >
            {CATEGORIAS_FORM.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium mb-2 text-textMain">
            Precio (COP) *
          </label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors text-textMain ${
              errors.precio
                ? "border-error focus:border-error"
                : "border-secondary/30 focus:border-primary"
            }`}
            placeholder="0.00"
          />
          {errors.precio && (
            <p className="text-sm text-error mt-1">{errors.precio}</p>
          )}
        </div>

        {/* Imagen (Emoji) */}
        <div>
          <label className="block text-sm font-medium mb-2 text-textMain">
            Imagen (Emoji o URL)
          </label>
          <input
            type="text"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-primary transition-colors border-secondary/30 text-textMain"
            placeholder="🍕"
          />
        </div>

        {/* Tiempo de Preparación */}
        <div>
          <label className="block text-sm font-medium mb-2 text-textMain">
            Tiempo de Preparación (minutos)
          </label>
          <input
            type="number"
            name="tiempoPreparacion"
            value={formData.tiempoPreparacion}
            onChange={handleChange}
            min="0"
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors text-textMain ${
              errors.tiempoPreparacion
                ? "border-error focus:border-error"
                : "border-secondary/30 focus:border-primary"
            }`}
            placeholder="15"
          />
          {errors.tiempoPreparacion && (
            <p className="text-sm text-error mt-1">
              {errors.tiempoPreparacion}
            </p>
          )}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-textMain">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-primary transition-colors resize-none border-secondary/30 text-textMain"
            placeholder="Descripción del producto..."
          />
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-textMain">
            Tags / Etiquetas
          </label>
          <div className="space-y-3">
            {/* Input para agregar tags */}
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className="flex-1 px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-primary transition-colors border-secondary/30 text-textMain"
                placeholder="Escribe un tag y presiona Enter..."
              />
              <button
                type="button"
                onClick={() => handleAddTag(tagInput)}
                className="px-4 py-2 rounded-lg font-medium text-white bg-secondary hover:opacity-90 transition-opacity"
              >
                Agregar
              </button>
            </div>

            {/* Tags agregados */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-error transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tags sugeridos */}
            <div>
              <p className="text-xs text-textSecondary mb-2">Tags sugeridos:</p>
              <div className="flex flex-wrap gap-2">
                {TAGS_SUGERIDOS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="md:col-span-2 space-y-3">
          {/* Disponible */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="disponible"
              checked={formData.disponible}
              onChange={handleChange}
              className="w-5 h-5 rounded border-2 border-secondary/30 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
            />
            <span className="text-sm font-medium text-textMain">
              Producto disponible para la venta
            </span>
          </label>

          {/* Destacado */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="destacado"
              checked={formData.destacado}
              onChange={handleChange}
              className="w-5 h-5 rounded border-2 border-secondary/30 text-accent focus:ring-2 focus:ring-accent/20 cursor-pointer"
            />
            <span className="text-sm font-medium text-textMain">
              ⭐ Marcar como producto destacado
            </span>
          </label>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 rounded-lg font-medium border-2 hover:bg-gray-50 transition-colors border-secondary/40 text-textMain"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed bg-primary"
        >
          {isSubmitting
            ? "Guardando..."
            : producto
            ? "Actualizar Producto"
            : "Crear Producto"}
        </button>
      </div>
    </form>
  );
};

export default ProductoForm;
