# Dashboard del Restaurante Bites 🍽️

## Descripción

Dashboard completo y elegante para la gestión de un restaurante. Incluye módulos para controlar todos los aspectos operativos del negocio.

## 🎨 Características del Diseño

- **Sidebar colapsable**: Navegación intuitiva con menú lateral que se puede expandir/colapsar
- **Diseño responsive**: Se adapta perfectamente a dispositivos móviles, tablets y desktop
- **Paleta de colores elegante**: Utiliza los colores definidos en `src/styles/colors.js`
- **Animaciones suaves**: Transiciones fluidas en hover y cambios de estado
- **Íconos SVG**: Iconografía clara y consistente en toda la aplicación

## 📦 Módulos Incluidos

### 1. **Home/Inicio** (`/dashboard`)

- Vista general con métricas clave del restaurante
- Órdenes recientes en tiempo real
- Productos más vendidos
- Accesos rápidos a funciones principales

### 2. **Tomar Pedido** (`/dashboard/pedidos`)

- Sistema de punto de venta (POS)
- Catálogo de productos por categorías
- Carrito de compras interactivo
- Asignación de mesas
- Información del cliente

### 3. **Productos** (`/dashboard/productos`)

- Gestión completa del catálogo
- Búsqueda y filtros por categoría
- CRUD de productos (Crear, Leer, Actualizar, Eliminar)
- Control de precios y stock
- Estados de disponibilidad

### 4. **Órdenes** (`/dashboard/ordenes`)

- Visualización de todas las órdenes
- Filtros por estado (Nuevo, Preparando, Listo, Entregado, Cancelado)
- Vista detallada de cada orden
- Cambio de estados en tiempo real
- Búsqueda por ID, cliente o mesa

### 5. **Mesas** (`/dashboard/mesas`)

- Mapa visual del restaurante
- Estados: Disponible, Ocupada, Reservada, Mantenimiento
- Control de tiempo de ocupación
- Capacidad de personas por mesa
- Cambio rápido de estados

### 6. **Reservas** (`/dashboard/reservas`)

- Sistema de reservaciones
- Calendario y gestión de horarios
- Datos de contacto de clientes
- Asignación de mesas
- Confirmación y cancelación de reservas
- Notas especiales

### 7. **Inventario** (`/dashboard/inventario`)

- Control de stock de ingredientes y suministros
- Alertas de stock bajo/crítico
- Categorización de productos
- Proveedores
- Precios y unidades de medida
- Indicadores visuales de niveles de stock

### 8. **Empleados** (`/dashboard/empleados`)

- Gestión del personal
- Roles y turnos de trabajo
- Información de contacto
- Salarios y nómina total
- Estados: Activo, Vacaciones, Inactivo, Suspendido
- Historial laboral

## 🚀 Cómo Usar

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Acceso al Dashboard

1. Inicia la aplicación con `npm run dev`
2. Navega a `http://localhost:5173/dashboard`
3. Explora los diferentes módulos desde el sidebar

## 🎨 Paleta de Colores

```javascript
primary: "#581845"; // Morado oscuro - Principal
secondary: "#35524A"; // Verde oscuro - Secundario
accent: "#E6AF2E"; // Amarillo dorado - Acentos
text: "#4A4A4A"; // Gris oscuro - Texto principal
textSecondary: "#7D7D7D"; // Gris medio - Texto secundario
background: "#FAF3E0"; // Beige claro - Fondo
backgroundSecondary: "#F4E2AA"; // Amarillo claro - Fondo secundario
```

## 📁 Estructura de Archivos

```
src/
├── components/
│   └── Dashboard/
│       ├── DashboardLayout.jsx  # Layout principal con sidebar
│       └── Sidebar.jsx          # Componente del sidebar
├── pages/
│   └── Dashboard/
│       ├── DashboardHome.jsx    # Página de inicio
│       ├── TomarPedido.jsx      # POS para pedidos
│       ├── Productos.jsx        # Gestión de productos
│       ├── Ordenes.jsx          # Gestión de órdenes
│       ├── Mesas.jsx            # Control de mesas
│       ├── Reservas.jsx         # Sistema de reservas
│       ├── Inventario.jsx       # Control de inventario
│       └── Empleados.jsx        # Gestión de personal
└── styles/
    └── colors.js                # Paleta de colores
```

## 🛠️ Tecnologías

- **React 19** - Framework principal
- **React Router DOM 7** - Navegación
- **Tailwind CSS 4** - Estilos y diseño responsive
- **Vite** - Build tool y dev server

## ✨ Características Técnicas

- **Estado Local**: Uso de `useState` para gestión de datos
- **Componentes Reutilizables**: Modales, tablas, tarjetas
- **Responsive Design**: Mobile-first approach
- **Accesibilidad**: Estructura semántica y navegación por teclado
- **Performance**: Optimización de re-renders y lazy loading

## 🎯 Próximas Mejoras

- [ ] Integración con backend/API
- [ ] Autenticación y autorización de usuarios
- [ ] Reportes y gráficas avanzadas
- [ ] Notificaciones en tiempo real
- [ ] Exportación de datos (PDF, Excel)
- [ ] Sistema de pagos integrado
- [ ] Multi-idioma (i18n)
- [ ] Modo oscuro

## 📝 Notas

- Los datos actuales son de demostración (mock data)
- Las funciones CRUD están implementadas localmente (useState)
- Para producción, conectar con un backend y base de datos
- Personaliza los estilos según tus necesidades en `colors.js`

## 👨‍💻 Desarrollo

Para agregar nuevos módulos:

1. Crea un nuevo archivo en `src/pages/Dashboard/`
2. Importa y agrega la ruta en `src/App.jsx`
3. Agrega el enlace en el sidebar (`src/components/Dashboard/Sidebar.jsx`)
4. Mantén la consistencia con la paleta de colores y diseño

---

**¡Disfruta gestionando tu restaurante con Bites!** 🎉
