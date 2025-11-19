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

API REST robusta construida con **Node.js**, **Express** y **MongoDB**.

- Autenticación segura con JWT
- Control de acceso basado en roles (RBAC)
- Gestión eficiente de datos y validaciones

## 🚀 Inicio Rápido

### Requisitos

- Node.js v18+
- MongoDB v6+

### Instalación General

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/JulianSantiagoPico/bites-project.git
   cd bites-project
   ```

2. **Configurar Backend:**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configurar variables de entorno en .env
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

- [Documentación del Frontend](./frontend/README.md) - Guía de componentes, estructura y scripts.
- [Documentación del Backend](./backend/README.md) - Endpoints, modelos y configuración del servidor.

## ✨ Características Principales

- **Multi-rol:** Soporte para Administradores, Meseros, Cocineros, Cajeros y Hosts.
- **Gestión de Menú:** Categorías, productos y control de disponibilidad.
- **Inventario:** Seguimiento de stock e ingredientes.
- **Mesas y Reservas:** Gestión visual de ubicaciones y reservas de clientes.
- **Pedidos:** Flujo completo desde la toma del pedido hasta la cocina y facturación.

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

**Desarrollado por Julian Santiago Pico**
