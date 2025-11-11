# Bites ERP - Backend API

Backend API REST para el sistema ERP de gestión de restaurantes.

## 🚀 Características

- **Autenticación JWT**: Sistema seguro de autenticación con tokens
- **RBAC**: Control de acceso basado en roles (Admin, Mesero, Cocinero, Cajero, Host)
- **Arquitectura MVC**: Organización clara del código
- **MongoDB**: Base de datos NoSQL flexible
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
│   │   ├── database.js
│   │   └── roles.js
│   ├── controllers/     # Lógica de negocio
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   ├── middlewares/     # Middlewares personalizados
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validators.js
│   ├── models/          # Modelos de MongoDB
│   │   ├── User.js
│   │   └── Restaurante.js
│   └── routes/          # Definición de rutas
│       ├── auth.routes.js
│       └── user.routes.js
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
5. **Host** - Gestionar reservas y mesas

### Sistema RBAC:

El sistema implementa control de acceso basado en roles con permisos granulares para cada módulo:

- Empleados
- Productos
- Inventario
- Órdenes
- Mesas
- Reservas
- Perfil

## 🛣️ Endpoints Principales

### Autenticación

```
POST   /api/auth/register  - Registrar nuevo restaurante y admin
POST   /api/auth/login     - Iniciar sesión
GET    /api/auth/me        - Obtener perfil actual
PUT    /api/auth/me        - Actualizar perfil actual
```

### Usuarios/Empleados

```
GET    /api/users          - Listar empleados (requiere auth)
POST   /api/users          - Crear empleado (requiere admin)
GET    /api/users/:id      - Obtener empleado (requiere auth)
PUT    /api/users/:id      - Actualizar empleado (requiere admin)
DELETE /api/users/:id      - Desactivar empleado (requiere admin)
```

## 📝 Ejemplos de Uso

### Registrar un nuevo restaurante:

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "admin@mirestaurante.com",
  "password": "123456",
  "restaurante": {
    "nombre": "Mi Restaurante",
    "descripcion": "El mejor restaurante de la ciudad"
  }
}
```

### Login:

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@mirestaurante.com",
  "password": "123456"
}
```

### Crear un empleado (requiere token de admin):

```bash
POST http://localhost:5000/api/users
Authorization: Bearer <tu-token-jwt>
Content-Type: application/json

{
  "nombre": "María",
  "apellido": "García",
  "email": "maria@mirestaurante.com",
  "password": "123456",
  "rol": "mesero",
  "telefono": "3001234567"
}
```

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- Tokens JWT con expiración configurable
- Headers de seguridad con Helmet
- CORS configurado
- Validación de datos en todas las entradas
- Soft delete para mantener integridad de datos

## 🐛 Debugging

Los logs incluyen:

- ✅ Conexión exitosa a MongoDB
- 🚀 Servidor iniciado
- 📍 Entorno de ejecución
- ❌ Errores detallados en desarrollo

## 📦 Próximas Funcionalidades

- [ ] Módulo de Productos
- [ ] Módulo de Inventario
- [ ] Módulo de Órdenes
- [ ] Módulo de Mesas
- [ ] Módulo de Reservas
- [ ] Reportes y Analytics
- [ ] Notificaciones en tiempo real
- [ ] Upload de imágenes

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC

---

**Desarrollado para Bites Project** 🍽️
