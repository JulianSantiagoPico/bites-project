# Bites Frontend

Aplicación web moderna para la gestión de restaurantes, construida con **React 19** y **Vite**.

## 🛠️ Stack Tecnológico

- **Core**: React 19, ReactDOM 19
- **Build Tool**: Vite 7
- **Estilos**: Tailwind CSS 4 (con `@tailwindcss/vite`)
- **Routing**: React Router DOM 7
- **Iconos**: Lucide React
- **Gráficos**: Recharts
- **Utilidades**: date-fns, socket.io-client, jspdf

## 📂 Estructura del Proyecto

```
src/
├── components/      # Componentes reutilizables
│   ├── Cocina/      # Vistas específicas de cocina
│   ├── Empleados/   # Gestión de personal
│   ├── Mesas/       # Mapa y gestión de mesas
│   ├── Pedidos/     # Toma de órdenes
│   └── ...
├── context/         # Estados globales (AuthContext, etc.)
├── hooks/           # Custom Hooks (useAuth, useMesas, etc.)
├── pages/           # Vistas principales (Login, Dashboard, etc.)
├── services/        # Comunicación con API (axios)
├── styles/          # Archivos CSS globales
└── utils/           # Funciones auxiliares y constantes
```

## 🚀 Configuración y Scripts

### Instalación

```bash
npm install
```

### Desarrollo

Inicia el servidor de desarrollo en `http://localhost:5173`:

```bash
npm run dev
```

### Producción

Genera los archivos estáticos optimizados en `dist/`:

```bash
npm run build
```

Previsualiza el build de producción localmente:

```bash
npm run preview
```

### Linting

Ejecuta ESLint para verificar la calidad del código:

```bash
npm run lint
```

## 🧩 Características Clave del Frontend

### Autenticación y Seguridad

- **AuthContext**: Manejo global del estado de sesión y usuario.
- **Protected Routes**: Componentes que protegen rutas según autenticación y roles.
- **Interceptors**: Configuración de Axios para manejar tokens JWT automáticamente.

### Gestión de Estado

- Uso de **Hooks** personalizados (`useCategorias`, `useProductos`, etc.) para separar la lógica de la vista.
- Actualizaciones en tiempo real para módulos críticos como Cocina y Pedidos.

### UI/UX

- **Diseño Responsivo**: Adaptable a tablets y móviles para uso en servicio.
- **Modales Estandarizados**: Sistema consistente de ventanas emergentes para formularios y detalles.
- **Feedback Visual**: Alertas, loaders y estados de error claros (ej: validación de formularios).

## 🎨 Estilos

El proyecto utiliza **Tailwind CSS v4**. La configuración principal se encuentra en el archivo CSS de entrada, aprovechando las nuevas directivas de la versión 4 para una integración más limpia con Vite.

## 🔌 Integración con Backend

La comunicación con el backend se realiza a través de servicios modulares en `src/services/`. La URL base de la API se configura mediante variables de entorno (Vite env vars).

---

**Nota**: Para información sobre la API y el Backend, consulta la documentación en el directorio `../backend`.
