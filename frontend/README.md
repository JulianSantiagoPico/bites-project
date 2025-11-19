# 🍽️ Bites Project - Sistema ERP para Restaurantes

Sistema completo de gestión para restaurantes con arquitectura cliente-servidor.

## 📋 Descripción

Bites es un sistema ERP (Enterprise Resource Planning) diseñado específicamente para restaurantes. Permite gestionar todos los aspectos del negocio desde un solo lugar, incluyendo empleados, productos, inventario, órdenes, mesas y reservas.

## 🏗️ Arquitectura

El proyecto está dividido en dos partes principales:

### Frontend (React + Vite)

- **Framework**: React 19 con Vite
- **Routing**: React Router DOM
- **Estilos**: Tailwind CSS 4
- **UI**: Componentes personalizados

### Backend (Node.js + Express)

- **Framework**: Express.js
- **Base de datos**: MongoDB con Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Arquitectura**: MVC (Model-View-Controller)
- **Seguridad**: RBAC (Role-Based Access Control)

## 🚀 Características Principales

- ✅ **Sistema de autenticación seguro** con JWT
- ✅ **Control de acceso basado en roles** (RBAC)
- ✅ **Gestión de empleados** con diferentes roles
- ✅ **Multi-restaurante** - Cada admin gestiona su propio restaurante
- ✅ **Gestión de productos** - Menú y categorías
- ✅ **Control de inventario** - Stock e ingredientes
- ✅ **Sistema de órdenes** - Flujo de cocina y pedidos
- ✅ **Gestión de mesas** - Ubicaciones y estado
- ✅ **Sistema de reservas** - Gestión de clientes

## 👥 Roles del Sistema

1. **Admin** - Administrador del restaurante (acceso completo)
2. **Mesero** - Tomar pedidos y gestionar mesas
3. **Cocinero** - Ver y procesar órdenes de cocina
4. **Cajero** - Procesar pagos
5. **Host** - Gestionar reservas y asignación de mesas

## 📁 Estructura del Proyecto

```
bites-project/
├── backend/              # API REST del servidor
│   ├── src/
│   │   ├── config/      # Configuraciones (DB, roles)
│   │   ├── controllers/ # Lógica de negocio
│   │   ├── middlewares/ # Middlewares (auth, validación)
│   │   ├── models/      # Modelos de MongoDB
│   │   ├── routes/      # Rutas de la API
│   │   └── utils/       # Utilidades
│   ├── .env             # Variables de entorno
│   ├── package.json
│   ├── server.js        # Punto de entrada
│   └── README.md        # Documentación del backend
├── src/                 # Frontend React
│   ├── components/      # Componentes reutilizables
│   ├── pages/          # Páginas/Vistas
│   └── styles/         # Estilos globales
├── public/             # Archivos estáticos
└── package.json        # Dependencias del frontend
```

## 🔧 Instalación

### Requisitos Previos

- Node.js v18 o superior
- MongoDB v6 o superior
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone https://github.com/JulianSantiagoPico/bites-project.git
cd bites-project
```

### 2. Configurar e Iniciar el Backend

```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar MongoDB (Windows)
net start MongoDB

# Probar conexión a la base de datos
npm run test:db

# Iniciar servidor en modo desarrollo
npm run dev
```

El backend estará corriendo en `http://localhost:5000`

### 3. Configurar e Iniciar el Frontend

```bash
# En otra terminal, desde la raíz del proyecto
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará corriendo en `http://localhost:5173`

## 📚 Documentación de la API

### Endpoints Disponibles

#### Autenticación

- `POST /api/auth/register` - Registrar restaurante y admin
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil actual
- `PUT /api/auth/me` - Actualizar perfil

#### Usuarios/Empleados

- `GET /api/users` - Listar empleados
- `POST /api/users` - Crear empleado (admin)
- `GET /api/users/:id` - Obtener empleado
- `PUT /api/users/:id` - Actualizar empleado (admin)
- `DELETE /api/users/:id` - Desactivar empleado (admin)

Ver `backend/api-tests.http` para ejemplos detallados.

## 🔐 Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación con JWT
- Tokens con expiración configurable
- Validación de datos con express-validator
- Headers de seguridad con Helmet
- CORS configurado
- Soft delete para integridad de datos

## 🧪 Testing

El proyecto incluye un archivo `backend/api-tests.http` con pruebas de todos los endpoints. Puedes usar extensiones como REST Client en VS Code para ejecutarlas.

## 🛠️ Scripts Disponibles

### Frontend

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Ejecutar ESLint
```

### Backend

```bash
npm run dev      # Servidor con nodemon
npm start        # Servidor en producción
npm run test:db  # Probar conexión a MongoDB
```

## 🌐 Variables de Entorno

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bites-erp
JWT_SECRET=tu-clave-secreta
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Próximas Características

- [x] Módulo de Productos
- [x] Módulo de Inventario con alertas de stock bajo
- [x] Sistema de órdenes con estado en tiempo real
- [x] Gestión de mesas con vista gráfica
- [x] Sistema de reservas con confirmaciones
- [ ] Dashboard con métricas y reportes
- [ ] Notificaciones push
- [ ] Exportación de reportes (PDF, Excel)
- [ ] Modo offline con sincronización
- [ ] Aplicación móvil

## 👨‍💻 Autor

**Julian Santiago Pico**

- GitHub: [@JulianSantiagoPico](https://github.com/JulianSantiagoPico)

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

⭐ Si este proyecto te ha sido útil, considera darle una estrella en GitHub
