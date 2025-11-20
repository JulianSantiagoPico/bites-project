# 🐳 Guía de Dockerización - Bites ERP

Esta guía te ayudará a ejecutar el proyecto Bites ERP usando Docker y Docker Compose.

## 📋 Prerequisitos

- [Docker](https://docs.docker.com/get-docker/) (versión 20.10 o superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versión 2.0 o superior)

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

Copia el archivo de ejemplo y ajusta los valores:

```bash
cp .env.example .env
```

Edita el archivo `.env` y cambia al menos:

- `JWT_SECRET`: Usa una clave aleatoria segura
- `MONGO_ROOT_PASSWORD`: Cambia la contraseña por defecto
- `CORS_ORIGIN`: Ajusta según tu dominio (en producción)

### 2. Modo Producción

Para ejecutar la aplicación en modo producción:

```bash
# Construir las imágenes
docker-compose build

# Iniciar todos los servicios
docker-compose up -d

# Ver los logs
docker-compose logs -f
```

La aplicación estará disponible en:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### 3. Modo Desarrollo

Para desarrollo con hot-reload:

```bash
# Iniciar en modo desarrollo
docker-compose -f docker-compose.dev.yml up -d

# Ver los logs
docker-compose -f docker-compose.dev.yml logs -f
```

En modo desarrollo:

- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend API**: http://localhost:5000 (Nodemon)
- Los cambios en el código se reflejan automáticamente

## 📦 Servicios Incluidos

### MongoDB

- **Imagen**: mongo:7.0
- **Puerto**: 27017
- **Volumen persistente**: `mongodb_data`
- **Healthcheck**: Verifica conectividad cada 10s

### Backend (Node.js/Express)

- **Puerto**: 5000
- **Características**:
  - API RESTful
  - WebSocket (Socket.IO)
  - Autenticación JWT
  - Healthcheck endpoint

### Frontend (React/Vite)

- **Puerto**: 3000 (producción) / 5173 (desarrollo)
- **Servidor**: Nginx (producción) / Vite (desarrollo)
- **Características**:
  - Compresión gzip
  - Caché de assets
  - Soporte para React Router

## 🛠️ Comandos Útiles

### Gestión de Contenedores

```bash
# Ver estado de los servicios
docker-compose ps

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO! Elimina datos)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart backend

# Ver logs de un servicio específico
docker-compose logs -f backend
```

### Acceso a Contenedores

```bash
# Acceder al shell del backend
docker-compose exec backend sh

# Acceder al shell de MongoDB
docker-compose exec mongodb mongosh -u admin -p admin123

# Ejecutar comandos npm en el backend
docker-compose exec backend npm run seed
```

### Construcción y Actualización

```bash
# Reconstruir imágenes sin caché
docker-compose build --no-cache

# Reconstruir y reiniciar servicios
docker-compose up -d --build

# Actualizar solo un servicio
docker-compose up -d --build backend
```

### Limpieza

```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes no usadas
docker image prune

# Eliminar volúmenes no usados
docker volume prune

# Limpieza completa del sistema
docker system prune -a --volumes
```

## 🔍 Debugging

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend

# Solo MongoDB
docker-compose logs -f mongodb
```

### Verificar salud de los servicios

```bash
# Ver estado de healthchecks
docker-compose ps

# Inspeccionar un contenedor
docker inspect bites-backend
```

### Problemas comunes

#### MongoDB no inicia

```bash
# Verificar logs
docker-compose logs mongodb

# Eliminar volumen y reiniciar
docker-compose down -v
docker-compose up -d
```

#### Backend no conecta a MongoDB

```bash
# Verificar que MongoDB esté healthy
docker-compose ps

# Verificar variables de entorno
docker-compose exec backend env | grep MONGO
```

#### Frontend no carga

```bash
# Verificar logs de nginx
docker-compose logs frontend

# Reconstruir frontend
docker-compose up -d --build frontend
```

## 🌐 Configuración de Red

Los servicios se comunican a través de una red Docker personalizada llamada `bites-network`. Esto permite:

- Resolución de nombres por servicio (ej: `mongodb`, `backend`)
- Aislamiento de red
- Comunicación segura entre contenedores

## 💾 Volúmenes Persistentes

Los datos se almacenan en volúmenes Docker:

- `mongodb_data`: Datos de MongoDB
- `mongodb_config`: Configuración de MongoDB
- `backend_logs`: Logs del backend (opcional)

Para hacer backup:

```bash
# Backup de MongoDB
docker-compose exec mongodb mongodump --out /data/backup

# Copiar backup al host
docker cp bites-mongodb:/data/backup ./mongodb-backup
```

## 🔒 Seguridad

### Producción

1. **Cambia las credenciales por defecto** en `.env`
2. **Usa HTTPS** con un reverse proxy (nginx, traefik)
3. **Limita puertos expuestos** solo a los necesarios
4. **Actualiza imágenes** regularmente
5. **Usa secrets** para datos sensibles en Docker Swarm/Kubernetes

### Variables de entorno sensibles

Nunca subas el archivo `.env` al repositorio. Está incluido en `.gitignore`.

## 📊 Monitoreo

Para producción, considera agregar:

- **Prometheus + Grafana**: Métricas
- **ELK Stack**: Logs centralizados
- **Portainer**: Gestión visual de Docker

## 🚢 Despliegue en Producción

### Usando Docker Swarm

```bash
docker swarm init
docker stack deploy -c docker-compose.yml bites
```

### Usando Kubernetes

Convierte el docker-compose.yml:

```bash
kompose convert
kubectl apply -f .
```

## 📝 Notas Adicionales

- El frontend en producción usa **nginx** para mejor rendimiento
- El backend usa un **usuario no-root** por seguridad
- Las imágenes usan **multi-stage builds** para optimizar tamaño
- Los **healthchecks** aseguran que los servicios estén listos antes de recibir tráfico

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs -f`
2. Verifica el estado: `docker-compose ps`
3. Consulta la documentación de Docker
4. Abre un issue en el repositorio

## 📚 Recursos

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
