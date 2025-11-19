# Bites ERP - Backend API

Backend API REST para el sistema ERP de gestión de restaurantes Bites.

## 🚀 Características

- **Autenticación JWT**: Sistema seguro de autenticación con tokens
- **RBAC**: Control de acceso basado en roles (Admin, Mesero, Cocinero, Cajero, Gerente)
- **Arquitectura MVC**: Organización clara del código
- **MongoDB**: Base de datos NoSQL flexible con Mongoose
- **Validaciones**: Validación de datos con express-validator
- **Seguridad**: Protección con Helmet, CORS, bcrypt

## 📋 Requisitos Previos

- Node.js v18 o superior
- MongoDB v6 o superior
- npm o yarn

## 🔧 Instalación

1. **Navegar al directorio del backend:**

   ```bash
   cd backend
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**

   ```bash
   cp .env.example .env
   ```

   Editar `.env` con tus configuraciones:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bites-erp
   JWT_SECRET=tu-clave-secreta-muy-segura
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Iniciar MongoDB:**

   ```bash
   # En Windows (si tienes MongoDB instalado como servicio)
   net start MongoDB

   # O ejecutar mongod directamente
   mongod
   ```

## 🏃‍♂️ Ejecutar el Proyecto

### Modo Desarrollo (con nodemon):

```bash
npm run dev
```

### Modo Producción:

```bash
npm start
```

El servidor iniciará en `http://localhost:5000`

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuraciones (DB, roles, permisos)
│   ├── controllers/     # Lógica de negocio
│   ├── middlewares/     # Middlewares personalizados
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Definición de rutas
│   └── utils/           # Utilidades y helpers
├── .env.example         # Ejemplo de variables de entorno
├── .gitignore
├── package.json
└── server.js            # Punto de entrada
```

## 🔐 Roles y Permisos

### Roles Disponibles:

1. **Admin** - Acceso completo a todas las funcionalidades
2. **Mesero** - Tomar pedidos, gestionar mesas
3. **Cocinero** - Ver y actualizar órdenes de cocina
4. **Cajero** - Procesar pagos y ver órdenes
5. **Gerente** - Gestión general y reportes

### Módulos Implementados:

- ✅ **Autenticación**: Login, Registro, Perfil
- ✅ **Usuarios**: Gestión de empleados y roles
- ✅ **Restaurante**: Configuración del negocio
- ✅ **Productos**: Gestión de menú y categorías
- ✅ **Inventario**: Control de stock e ingredientes
- ✅ **Mesas**: Gestión de ubicaciones y estado de mesas
- ✅ **Reservas**: Gestión de reservas de clientes
- ✅ **Pedidos**: Toma de ordenes y flujo de cocina

## 🛣️ Endpoints Principales

### Autenticación

```
POST   /api/auth/register  - Registrar nuevo restaurante y admin
POST   /api/auth/login     - Iniciar sesión
GET    /api/auth/me        - Obtener perfil actual
```

### Módulos de Negocio

```
GET    /api/productos      - Listar productos
GET    /api/mesas          - Listar mesas
GET    /api/reservas       - Listar reservas
GET    /api/pedidos        - Listar pedidos
GET    /api/inventario     - Listar inventario
```

## 📝 Ejemplos de Uso

### Login:

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@mirestaurante.com",
  "password": "123456"
}
```

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración configurable
- Headers de seguridad con Helmet
- CORS configurado
- Validación de datos en todas las entradas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC
