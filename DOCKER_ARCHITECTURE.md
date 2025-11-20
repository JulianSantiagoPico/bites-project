# 🏗️ Arquitectura Docker - Bites ERP

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        BITES ERP SYSTEM                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         DOCKER HOST                             │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              BITES-NETWORK (Bridge)                       │ │
│  │                                                           │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │ │
│  │  │   Frontend   │  │   Backend    │  │   MongoDB    │   │ │
│  │  │   (Nginx)    │  │  (Node.js)   │  │   (Mongo)    │   │ │
│  │  │              │  │              │  │              │   │ │
│  │  │  Port: 3000  │  │  Port: 5000  │  │ Port: 27017  │   │ │
│  │  │              │  │              │  │              │   │ │
│  │  │  React App   │◄─┤  Express API │◄─┤   Database   │   │ │
│  │  │  + Vite      │  │  + Socket.IO │  │              │   │ │
│  │  │              │  │  + JWT Auth  │  │              │   │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │ │
│  │         │                  │                  │          │ │
│  └─────────┼──────────────────┼──────────────────┼──────────┘ │
│            │                  │                  │            │
│  ┌─────────▼──────┐ ┌─────────▼──────┐ ┌─────────▼──────┐   │
│  │  Volume:       │ │  Volume:       │ │  Volume:       │   │
│  │  (none)        │ │  backend_logs  │ │  mongodb_data  │   │
│  └────────────────┘ └────────────────┘ └────────────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
    localhost:3000      localhost:5000      localhost:27017
```

## Componentes del Sistema

### 1. Frontend Container (bites-frontend)

- **Imagen Base**: `node:20-alpine` (build) → `nginx:alpine` (production)
- **Puerto Expuesto**: 3000 (production) / 5173 (development)
- **Función**: Servir la aplicación React
- **Características**:
  - Compilación optimizada con Vite
  - Servidor Nginx con compresión gzip
  - Caché de assets estáticos
  - Soporte para React Router
  - Proxy para WebSocket

### 2. Backend Container (bites-backend)

- **Imagen Base**: `node:20-alpine`
- **Puerto Expuesto**: 5000
- **Función**: API REST y WebSocket server
- **Características**:
  - Express.js para API REST
  - Socket.IO para comunicación en tiempo real
  - Autenticación JWT
  - Validación de datos
  - Usuario no-root por seguridad

### 3. MongoDB Container (bites-mongodb)

- **Imagen Base**: `mongo:7.0`
- **Puerto Expuesto**: 27017
- **Función**: Base de datos NoSQL
- **Características**:
  - Autenticación habilitada
  - Volumen persistente para datos
  - Healthcheck configurado
  - Backup automático soportado

## Flujo de Datos

```
Usuario → Frontend (Nginx) → Backend (Express) → MongoDB
                    ↓              ↓
                WebSocket    Socket.IO
                    ↓              ↓
                Real-time Updates
```

## Volúmenes Persistentes

| Volumen          | Contenedor | Propósito                 | Persistencia |
| ---------------- | ---------- | ------------------------- | ------------ |
| `mongodb_data`   | MongoDB    | Datos de la base de datos | ✅ Sí        |
| `mongodb_config` | MongoDB    | Configuración de MongoDB  | ✅ Sí        |
| `backend_logs`   | Backend    | Logs del servidor         | ✅ Sí        |

## Red Docker

- **Nombre**: `bites-network`
- **Driver**: `bridge`
- **Función**: Comunicación entre contenedores
- **Resolución DNS**: Los contenedores se comunican por nombre de servicio

## Variables de Entorno

### MongoDB

```env
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=admin123
MONGO_INITDB_DATABASE=bites_db
```

### Backend

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/bites_db?authSource=admin
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

### Frontend

```env
VITE_API_URL=http://localhost:5000
```

## Healthchecks

### MongoDB

- **Comando**: `mongosh ping`
- **Intervalo**: 10s
- **Timeout**: 5s
- **Reintentos**: 5
- **Start Period**: 40s

### Backend

- **Comando**: `wget http://localhost:5000/`
- **Intervalo**: 30s
- **Timeout**: 10s
- **Reintentos**: 3
- **Start Period**: 40s

### Frontend

- **Comando**: `wget http://localhost:80/`
- **Intervalo**: 30s
- **Timeout**: 10s
- **Reintentos**: 3

## Orden de Inicio

```
1. MongoDB (con healthcheck)
   ↓
2. Backend (espera a MongoDB healthy)
   ↓
3. Frontend (espera a Backend)
```

## Modos de Ejecución

### Modo Producción (`docker-compose.yml`)

- Frontend compilado y servido por Nginx
- Backend en modo producción
- Optimizado para rendimiento
- Sin hot-reload

### Modo Desarrollo (`docker-compose.dev.yml`)

- Frontend con Vite dev server
- Backend con Nodemon (hot-reload)
- Volúmenes montados para desarrollo
- Cambios en código reflejados automáticamente

## Seguridad

### Implementaciones de Seguridad

1. ✅ Usuario no-root en contenedores
2. ✅ Variables de entorno para secretos
3. ✅ Red aislada para contenedores
4. ✅ Helmet.js para headers de seguridad
5. ✅ CORS configurado
6. ✅ Autenticación JWT
7. ✅ MongoDB con autenticación

### Recomendaciones para Producción

- [ ] Usar Docker Secrets para credenciales
- [ ] Implementar HTTPS con reverse proxy
- [ ] Limitar recursos de contenedores
- [ ] Configurar logging centralizado
- [ ] Implementar monitoreo (Prometheus/Grafana)
- [ ] Usar registry privado para imágenes
- [ ] Configurar backups automáticos

## Optimizaciones

### Multi-Stage Builds

- Reduce tamaño de imágenes finales
- Separa dependencias de build y runtime
- Mejora seguridad al no incluir herramientas de build

### Caché de Layers

- Copia `package.json` antes del código
- Aprovecha caché de Docker para `npm install`
- Reduce tiempo de build en cambios frecuentes

### Compresión

- Nginx con gzip habilitado
- Assets estáticos cacheados
- Headers de caché configurados

## Monitoreo y Logs

### Ver Logs

```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f backend

# Últimas 100 líneas
docker-compose logs --tail=100 backend
```

### Métricas de Recursos

```bash
# Ver uso de CPU/Memoria
docker stats

# Ver uso de disco
docker system df
```

## Backup y Restore

### Backup de MongoDB

```bash
# Crear backup
docker-compose exec mongodb mongodump --out /data/backup

# Copiar al host
docker cp bites-mongodb:/data/backup ./backup-$(date +%Y%m%d)
```

### Restore de MongoDB

```bash
# Copiar backup al contenedor
docker cp ./backup-20240101 bites-mongodb:/data/restore

# Restaurar
docker-compose exec mongodb mongorestore /data/restore
```

## Escalabilidad

### Horizontal Scaling

Para escalar horizontalmente, considera:

- Docker Swarm o Kubernetes
- Load balancer (nginx, traefik)
- MongoDB Replica Set
- Redis para sesiones compartidas

### Vertical Scaling

```yaml
# Limitar recursos en docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 512M
        reservations:
          cpus: "0.25"
          memory: 256M
```

## Troubleshooting

### Problemas Comunes

| Problema            | Causa                       | Solución                          |
| ------------------- | --------------------------- | --------------------------------- |
| Puerto en uso       | Otro servicio usa el puerto | Cambiar puerto en `.env`          |
| MongoDB no inicia   | Volumen corrupto            | `docker-compose down -v`          |
| Backend no conecta  | MongoDB no healthy          | Esperar healthcheck               |
| Cambios no reflejan | Caché de Docker             | `docker-compose build --no-cache` |

## Recursos Adicionales

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Nginx Configuration](https://nginx.org/en/docs/)
