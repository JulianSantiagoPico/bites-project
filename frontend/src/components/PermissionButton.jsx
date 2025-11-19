import { usePermissions } from "../hooks/usePermissions";

/**
 * Botón con validación de permisos integrada
 * Solo se muestra si el usuario tiene el permiso requerido
 *
 * @param {string} permission - Permiso requerido
 * @param {function} onClick - Función a ejecutar al hacer click
 * @param {React.ReactNode} children - Contenido del botón
 * @param {string} variant - Variante de estilo: 'primary', 'secondary', 'danger', 'success'
 * @param {string} size - Tamaño: 'sm', 'md', 'lg'
 * @param {string} className - Clases CSS adicionales
 * @param {boolean} disabled - Si el botón está deshabilitado
 * @param {string} type - Tipo de botón: 'button', 'submit', 'reset'
 * @param {string} title - Tooltip del botón
 * @param {object} style - Estilos inline adicionales
 * @returns {React.ReactNode}
 */
const PermissionButton = ({
  permission,
  onClick,
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  title,
  style = {},
  ...props
}) => {
  const { can } = usePermissions();

  // Si no tiene permiso, no mostrar el botón
  if (permission && !can(permission)) {
    return null;
  }

  // Estilos base según variante
  const variantStyles = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    info: "bg-blue-500 text-white hover:bg-blue-600",
  };

  // Estilos de tamaño
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Estilos cuando está deshabilitado
  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  const buttonClasses = `
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.md}
    ${disabledStyles}
    rounded-lg font-medium transition-all duration-200
    flex items-center gap-2 justify-center
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      title={title}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default PermissionButton;
