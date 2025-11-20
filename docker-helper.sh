#!/bin/bash

# Script de ayuda para gestionar el proyecto Bites ERP con Docker
# Uso: ./docker-helper.sh [comando]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de utilidad
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Verificar que Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker no está instalado. Por favor instala Docker primero."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
        exit 1
    fi
    
    print_success "Docker y Docker Compose están instalados"
}

# Verificar archivo .env
check_env() {
    if [ ! -f .env ]; then
        print_warning "Archivo .env no encontrado. Creando desde .env.example..."
        cp .env.example .env
        print_info "Por favor edita el archivo .env con tus configuraciones"
        exit 0
    fi
    print_success "Archivo .env encontrado"
}

# Iniciar en modo producción
start_prod() {
    print_info "Iniciando en modo PRODUCCIÓN..."
    docker-compose up -d
    print_success "Servicios iniciados"
    print_info "Frontend: http://localhost:3000"
    print_info "Backend: http://localhost:5000"
    print_info "MongoDB: localhost:27017"
}

# Iniciar en modo desarrollo
start_dev() {
    print_info "Iniciando en modo DESARROLLO..."
    docker-compose -f docker-compose.dev.yml up -d
    print_success "Servicios iniciados"
    print_info "Frontend: http://localhost:5173"
    print_info "Backend: http://localhost:5000"
    print_info "MongoDB: localhost:27017"
}

# Detener servicios
stop() {
    print_info "Deteniendo servicios..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    print_success "Servicios detenidos"
}

# Reiniciar servicios
restart() {
    print_info "Reiniciando servicios..."
    stop
    sleep 2
    start_prod
}

# Ver logs
logs() {
    if [ -z "$1" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$1"
    fi
}

# Ver estado
status() {
    print_info "Estado de los servicios:"
    docker-compose ps
}

# Construir imágenes
build() {
    print_info "Construyendo imágenes..."
    docker-compose build --no-cache
    print_success "Imágenes construidas"
}

# Limpiar todo
clean() {
    print_warning "¿Estás seguro de que quieres eliminar TODOS los contenedores, imágenes y volúmenes? (s/N)"
    read -r response
    if [[ "$response" =~ ^([sS][iI]|[sS])$ ]]; then
        print_info "Limpiando..."
        docker-compose down -v
        docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
        docker system prune -af --volumes
        print_success "Limpieza completada"
    else
        print_info "Operación cancelada"
    fi
}

# Ejecutar seed de base de datos
seed() {
    print_info "Ejecutando seed de base de datos..."
    docker-compose exec backend npm run seed
    print_success "Seed completado"
}

# Backup de MongoDB
backup() {
    BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    print_info "Creando backup en $BACKUP_DIR..."
    docker-compose exec -T mongodb mongodump --out /data/backup
    docker cp bites-mongodb:/data/backup "$BACKUP_DIR"
    print_success "Backup creado en $BACKUP_DIR"
}

# Restaurar MongoDB
restore() {
    if [ -z "$1" ]; then
        print_error "Debes especificar el directorio del backup"
        print_info "Uso: ./docker-helper.sh restore <directorio_backup>"
        exit 1
    fi
    
    print_warning "¿Estás seguro de que quieres restaurar desde $1? Esto sobrescribirá los datos actuales. (s/N)"
    read -r response
    if [[ "$response" =~ ^([sS][iI]|[sS])$ ]]; then
        print_info "Restaurando desde $1..."
        docker cp "$1" bites-mongodb:/data/restore
        docker-compose exec mongodb mongorestore /data/restore
        print_success "Restauración completada"
    else
        print_info "Operación cancelada"
    fi
}

# Acceder al shell de un servicio
shell() {
    if [ -z "$1" ]; then
        print_error "Debes especificar el servicio (backend, frontend, mongodb)"
        exit 1
    fi
    
    print_info "Accediendo al shell de $1..."
    docker-compose exec "$1" sh
}

# Mostrar ayuda
show_help() {
    cat << EOF
🐳 Bites ERP - Docker Helper Script

Uso: ./docker-helper.sh [comando] [opciones]

Comandos disponibles:

  Gestión de servicios:
    start-prod          Iniciar en modo producción
    start-dev           Iniciar en modo desarrollo
    stop                Detener todos los servicios
    restart             Reiniciar servicios
    status              Ver estado de los servicios
    build               Construir imágenes desde cero

  Logs y debugging:
    logs [servicio]     Ver logs (todos o de un servicio específico)
    shell <servicio>    Acceder al shell de un servicio

  Base de datos:
    seed                Ejecutar seed de la base de datos
    backup              Crear backup de MongoDB
    restore <dir>       Restaurar backup de MongoDB

  Mantenimiento:
    clean               Limpiar contenedores, imágenes y volúmenes
    check               Verificar requisitos

Ejemplos:
  ./docker-helper.sh start-dev
  ./docker-helper.sh logs backend
  ./docker-helper.sh shell mongodb
  ./docker-helper.sh backup
  ./docker-helper.sh restore ./backups/20240101_120000

EOF
}

# Comando principal
case "$1" in
    start-prod)
        check_docker
        check_env
        start_prod
        ;;
    start-dev)
        check_docker
        check_env
        start_dev
        ;;
    stop)
        stop
        ;;
    restart)
        check_docker
        check_env
        restart
        ;;
    logs)
        logs "$2"
        ;;
    status)
        status
        ;;
    build)
        check_docker
        build
        ;;
    clean)
        clean
        ;;
    seed)
        seed
        ;;
    backup)
        backup
        ;;
    restore)
        restore "$2"
        ;;
    shell)
        shell "$2"
        ;;
    check)
        check_docker
        check_env
        print_success "Todo listo para usar Docker"
        ;;
    *)
        show_help
        ;;
esac
