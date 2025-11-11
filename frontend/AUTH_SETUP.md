# Guía de Configuración - Sistema de Autenticación

## 📋 Resumen de Cambios

Se ha implementado un sistema completo de autenticación que conecta el frontend con el backend, incluyendo:

### ✅ Funcionalidades Implementadas

1. **Servicio de API** (`src/services/api.js`)
   - Conexión con el backend
   - Manejo de tokens JWT
   - Funciones de login, registro y logout

2. **Context de Autenticación** (`src/context/AuthContext.jsx`)
   - Estado global del usuario
   - Gestión de autenticación
   - Persistencia de sesión con localStorage

3. **Rutas Protegidas** (`src/components/ProtectedRoute.jsx`)
   - Redirección automática al login si no está autenticado
   - Pantalla de carga mientras verifica la sesión

4. **Login Funcional** (`src/pages/Login.jsx`)
   - Conexión con el backend
   - Manejo de errores
   - Redirección al dashboard después del login
   - Redirección automática si ya está autenticado

5. **Registro Funcional** (`src/pages/Register.jsx`)
   - Creación de usuario y restaurante
   - Validación de formularios
   - Redirección al dashboard después del registro
   - Redirección automática si ya está autenticado

6. **Botón de Logout** (en `Sidebar.jsx`)
   - Cierre de sesión
   - Limpieza del localStorage
   - Redirección al login

7. **Protección de Rutas del Dashboard**
   - Todas las rutas `/dashboard/*` requieren autenticación
   - Cualquier URL no válida redirige al login

## 🚀 Cómo Usar

### 1. Configurar Variables de Entorno

El archivo `.env` ya está creado en el frontend con:

```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Iniciar el Backend

```bash
cd backend
npm install
npm start
```

El backend debe estar corriendo en `http://localhost:5000`

### 3. Iniciar el Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará en `http://localhost:5173`

## 🔐 Flujo de Autenticación

### Registro de Usuario
1. El usuario accede a `/register`
2. Completa el formulario con:
   - Nombre completo
   - Email
   - Nombre del restaurante
   - Teléfono
   - Contraseña
3. Al enviar, se crea:
   - Un nuevo restaurante
   - Un usuario administrador
4. Se guarda el token en localStorage
5. Se redirige automáticamente al dashboard

### Inicio de Sesión
1. El usuario accede a `/login`
2. Ingresa email y contraseña
3. El sistema verifica las credenciales
4. Se guarda el token en localStorage
5. Se redirige al dashboard

### Protección de Rutas
- Si un usuario intenta acceder a `/dashboard` sin estar autenticado, se redirige a `/login`
- Si un usuario autenticado intenta acceder a `/login` o `/register`, se redirige a `/dashboard`
- Cualquier ruta no válida redirige al login

### Cierre de Sesión
1. El usuario hace clic en "Cerrar sesión" en el sidebar
2. Se elimina el token del localStorage
3. Se redirige al login

## 🧪 Probar el Sistema

### Crear un Usuario de Prueba

**Opción 1: Usar el formulario de registro**
- Ve a `http://localhost:5173/register`
- Completa todos los campos
- Haz clic en "Crear cuenta"

**Opción 2: Usar una herramienta como Postman**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@test.com",
  "password": "123456",
  "restaurante": {
    "nombre": "Mi Restaurante",
    "telefono": "+57 300 123 4567"
  }
}
```

### Iniciar Sesión
- Ve a `http://localhost:5173/login`
- Ingresa el email y contraseña
- Deberías ser redirigido al dashboard

### Verificar Protección de Rutas
1. **Sin autenticación:**
   - Intenta acceder a `http://localhost:5173/dashboard`
   - Deberías ser redirigido a `/login`

2. **Con autenticación:**
   - Inicia sesión
   - Intenta acceder a `http://localhost:5173/login`
   - Deberías ser redirigido a `/dashboard`

3. **URL inválida:**
   - Intenta acceder a `http://localhost:5173/cualquier-cosa`
   - Deberías ser redirigido a `/login`

## 📦 Estructura de Archivos Nuevos

```
frontend/
├── .env                              # Variables de entorno
├── .env.example                      # Ejemplo de variables
└── src/
    ├── context/
    │   └── AuthContext.jsx          # Context de autenticación
    ├── services/
    │   └── api.js                   # Servicio de API
    └── components/
        └── ProtectedRoute.jsx       # Componente de rutas protegidas
```

## 🔧 Archivos Modificados

```
frontend/src/
├── App.jsx                          # Agregado AuthProvider y ProtectedRoute
├── pages/
│   ├── Login.jsx                   # Conectado con API y autenticación
│   └── Register.jsx                # Conectado con API y autenticación
└── components/Dashboard/
    └── Sidebar.jsx                 # Agregado botón de logout
```

## ⚠️ Notas Importantes

1. **CORS**: Asegúrate de que el backend tenga configurado CORS para `http://localhost:5173`
2. **MongoDB**: El backend necesita una conexión activa a MongoDB
3. **Tokens**: Los tokens se guardan en localStorage y persisten entre recargas
4. **Expiración**: Los tokens expiran según la configuración del backend (por defecto 7 días)

## 🐛 Solución de Problemas

### El login no funciona
- Verifica que el backend esté corriendo
- Verifica la URL de la API en `.env`
- Revisa la consola del navegador para errores
- Verifica que MongoDB esté corriendo

### No redirige al dashboard
- Limpia el localStorage: `localStorage.clear()`
- Recarga la página
- Verifica que el token se esté guardando correctamente

### Error de CORS
- Verifica la configuración de CORS en `backend/server.js`
- Asegúrate de que `CORS_ORIGIN` en `.env` del backend sea `http://localhost:5173`

### El usuario no aparece en el sidebar
- Verifica que el usuario se esté guardando en localStorage
- Revisa la consola para errores
- Intenta cerrar sesión y volver a iniciar

## 🎉 ¡Listo!

Tu sistema de autenticación está completamente funcional. Los usuarios pueden:
- ✅ Registrarse y crear su restaurante
- ✅ Iniciar sesión
- ✅ Acceder al dashboard
- ✅ Navegar por todas las páginas protegidas
- ✅ Cerrar sesión
- ✅ Estar protegidos contra accesos no autorizados
