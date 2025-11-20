# ✅ Checklist de Deployment - Bites ERP

## Pre-Deployment

### Configuración Inicial

- [ ] Docker y Docker Compose instalados
- [ ] Archivo `.env` creado desde `.env.example`
- [ ] Variables de entorno configuradas correctamente
- [ ] JWT_SECRET cambiado a una clave segura (mínimo 32 caracteres)
- [ ] Contraseñas de MongoDB actualizadas
- [ ] CORS_ORIGIN configurado según dominio de producción

### Seguridad

- [ ] `.env` incluido en `.gitignore`
- [ ] Credenciales por defecto cambiadas
- [ ] Firewall configurado (solo puertos necesarios abiertos)
- [ ] HTTPS configurado (certificado SSL/TLS)
- [ ] Rate limiting implementado
- [ ] Logs de seguridad habilitados

### Base de Datos

- [ ] Estrategia de backup definida
- [ ] Backup inicial creado
- [ ] Procedimiento de restore probado
- [ ] Índices de MongoDB optimizados
- [ ] Datos de prueba eliminados

## Testing

### Funcionalidad

- [ ] Todas las rutas del backend funcionan
- [ ] Frontend se conecta correctamente al backend
- [ ] WebSocket funciona correctamente
- [ ] Autenticación JWT funciona
- [ ] Permisos de roles funcionan correctamente

### Docker

- [ ] Imágenes construyen sin errores
- [ ] Contenedores inician correctamente
- [ ] Healthchecks pasan
- [ ] Volúmenes persisten datos
- [ ] Red entre contenedores funciona
- [ ] Logs son accesibles

### Performance

- [ ] Tiempo de carga del frontend < 3s
- [ ] API responde en < 500ms
- [ ] MongoDB queries optimizadas
- [ ] Assets estáticos cacheados
- [ ] Compresión gzip habilitada

## Deployment

### Construcción

```bash
# Construir imágenes
docker-compose build --no-cache

# Verificar imágenes
docker images | grep bites
```

### Inicio

```bash
# Iniciar servicios
docker-compose up -d

# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f
```

### Verificación

- [ ] Frontend accesible en puerto configurado
- [ ] Backend responde en `/` endpoint
- [ ] MongoDB acepta conexiones
- [ ] Healthchecks en estado "healthy"
- [ ] No hay errores en logs

## Post-Deployment

### Monitoreo

- [ ] Configurar alertas de caída de servicio
- [ ] Monitorear uso de recursos (CPU, RAM, Disco)
- [ ] Configurar logging centralizado
- [ ] Dashboard de métricas (opcional: Grafana)

### Backup

- [ ] Backup automático configurado
- [ ] Backup manual inicial creado
- [ ] Procedimiento de restore documentado
- [ ] Backups almacenados en ubicación segura

### Documentación

- [ ] URLs de acceso documentadas
- [ ] Credenciales almacenadas de forma segura
- [ ] Procedimientos de mantenimiento documentados
- [ ] Contactos de soporte definidos

## Mantenimiento Regular

### Diario

- [ ] Verificar que servicios estén corriendo
- [ ] Revisar logs de errores
- [ ] Verificar espacio en disco

### Semanal

- [ ] Crear backup de MongoDB
- [ ] Revisar métricas de rendimiento
- [ ] Actualizar dependencias de seguridad

### Mensual

- [ ] Actualizar imágenes Docker
- [ ] Limpiar logs antiguos
- [ ] Revisar y optimizar queries de BD
- [ ] Prueba de restore de backup

## Comandos Útiles

### Verificación de Estado

```bash
# Estado de servicios
docker-compose ps

# Uso de recursos
docker stats

# Espacio en disco
docker system df
```

### Logs

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f backend

# Últimas 100 líneas
docker-compose logs --tail=100
```

### Backup

```bash
# Crear backup
docker-compose exec mongodb mongodump --out /data/backup
docker cp bites-mongodb:/data/backup ./backup-$(date +%Y%m%d)

# Restore
docker cp ./backup-20240101 bites-mongodb:/data/restore
docker-compose exec mongodb mongorestore /data/restore
```

### Actualización

```bash
# Detener servicios
docker-compose down

# Actualizar código
git pull

# Reconstruir imágenes
docker-compose build --no-cache

# Iniciar servicios
docker-compose up -d

# Verificar
docker-compose ps
docker-compose logs -f
```

### Rollback

```bash
# Detener servicios
docker-compose down

# Volver a versión anterior
git checkout <commit-anterior>

# Reconstruir
docker-compose build

# Iniciar
docker-compose up -d

# Restaurar backup si es necesario
docker cp ./backup-20240101 bites-mongodb:/data/restore
docker-compose exec mongodb mongorestore /data/restore
```

## Troubleshooting

### Servicio no inicia

1. Verificar logs: `docker-compose logs <servicio>`
2. Verificar variables de entorno: `docker-compose config`
3. Verificar puertos: `netstat -ano | findstr :<puerto>`
4. Reconstruir: `docker-compose up -d --build <servicio>`

### Base de datos corrupta

1. Detener servicios: `docker-compose down`
2. Eliminar volumen: `docker volume rm bites-project_mongodb_data`
3. Iniciar MongoDB: `docker-compose up -d mongodb`
4. Restaurar backup: `docker-compose exec mongodb mongorestore /data/restore`

### Espacio en disco lleno

1. Limpiar logs: `docker-compose exec backend rm -rf logs/*`
2. Limpiar Docker: `docker system prune -a`
3. Eliminar volúmenes no usados: `docker volume prune`

### Performance degradado

1. Verificar recursos: `docker stats`
2. Revisar logs de errores
3. Optimizar queries de MongoDB
4. Aumentar recursos del servidor
5. Considerar escalado horizontal

## Contactos de Emergencia

- **Desarrollador**: [Tu nombre/email]
- **DevOps**: [Contacto DevOps]
- **Soporte MongoDB**: [Contacto]
- **Hosting Provider**: [Contacto]

## Notas Adicionales

### URLs de Producción

- Frontend: https://tu-dominio.com
- Backend API: https://api.tu-dominio.com
- Documentación: https://docs.tu-dominio.com

### Credenciales (Almacenar de forma segura)

- MongoDB: [Usar gestor de contraseñas]
- JWT Secret: [Usar gestor de contraseñas]
- Servidor: [Usar gestor de contraseñas]

### Recursos

- Repositorio: https://github.com/JulianSantiagoPico/bites-project
- Documentación Docker: [DOCKER_README.md](./DOCKER_README.md)
- Arquitectura: [DOCKER_ARCHITECTURE.md](./DOCKER_ARCHITECTURE.md)
- Guía rápida: [DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md)

---

**Última actualización**: [Fecha]  
**Versión**: 1.0.0  
**Responsable**: [Tu nombre]
