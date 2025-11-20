# 🍽️ Bites Project

**Sistema ERP Integral para Gestión de Restaurantes**

Bites es una solución completa para la administración de restaurantes, diseñada para simplificar operaciones, gestionar personal y mejorar la experiencia del cliente.

## 🏗️ Arquitectura del Proyecto

El proyecto está estructurado como un monorepo que contiene tanto el frontend como el backend:

### 🖥️ [Frontend](./frontend/README.md)

Aplicación web moderna construida con **React 19**, **Vite** y **Tailwind CSS**.

- Interfaz intuitiva y responsiva
- Gestión de estado en tiempo real
- Componentes reutilizables y diseño modular

### ⚙️ [Backend](./backend/README.md)

API REST robusta construida con **Node.js**, **Express** y **MongoDB Atlas**.

- Autenticación segura con JWT
- Control de acceso basado en roles (RBAC)
- Gestión eficiente de datos y validaciones
- Base de datos en la nube con MongoDB Atlas

## 🚀 Inicio Rápido

### Requisitos

- Docker y Docker Compose (recomendado)
- O Node.js v18+ (para ejecución local)

### 🐳 Instalación con Docker (Recomendado)

La forma más rápida de ejecutar el proyecto completo es usando Docker. Este proyecto usa **MongoDB Atlas** (base de datos en la nube).

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/JulianSantiagoPico/bites-project.git
   cd bites-project
   ```

2. **Configurar variables de entorno:**

   Crea un archivo `.env` en la raíz del proyecto:

   ```env
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster.mongodb.net/?appName=BitesDB
   BACKEND_PORT=5000
   JWT_SECRET=0620
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   FRONTEND_PORT=3000
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Iniciar con Docker:**

   ```bash
   # Usando el script de ayuda (Windows)
   docker-helper.bat start-atlas-dev

   # O directamente con docker-compose
   docker-compose -f docker-compose.atlas-dev.yml up -d
   ```

4. **Acceder a la aplicación:**

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

5. **Comandos útiles:**

   ```bash
   # Ver logs
   docker-helper.bat logs

   # Detener servicios
   docker-helper.bat stop

   # Ejecutar seed de base de datos
   docker-helper.bat seed
   ```

📖 **Guías Docker:**

- **[INICIO_RAPIDO.md](./INICIO_RAPIDO.md)** - Guía paso a paso
- **[DOCKER_ATLAS.md](./DOCKER_ATLAS.md)** - Uso con MongoDB Atlas
- **[DOCKER_README.md](./DOCKER_README.md)** - Documentación completa
- **[DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md)** - Referencia rápida

### Instalación Local (Sin Docker)

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/JulianSantiagoPico/bites-project.git
   cd bites-project
   ```

2. **Configurar Backend:**

   ```bash
   cd backend
   npm install
   # Crea un archivo .env con las variables necesarias
   npm run dev
   ```

3. **Configurar Frontend:**

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 📚 Documentación Detallada

Para información específica sobre cada parte del sistema, consulta los READMEs correspondientes:

- [Documentación del Frontend](./frontend/README.md) - Guía de componentes, estructura y scripts
- [Documentación del Backend](./backend/README.md) - Endpoints, modelos y configuración del servidor

## ✨ Características Principales

- **Multi-rol:** Soporte para Administradores, Meseros, Cocineros, Cajeros y Hosts
- **Gestión de Menú:** Categorías, productos y control de disponibilidad
- **Inventario:** Seguimiento de stock e ingredientes
- **Mesas y Reservas:** Gestión visual de ubicaciones y reservas de clientes
- **Pedidos:** Flujo completo desde la toma del pedido hasta la cocina y facturación
- **Estadísticas:** Dashboard con métricas y gráficos en tiempo real
- **WebSocket:** Actualizaciones en tiempo real para cocina y pedidos

## 🛠️ Tecnologías

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Socket.IO Client
- Recharts

### Backend

- Node.js
- Express
- MongoDB Atlas
- JWT Authentication
- Socket.IO
- Mongoose

### DevOps

- Docker & Docker Compose
- GitHub Actions (CI/CD)
- MongoDB Atlas (Cloud Database)

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

**Desarrollado por Julian Santiago Pico**
