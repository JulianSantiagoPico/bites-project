# 🌐 Guía de Uso con MongoDB Atlas - Bites ERP

## ¿Qué es MongoDB Atlas?

MongoDB Atlas es la base de datos MongoDB como servicio en la nube. En lugar de ejecutar MongoDB localmente o en Docker, tu base de datos está alojada en internet y es accesible desde cualquier lugar.

## Ventajas de Usar MongoDB Atlas

✅ **No requiere instalación local** - No necesitas MongoDB Compass ni servidor local  
✅ **Siempre disponible** - Accesible desde cualquier lugar con internet  
✅ **Backups automáticos** - Atlas maneja los backups por ti  
✅ **Escalable** - Fácil de escalar según necesidades  
✅ **Gratis para desarrollo** - Tier gratuito con 512MB de almacenamiento

## Configuración Actual del Proyecto

Tu proyecto está configurado para usar MongoDB Atlas con estas credenciales:

```env
MONGODB_URI=mongodb+srv://H3llz:H3llBl4z307@bitesdb.ypbciww.mongodb.net/?appName=BitesDB
```

## Dockerización con MongoDB Atlas

### Diferencias Clave

Cuando usas MongoDB Atlas, **NO necesitas** el contenedor de MongoDB en Docker. Solo necesitas:

1. ✅ **Backend** - API que se conecta a Atlas
2. ✅ **Frontend** - Aplicación React
3. ❌ **MongoDB** - Ya está en la nube (Atlas)

### Archivos Docker Compose

He creado dos versiones especiales para MongoDB Atlas:

#### 1. **Producción** - `docker-compose.atlas.yml`

```bash
docker-compose -f docker-compose.atlas.yml up -d
```

#### 2. **Desarrollo** - `docker-compose.atlas-dev.yml`

```bash
docker-compose -f docker-compose.atlas-dev.yml up -d
```

## 🚀 Inicio Rápido

### Opción 1: Usando Script de Ayuda (Recomendado)

He actualizado el script para soportar MongoDB Atlas:

```bash
# Iniciar en modo desarrollo con Atlas
docker-helper.bat start-atlas-dev

# Iniciar en modo producción con Atlas
docker-helper.bat start-atlas-prod

# Ver logs
docker-helper.bat logs

# Detener
docker-helper.bat stop
```

### Opción 2: Comandos Docker Compose Directos

#### Modo Desarrollo (con hot-reload)

```bash
# Iniciar servicios
docker-compose -f docker-compose.atlas-dev.yml up -d

# Ver logs
docker-compose -f docker-compose.atlas-dev.yml logs -f

# Acceder a la aplicación
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

#### Modo Producción

```bash
# Iniciar servicios
docker-compose -f docker-compose.atlas.yml up -d

# Ver logs
docker-compose -f docker-compose.atlas.yml logs -f

# Acceder a la aplicación
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## 📋 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

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

## 🔧 Comandos Útiles

### Gestión de Servicios

```bash
# Ver estado
docker-compose -f docker-compose.atlas-dev.yml ps

# Ver logs del backend
docker-compose -f docker-compose.atlas-dev.yml logs -f backend

# Ver logs del frontend
docker-compose -f docker-compose.atlas-dev.yml logs -f frontend

# Reiniciar backend
docker-compose -f docker-compose.atlas-dev.yml restart backend

# Detener todo
docker-compose -f docker-compose.atlas-dev.yml down
```

### Acceso a Contenedores

```bash
# Acceder al shell del backend
docker-compose -f docker-compose.atlas-dev.yml exec backend sh

# Ejecutar comandos npm en el backend
docker-compose -f docker-compose.atlas-dev.yml exec backend npm run seed
```

### Reconstruir Imágenes

```bash
# Reconstruir todo
docker-compose -f docker-compose.atlas-dev.yml build --no-cache

# Reconstruir y reiniciar
docker-compose -f docker-compose.atlas-dev.yml up -d --build
```

## 🔍 Verificación de Conexión

### Verificar que el Backend se Conecta a Atlas

```bash
# Ver logs del backend
docker-compose -f docker-compose.atlas-dev.yml logs backend

# Deberías ver algo como:
# ✅ MongoDB conectado: bitesdb-shard-00-00.ypbciww.mongodb.net
```

### Probar la API

```bash
# Desde PowerShell
Invoke-WebRequest -Uri http://localhost:5000 -UseBasicParsing

# O abre en el navegador
# http://localhost:5000
```

## 🛡️ Seguridad con MongoDB Atlas

### Configuración de Red en Atlas

1. **Accede a MongoDB Atlas** → https://cloud.mongodb.com
2. **Network Access** → Agrega tu IP o permite acceso desde cualquier IP (0.0.0.0/0)
3. **Database Access** → Verifica que el usuario `H3llz` tenga permisos

### Permitir Acceso desde Docker

Cuando ejecutas Docker, los contenedores tienen IPs diferentes. Asegúrate de que MongoDB Atlas permita conexiones desde cualquier IP:

1. Ve a **Network Access** en Atlas
2. Agrega `0.0.0.0/0` (permite todas las IPs)
3. O agrega la IP pública de tu servidor

## 📊 Monitoreo en MongoDB Atlas

MongoDB Atlas proporciona herramientas de monitoreo:

1. **Metrics** - Ver uso de CPU, memoria, conexiones
2. **Real-time Performance** - Queries lentas
3. **Alerts** - Configurar alertas
4. **Backup** - Configurar backups automáticos

## 🔄 Migración entre Ambientes

### De Local a Atlas

Si tienes datos locales y quieres migrarlos a Atlas:

```bash
# 1. Exportar datos locales
mongodump --uri="mongodb://localhost:27017/bites_db" --out=./backup

# 2. Importar a Atlas
mongorestore --uri="mongodb+srv://H3llz:H3llBl4z307@bitesdb.ypbciww.mongodb.net/" ./backup
```

### De Atlas a Local

Si quieres descargar datos de Atlas:

```bash
# Exportar desde Atlas
mongodump --uri="mongodb+srv://H3llz:H3llBl4z307@bitesdb.ypbciww.mongodb.net/" --out=./backup

# Importar a local
mongorestore --uri="mongodb://localhost:27017/bites_db" ./backup
```

## 🚨 Troubleshooting

### Error: "MongoNetworkError"

**Causa**: No se puede conectar a MongoDB Atlas

**Soluciones**:

1. Verifica tu conexión a internet
2. Verifica que la IP esté permitida en Atlas (Network Access)
3. Verifica las credenciales en `.env`

```bash
# Ver logs del backend para más detalles
docker-compose -f docker-compose.atlas-dev.yml logs backend
```

### Error: "Authentication failed"

**Causa**: Credenciales incorrectas

**Soluciones**:

1. Verifica el usuario y contraseña en Atlas
2. Verifica que `MONGODB_URI` en `.env` sea correcto
3. Asegúrate de que el usuario tenga permisos de lectura/escritura

### Backend no inicia

```bash
# Ver logs detallados
docker-compose -f docker-compose.atlas-dev.yml logs backend

# Verificar variables de entorno
docker-compose -f docker-compose.atlas-dev.yml exec backend env | grep MONGO
```

### Cambios en código no se reflejan

En modo desarrollo, los cambios deberían reflejarse automáticamente. Si no:

```bash
# Reconstruir y reiniciar
docker-compose -f docker-compose.atlas-dev.yml up -d --build
```

## 📝 Comparación: Atlas vs Local

| Característica | MongoDB Atlas         | MongoDB Local (Docker)    |
| -------------- | --------------------- | ------------------------- |
| Instalación    | No requiere           | Requiere Docker           |
| Acceso         | Desde cualquier lugar | Solo local                |
| Backups        | Automáticos           | Manuales                  |
| Escalabilidad  | Fácil                 | Limitada                  |
| Costo          | Gratis hasta 512MB    | Gratis (recursos locales) |
| Internet       | Requiere              | No requiere               |
| Velocidad      | Depende de internet   | Muy rápida                |

## 🎯 Recomendaciones

### Para Desarrollo

✅ Usa `docker-compose.atlas-dev.yml` con hot-reload  
✅ Mantén NODE_ENV=development  
✅ Usa el tier gratuito de Atlas

### Para Producción

✅ Usa `docker-compose.atlas.yml`  
✅ Cambia JWT_SECRET a algo más seguro  
✅ Configura backups en Atlas  
✅ Habilita autenticación de 2 factores en Atlas  
✅ Limita acceso por IP en Atlas

## 📚 Recursos Adicionales

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)
- [Atlas Security Best Practices](https://docs.atlas.mongodb.com/security-best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs: `docker-compose -f docker-compose.atlas-dev.yml logs -f`
2. Verifica la conexión a Atlas en el dashboard
3. Consulta la documentación de MongoDB Atlas
4. Verifica que tu IP esté permitida en Network Access

---

**Nota**: Esta configuración es ideal para desarrollo y pequeñas aplicaciones. Para producción a gran escala, considera configuraciones adicionales de seguridad y rendimiento.
