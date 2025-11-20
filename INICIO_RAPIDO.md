# 🚀 Inicio Rápido - Bites ERP con Docker y MongoDB Atlas

## Tu Configuración Actual

✅ **MongoDB**: Atlas (Cloud) - `bitesdb.ypbciww.mongodb.net`  
✅ **Backend**: Node.js/Express en puerto 5000  
✅ **Frontend**: React/Vite en puerto 5173 (dev) / 3000 (prod)

## Paso 1: Verificar Requisitos

```bash
# Verificar que Docker esté instalado
docker --version
docker-compose --version

# Si no están instalados, descarga Docker Desktop:
# https://www.docker.com/products/docker-desktop
```

## Paso 2: Configurar Variables de Entorno

**IMPORTANTE**: Necesitas crear un archivo `.env` en la raíz del proyecto.

### Opción A: Crear manualmente

Crea un archivo `.env` con este contenido:

```env
# Entorno
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://H3llz:H3llBl4z307@bitesdb.ypbciww.mongodb.net/?appName=BitesDB

# Backend
BACKEND_PORT=5000
JWT_SECRET=0620
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173

# Frontend
FRONTEND_PORT=3000
VITE_API_URL=http://localhost:5000/api
```

### Opción B: Copiar desde ejemplo

```bash
# Copia el archivo de ejemplo
copy .env.example .env

# Luego edita .env y asegúrate de que MONGODB_URI esté configurado correctamente
```

## Paso 3: Iniciar la Aplicación

### 🎯 Opción Recomendada: Usar el Script de Ayuda

```bash
# Ver ayuda
docker-helper.bat

# Iniciar en modo desarrollo (con hot-reload)
docker-helper.bat start-atlas-dev

# Ver logs en tiempo real
docker-helper.bat logs
```

### 🔧 Opción Alternativa: Comandos Docker Compose

```bash
# Iniciar en modo desarrollo
docker-compose -f docker-compose.atlas-dev.yml up -d

# Ver logs
docker-compose -f docker-compose.atlas-dev.yml logs -f
```

## Paso 4: Acceder a la Aplicación

Una vez iniciados los servicios:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: Atlas (en la nube)

## Paso 5: Verificar que Todo Funciona

### Verificar Backend

Abre en el navegador o usa PowerShell:

```powershell
# Verificar que el backend responde
Invoke-WebRequest -Uri http://localhost:5000 -UseBasicParsing
```

Deberías ver un JSON con información de la API.

### Verificar Frontend

Abre http://localhost:5173 en tu navegador.

### Ver Logs

```bash
# Ver logs del backend
docker-helper.bat logs backend

# Ver logs del frontend
docker-helper.bat logs frontend
```

## Comandos Útiles

### Gestión Básica

```bash
# Detener servicios
docker-helper.bat stop

# Ver estado
docker-helper.bat status

# Reiniciar
docker-helper.bat restart
```

### Debugging

```bash
# Acceder al shell del backend
docker-helper.bat shell backend

# Ver todas las variables de entorno del backend
docker-compose -f docker-compose.atlas-dev.yml exec backend env
```

### Ejecutar Seed de Base de Datos

```bash
# Poblar la base de datos con datos iniciales
docker-helper.bat seed
```

## Troubleshooting

### ❌ Error: "Cannot connect to MongoDB"

**Solución**:

1. Verifica tu conexión a internet
2. Ve a MongoDB Atlas → Network Access
3. Asegúrate de que tu IP esté permitida (o permite 0.0.0.0/0)

```bash
# Ver logs del backend para más detalles
docker-helper.bat logs backend
```

### ❌ Puerto ya en uso

Si el puerto 5000 o 5173 ya está en uso:

```bash
# Ver qué está usando el puerto
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Detener tus servidores locales actuales
# (Los que tienes corriendo con npm run dev)
```

### ❌ Cambios en el código no se reflejan

En modo desarrollo, los cambios deberían reflejarse automáticamente. Si no:

```bash
# Reconstruir las imágenes
docker-compose -f docker-compose.atlas-dev.yml up -d --build
```

### ❌ Frontend no carga

```bash
# Ver logs del frontend
docker-helper.bat logs frontend

# Reconstruir frontend
docker-compose -f docker-compose.atlas-dev.yml up -d --build frontend
```

## Diferencias con Ejecución Local

| Aspecto      | Local (npm run dev)    | Docker                    |
| ------------ | ---------------------- | ------------------------- |
| Instalación  | Requiere Node.js local | Solo requiere Docker      |
| Dependencias | En tu máquina          | Aisladas en contenedor    |
| Puertos      | Directos               | Mapeados desde contenedor |
| Hot-reload   | ✅ Sí                  | ✅ Sí (en modo dev)       |
| Aislamiento  | ❌ No                  | ✅ Sí                     |

## Ventajas de Usar Docker

✅ **Entorno consistente** - Funciona igual en cualquier máquina  
✅ **Fácil de compartir** - Otros desarrolladores pueden iniciar rápido  
✅ **Aislamiento** - No contamina tu sistema con dependencias  
✅ **Producción similar** - Mismo entorno en dev y prod

## Siguiente Paso: Desarrollo

Una vez que todo esté funcionando:

1. **Haz cambios en el código** - Se reflejarán automáticamente
2. **Usa los logs** - `docker-helper.bat logs` para debugging
3. **Accede al shell** - `docker-helper.bat shell backend` si necesitas ejecutar comandos

## Detener Todo

Cuando termines de trabajar:

```bash
# Detener todos los servicios
docker-helper.bat stop

# O si quieres eliminar todo (incluyendo volúmenes)
docker-helper.bat clean
```

## Recursos Adicionales

- **[DOCKER_ATLAS.md](./DOCKER_ATLAS.md)** - Guía completa de MongoDB Atlas con Docker
- **[DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md)** - Referencia rápida de comandos
- **[DOCKER_README.md](./DOCKER_README.md)** - Documentación completa

## ¿Necesitas Ayuda?

```bash
# Ver todos los comandos disponibles
docker-helper.bat

# Ver logs en tiempo real
docker-helper.bat logs -f

# Verificar estado
docker-helper.bat status
```

---

**¡Listo!** Ahora tienes tu aplicación Bites ERP corriendo en Docker con MongoDB Atlas 🎉
