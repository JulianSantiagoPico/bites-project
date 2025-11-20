# 🚀 Guía Rápida de Docker - Bites ERP

## Comandos Esenciales

### Inicio Rápido

```bash
# 1. Configurar variables de entorno
cp .env.example .env

# 2. Iniciar en producción
docker-compose up -d

# 3. Ver logs
docker-compose logs -f

# 4. Detener
docker-compose down
```

### Modo Desarrollo

```bash
# Iniciar con hot-reload
docker-compose -f docker-compose.dev.yml up -d

# Ver logs en tiempo real
docker-compose -f docker-compose.dev.yml logs -f

# Detener
docker-compose -f docker-compose.dev.yml down
```

## Comandos por Servicio

### MongoDB

```bash
# Acceder a la consola de MongoDB
docker-compose exec mongodb mongosh -u admin -p admin123

# Ver logs
docker-compose logs -f mongodb

# Backup
docker-compose exec mongodb mongodump --out /data/backup
docker cp bites-mongodb:/data/backup ./backup-$(date +%Y%m%d)

# Restore
docker cp ./backup-20240101 bites-mongodb:/data/restore
docker-compose exec mongodb mongorestore /data/restore
```

### Backend

```bash
# Ver logs
docker-compose logs -f backend

# Acceder al shell
docker-compose exec backend sh

# Ejecutar seed
docker-compose exec backend npm run seed

# Reiniciar solo el backend
docker-compose restart backend

# Reconstruir backend
docker-compose up -d --build backend
```

### Frontend

```bash
# Ver logs
docker-compose logs -f frontend

# Acceder al shell
docker-compose exec frontend sh

# Reiniciar solo el frontend
docker-compose restart frontend

# Reconstruir frontend
docker-compose up -d --build frontend
```

## Debugging

### Ver estado de todos los servicios

```bash
docker-compose ps
```

### Ver uso de recursos

```bash
docker stats
```

### Inspeccionar un contenedor

```bash
docker inspect bites-backend
docker inspect bites-frontend
docker inspect bites-mongodb
```

### Ver redes

```bash
docker network ls
docker network inspect bites-project_bites-network
```

### Ver volúmenes

```bash
docker volume ls
docker volume inspect bites-project_mongodb_data
```

## Limpieza

### Detener y eliminar todo

```bash
# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO! Elimina datos)
docker-compose down -v

# Limpiar imágenes no usadas
docker image prune -a

# Limpiar todo el sistema
docker system prune -a --volumes
```

## Troubleshooting

### El puerto ya está en uso

```bash
# Ver qué está usando el puerto
netstat -ano | findstr :5000
netstat -ano | findstr :3000
netstat -ano | findstr :27017

# Cambiar el puerto en .env
# Ejemplo: BACKEND_PORT=5001
```

### MongoDB no inicia

```bash
# Ver logs detallados
docker-compose logs mongodb

# Eliminar volumen y reiniciar
docker-compose down -v
docker-compose up -d mongodb
```

### Backend no conecta a MongoDB

```bash
# Verificar que MongoDB esté healthy
docker-compose ps

# Verificar variables de entorno
docker-compose exec backend env | grep MONGO

# Ver logs del backend
docker-compose logs backend
```

### Cambios en el código no se reflejan

```bash
# En modo desarrollo, verificar que los volúmenes estén montados
docker-compose -f docker-compose.dev.yml config

# Reconstruir las imágenes
docker-compose -f docker-compose.dev.yml up -d --build
```

### Error de permisos

```bash
# En Windows, asegúrate de que Docker Desktop tenga permisos
# En Linux, agregar tu usuario al grupo docker
sudo usermod -aG docker $USER
```

## Scripts de Ayuda

### Windows

```bash
# Ver ayuda
docker-helper.bat

# Comandos comunes
docker-helper.bat start-dev
docker-helper.bat logs backend
docker-helper.bat stop
docker-helper.bat clean
```

### Linux/Mac

```bash
# Dar permisos de ejecución
chmod +x docker-helper.sh

# Ver ayuda
./docker-helper.sh

# Comandos comunes
./docker-helper.sh start-dev
./docker-helper.sh logs backend
./docker-helper.sh stop
./docker-helper.sh clean
```

## URLs de Acceso

### Modo Producción

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Modo Desarrollo

- Frontend (Vite): http://localhost:5173
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

## Variables de Entorno Importantes

```env
# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=admin123
MONGO_DATABASE=bites_db

# Backend
BACKEND_PORT=5000
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000

# Frontend
FRONTEND_PORT=3000
VITE_API_URL=http://localhost:5000
```

## Mejores Prácticas

1. **Siempre usa `.env` para configuraciones sensibles**
2. **No subas `.env` al repositorio**
3. **Usa `docker-compose.dev.yml` para desarrollo**
4. **Haz backups regulares de MongoDB**
5. **Actualiza las imágenes regularmente**
6. **Revisa los logs cuando algo falle**
7. **Usa `docker-compose down -v` con cuidado** (elimina datos)

## Recursos Adicionales

- [Documentación completa de Docker](./DOCKER_README.md)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
