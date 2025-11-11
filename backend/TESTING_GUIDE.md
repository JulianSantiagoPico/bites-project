# 🧪 Guía Rápida: Cómo Probar la API desde Cero

## ✅ Requisitos Previos

- ✅ MongoDB corriendo (si no, ejecuta: `net start MongoDB`)
- ✅ Backend corriendo en puerto 5000
- ✅ Base de datos vacía (sin usuarios)

---

## 🎯 MÉTODO 1: Usar REST Client en VS Code (MÁS FÁCIL)

### Paso 1: Instalar REST Client

1. Ve a Extensiones en VS Code (Ctrl+Shift+X)
2. Busca "REST Client" (autor: Huachao Mao)
3. Instala la extensión

### Paso 2: Abrir el archivo de pruebas

1. Abre el archivo: `backend/api-tests.http`
2. Verás botones "Send Request" sobre cada petición

### Paso 3: Crear tu primer usuario (Admin)

1. Busca la línea **### 2. Registrar nuevo restaurante y admin**
2. Haz clic en **"Send Request"** sobre esa línea
3. ✨ ¡Listo! Se creará el restaurante y el usuario admin

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "67309abc...",
      "nombre": "Carlos",
      "apellido": "Ramírez",
      "email": "admin@restaurante.com",
      "rol": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Paso 4: Guardar el token

1. Copia el `token` de la respuesta
2. Ve a la línea 2 del archivo: `@token = `
3. Pega el token: `@token = eyJhbGciOiJIUzI1NiIs...`
4. Guarda el archivo (Ctrl+S)

### Paso 5: Probar endpoints protegidos

Ahora puedes probar cualquier endpoint que requiera autenticación:

- **Obtener perfil** (línea ~40): Haz clic en "Send Request"
- **Crear empleado** (línea ~60): Haz clic en "Send Request"
- **Listar empleados** (línea ~100): Haz clic en "Send Request"

---

## 🎯 MÉTODO 2: Usar PowerShell (Manual)

### Paso 1: Registrar el primer usuario

```powershell
# Navegar al directorio del proyecto
cd C:\Users\User\Desktop\Programacion\bites-project

# Registrar nuevo restaurante y admin
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{
    "nombre": "Carlos",
    "apellido": "Ramírez",
    "email": "admin@mirestaurante.com",
    "password": "123456",
    "restaurante": {
      "nombre": "Mi Restaurante",
      "descripcion": "El mejor restaurante"
    }
  }'
```

### Paso 2: Guardar el token

PowerShell mostrará la respuesta. Copia el valor del campo `token`.

### Paso 3: Usar el token en siguientes peticiones

```powershell
# Guardar token en variable (reemplaza con tu token)
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Obtener perfil
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" `
  -Method GET `
  -Headers @{ Authorization = "Bearer $token" }

# Crear un empleado
Invoke-RestMethod -Uri "http://localhost:5000/api/users" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body '{
    "nombre": "María",
    "apellido": "García",
    "email": "maria@mirestaurante.com",
    "password": "123456",
    "rol": "mesero"
  }'
```

---

## 🎯 MÉTODO 3: Usar cURL (Para usuarios avanzados)

### Registrar usuario:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"nombre\":\"Carlos\",\"apellido\":\"Ramírez\",\"email\":\"admin@restaurante.com\",\"password\":\"123456\",\"restaurante\":{\"nombre\":\"Mi Restaurante\"}}"
```

### Usar token:

```bash
# Reemplaza TOKEN con tu token
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## 🎯 MÉTODO 4: Usar Postman o Thunder Client

### Thunder Client (Extensión de VS Code)

1. Instala "Thunder Client" desde extensiones
2. Clic en el ícono del rayo en la barra lateral
3. New Request
4. Configura:
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body (JSON):
     ```json
     {
       "nombre": "Carlos",
       "apellido": "Ramírez",
       "email": "admin@restaurante.com",
       "password": "123456",
       "restaurante": {
         "nombre": "Mi Restaurante"
       }
     }
     ```
5. Send!

---

## 📋 Flujo Completo de Prueba (Desde Cero)

```
1. Verificar servidor
   GET http://localhost:5000
   ✅ Debe responder con mensaje de bienvenida

2. Registrar primer usuario (admin)
   POST http://localhost:5000/api/auth/register
   ✅ Responde con user + token

3. Guardar el token
   ✅ Copiar para usar en siguientes peticiones

4. Verificar perfil
   GET http://localhost:5000/api/auth/me
   Header: Authorization: Bearer {token}
   ✅ Debe mostrar info del admin

5. Crear primer empleado
   POST http://localhost:5000/api/users
   Header: Authorization: Bearer {token}
   ✅ Debe crear el empleado

6. Listar empleados
   GET http://localhost:5000/api/users
   Header: Authorization: Bearer {token}
   ✅ Debe mostrar admin + empleado creado
```

---

## 🐛 Problemas Comunes

### ❌ "Email ya está registrado"

**Solución**: Usa un email diferente o limpia la base de datos:

```javascript
// En mongosh:
use bites-erp
db.users.deleteMany({})
db.restaurantes.deleteMany({})
```

### ❌ "No autorizado - Token no proporcionado"

**Solución**: Asegúrate de:

1. Tener un token válido
2. Incluir el header: `Authorization: Bearer {token}`
3. No tener espacios extras

### ❌ "Cannot POST /api/auth/register"

**Solución**: Verifica que el servidor esté corriendo en puerto 5000

### ❌ "connect ECONNREFUSED"

**Solución**: MongoDB no está corriendo

```powershell
net start MongoDB
```

---

## 🎓 Datos de Prueba Sugeridos

### Admin Principal:

```json
{
  "nombre": "Carlos",
  "apellido": "Ramírez",
  "email": "admin@restaurante.com",
  "password": "123456",
  "restaurante": {
    "nombre": "Restaurante El Sabor",
    "descripcion": "El mejor restaurante de comida colombiana"
  }
}
```

### Mesero:

```json
{
  "nombre": "María",
  "apellido": "García",
  "email": "maria@restaurante.com",
  "password": "123456",
  "rol": "mesero",
  "telefono": "3101234567"
}
```

### Cocinero:

```json
{
  "nombre": "Pedro",
  "apellido": "López",
  "email": "pedro@restaurante.com",
  "password": "123456",
  "rol": "cocinero"
}
```

---

## ✅ Verificación Final

Después de completar el flujo, deberías tener:

- ✅ 1 Restaurante en la BD
- ✅ 1 Usuario admin
- ✅ 1+ Empleados (mesero, cocinero, etc.)
- ✅ Token JWT válido
- ✅ Capacidad de hacer login

---

## 🚀 Próximos Pasos

Una vez tengas usuarios creados:

1. Prueba hacer login con diferentes usuarios
2. Verifica que los permisos RBAC funcionen
3. Intenta crear empleados con diferentes roles
4. Conecta el frontend con estos endpoints

---

**💡 Recomendación**: Usa el **MÉTODO 1 (REST Client)** ya que el archivo `api-tests.http` tiene 24 pruebas preparadas que cubren todos los casos de uso.
