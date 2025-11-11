# 🚀 Guía de Inicio Rápido - Bites Project

Esta guía te ayudará a tener el proyecto corriendo en menos de 10 minutos.

## ⚡ Setup Rápido (3 pasos)

### 1️⃣ Iniciar MongoDB

```powershell
# Opción A: Si MongoDB está instalado como servicio
net start MongoDB

# Opción B: Si no está como servicio
mongod --dbpath C:\data\db
```

> **No tienes MongoDB?** Mira `backend/MONGODB_SETUP.md` para instrucciones de instalación.

### 2️⃣ Iniciar el Backend

```powershell
# Desde la raíz del proyecto
cd backend
npm install  # Solo la primera vez
npm run dev
```

Deberías ver:

```
🚀 Servidor corriendo en puerto 5000
📍 Entorno: development
🔗 URL: http://localhost:5000
✅ MongoDB conectado: 127.0.0.1
```

### 3️⃣ Iniciar el Frontend

```powershell
# En otra terminal, desde la raíz del proyecto
npm install  # Solo la primera vez
npm run dev
```

Deberías ver:

```
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

---

## 🎯 Probar que Funciona

### Opción 1: Desde el navegador

1. Abre: http://localhost:5173
2. Ve a la página de registro
3. Crea un nuevo restaurante y admin

### Opción 2: Desde VS Code (REST Client)

1. Abre el archivo `backend/api-tests.http`
2. Haz clic en "Send Request" sobre la línea 14
3. Deberías ver respuesta exitosa

### Opción 3: Desde el navegador (Backend directamente)

1. Abre: http://localhost:5000
2. Deberías ver el mensaje de bienvenida de la API

---

## 📝 Primer Uso - Crear un Admin

### Usando la API REST

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "nombre": "Carlos",
  "apellido": "Ramírez",
  "email": "admin@mirestaurante.com",
  "password": "123456",
  "restaurante": {
    "nombre": "Mi Restaurante",
    "descripcion": "El mejor restaurante",
    "telefono": "3001234567"
  }
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": { ... },
    "restaurante": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

⚠️ **Importante**: Guarda el `token` de la respuesta. Lo necesitarás para las siguientes peticiones.

---

## 🔑 Hacer Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@mirestaurante.com",
  "password": "123456"
}
```

---

## 👥 Crear tu Primer Empleado

Reemplaza `<TU_TOKEN>` con el token que obtuviste al registrarte o hacer login.

```bash
POST http://localhost:5000/api/users
Authorization: Bearer <TU_TOKEN>
Content-Type: application/json

{
  "nombre": "María",
  "apellido": "García",
  "email": "maria@mirestaurante.com",
  "password": "123456",
  "rol": "mesero",
  "telefono": "3101234567"
}
```

---

## 🔍 Ver Todos tus Empleados

```bash
GET http://localhost:5000/api/users
Authorization: Bearer <TU_TOKEN>
```

---

## ⚙️ Configuración Inicial

### Variables de Entorno (ya configuradas)

El archivo `backend/.env` ya está creado con valores por defecto:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bites-erp
JWT_SECRET=bites-erp-super-secret-jwt-key-change-in-production-2024
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

> 💡 **Tip**: Cambia `JWT_SECRET` en producción por algo más seguro.

---

## 🐛 Problemas Comunes

### ❌ "Error al conectar a MongoDB"

**Solución**: MongoDB no está corriendo.

```powershell
net start MongoDB
```

### ❌ "Port 5000 is already in use"

**Solución**: Otro proceso está usando el puerto 5000.

```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :5000

# Cambiar el puerto en backend/.env
PORT=5001
```

### ❌ "Cannot find module..."

**Solución**: Falta instalar dependencias.

```powershell
cd backend
npm install
```

### ❌ "No autorizado - Token no proporcionado"

**Solución**: Estás intentando acceder a un endpoint protegido sin token.

- Primero haz login o register
- Copia el token de la respuesta
- Agrégalo en el header: `Authorization: Bearer <token>`

---

## 📂 Estructura de Carpetas (Resumen)

```
bites-project/
├── backend/              ← Servidor Node.js + Express
│   ├── src/
│   │   ├── config/      ← Configuración (DB, roles)
│   │   ├── controllers/ ← Lógica de negocio
│   │   ├── middlewares/ ← Auth, validaciones
│   │   ├── models/      ← Esquemas de MongoDB
│   │   └── routes/      ← Rutas de la API
│   ├── .env             ← Variables de entorno
│   ├── server.js        ← Punto de entrada
│   └── api-tests.http   ← Pruebas de endpoints
│
└── src/                  ← Frontend React
    ├── components/       ← Componentes reutilizables
    └── pages/           ← Páginas/Vistas
```

---

## 🎓 Siguientes Pasos

1. ✅ **Completa el tutorial básico** (arriba)
2. 📖 **Lee la documentación completa**:
   - `README.md` - Documentación general
   - `backend/README.md` - Documentación del backend
   - `backend/RBAC_DOCS.md` - Sistema de roles y permisos
3. 🧪 **Explora todos los endpoints**: `backend/api-tests.http`
4. 🎨 **Conecta el frontend con el backend**
5. 📦 **Agrega nuevas funcionalidades** (productos, órdenes, etc.)

---

## 🆘 Obtener Ayuda

1. **Revisa los documentos**:

   - `backend/MONGODB_SETUP.md` - Configuración de MongoDB
   - `backend/RBAC_DOCS.md` - Roles y permisos
   - `backend/README.md` - API completa

2. **Revisa los errores en la terminal**:

   - Backend: Terminal donde corre `npm run dev`
   - MongoDB: Terminal donde corre `mongod`

3. **Usa las herramientas de debug**:
   - MongoDB Compass para ver la base de datos
   - REST Client en VS Code para probar la API
   - DevTools del navegador para el frontend

---

## ✅ Checklist de Verificación

Antes de empezar a desarrollar, confirma que:

- [ ] MongoDB está instalado y corriendo
- [ ] Backend responde en http://localhost:5000
- [ ] Frontend carga en http://localhost:5173
- [ ] Puedes registrar un usuario admin
- [ ] Puedes hacer login y obtener un token
- [ ] Puedes crear un empleado con el token del admin

---

## 🎉 ¡Listo para Desarrollar!

Ya tienes todo configurado. Ahora puedes:

- Agregar más endpoints al backend
- Crear nuevos componentes en el frontend
- Implementar los módulos de productos, órdenes, etc.
- Personalizar el sistema según tus necesidades

**Happy Coding! 🚀**

---

## 📞 Contacto

Si encuentras algún problema o tienes sugerencias:

- GitHub: [@JulianSantiagoPico](https://github.com/JulianSantiagoPico)
- Repositorio: [bites-project](https://github.com/JulianSantiagoPico/bites-project)
