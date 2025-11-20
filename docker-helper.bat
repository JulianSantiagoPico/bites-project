@echo off
REM Script de ayuda para gestionar el proyecto Bites ERP con Docker en Windows
REM Uso: docker-helper.bat [comando]

setlocal enabledelayedexpansion

REM Verificar que Docker está instalado
:check_docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no esta instalado. Por favor instala Docker Desktop primero.
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose no esta instalado.
    exit /b 1
)

REM Verificar archivo .env
:check_env
if not exist .env (
    echo [ADVERTENCIA] Archivo .env no encontrado. Creando desde .env.example...
    copy .env.example .env
    echo [INFO] Por favor edita el archivo .env con tus configuraciones
    exit /b 0
)

REM Procesar comandos
if "%1"=="" goto show_help
if "%1"=="start-prod" goto start_prod
if "%1"=="start-dev" goto start_dev
if "%1"=="start-atlas-prod" goto start_atlas_prod
if "%1"=="start-atlas-dev" goto start_atlas_dev
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart
if "%1"=="logs" goto logs
if "%1"=="status" goto status
if "%1"=="build" goto build
if "%1"=="clean" goto clean
if "%1"=="seed" goto seed
if "%1"=="backup" goto backup
if "%1"=="shell" goto shell
if "%1"=="check" goto check
goto show_help

:start_prod
echo [INFO] Iniciando en modo PRODUCCION...
docker-compose up -d
echo [OK] Servicios iniciados
echo [INFO] Frontend: http://localhost:3000
echo [INFO] Backend: http://localhost:5000
echo [INFO] MongoDB: localhost:27017
goto end

:start_dev
echo [INFO] Iniciando en modo DESARROLLO...
docker-compose -f docker-compose.dev.yml up -d
echo [OK] Servicios iniciados
echo [INFO] Frontend: http://localhost:5173
echo [INFO] Backend: http://localhost:5000
echo [INFO] MongoDB: localhost:27017
goto end

:start_atlas_prod
echo [INFO] Iniciando en modo PRODUCCION con MongoDB Atlas...
docker-compose -f docker-compose.atlas.yml up -d
echo [OK] Servicios iniciados
echo [INFO] Frontend: http://localhost:3000
echo [INFO] Backend: http://localhost:5000
echo [INFO] MongoDB: Atlas (Cloud)
goto end

:start_atlas_dev
echo [INFO] Iniciando en modo DESARROLLO con MongoDB Atlas...
docker-compose -f docker-compose.atlas-dev.yml up -d
echo [OK] Servicios iniciados
echo [INFO] Frontend: http://localhost:5173
echo [INFO] Backend: http://localhost:5000
echo [INFO] MongoDB: Atlas (Cloud)
goto end

:stop
echo [INFO] Deteniendo servicios...
docker-compose down 2>nul
docker-compose -f docker-compose.dev.yml down 2>nul
docker-compose -f docker-compose.atlas.yml down 2>nul
docker-compose -f docker-compose.atlas-dev.yml down 2>nul
echo [OK] Servicios detenidos
goto end

:restart
echo [INFO] Reiniciando servicios...
call :stop
timeout /t 2 /nobreak >nul
call :start_prod
goto end

:logs
if "%2"=="" (
    docker-compose logs -f
) else (
    docker-compose logs -f %2
)
goto end

:status
echo [INFO] Estado de los servicios:
docker-compose ps
goto end

:build
echo [INFO] Construyendo imagenes...
docker-compose build --no-cache
echo [OK] Imagenes construidas
goto end

:clean
set /p confirm="Estas seguro de que quieres eliminar TODOS los contenedores, imagenes y volumenes? (s/N): "
if /i "%confirm%"=="s" (
    echo [INFO] Limpiando...
    docker-compose down -v
    docker-compose -f docker-compose.dev.yml down -v 2>nul
    docker system prune -af --volumes
    echo [OK] Limpieza completada
) else (
    echo [INFO] Operacion cancelada
)
goto end

:seed
echo [INFO] Ejecutando seed de base de datos...
docker-compose exec backend npm run seed
echo [OK] Seed completado
goto end

:backup
set BACKUP_DIR=backups\%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set BACKUP_DIR=%BACKUP_DIR: =0%
mkdir %BACKUP_DIR% 2>nul
echo [INFO] Creando backup en %BACKUP_DIR%...
docker-compose exec -T mongodb mongodump --out /data/backup
docker cp bites-mongodb:/data/backup %BACKUP_DIR%
echo [OK] Backup creado en %BACKUP_DIR%
goto end

:shell
if "%2"=="" (
    echo [ERROR] Debes especificar el servicio (backend, frontend, mongodb^)
    exit /b 1
)
echo [INFO] Accediendo al shell de %2...
docker-compose exec %2 sh
goto end

:check
call :check_docker
call :check_env
echo [OK] Todo listo para usar Docker
goto end

:show_help
echo.
echo Docker Helper Script para Bites ERP
echo.
echo Uso: docker-helper.bat [comando] [opciones]
echo.
echo Comandos disponibles:
echo.
echo   Gestion de servicios (MongoDB Local):
echo     start-prod          Iniciar en modo produccion
echo     start-dev           Iniciar en modo desarrollo
echo.
echo   Gestion de servicios (MongoDB Atlas - Cloud):
echo     start-atlas-prod    Iniciar en modo produccion con Atlas
echo     start-atlas-dev     Iniciar en modo desarrollo con Atlas
echo.
echo   Control general:
echo     stop                Detener todos los servicios
echo     restart             Reiniciar servicios
echo     status              Ver estado de los servicios
echo     build               Construir imagenes desde cero
echo.
echo   Logs y debugging:
echo     logs [servicio]     Ver logs (todos o de un servicio especifico^)
echo     shell ^<servicio^>    Acceder al shell de un servicio
echo.
echo   Base de datos:
echo     seed                Ejecutar seed de la base de datos
echo     backup              Crear backup de MongoDB (solo local^)
echo.
echo   Mantenimiento:
echo     clean               Limpiar contenedores, imagenes y volumenes
echo     check               Verificar requisitos
echo.
echo Ejemplos:
echo   docker-helper.bat start-atlas-dev    (Recomendado para este proyecto^)
echo   docker-helper.bat logs backend
echo   docker-helper.bat shell backend
echo   docker-helper.bat stop
echo.
echo Nota: Este proyecto usa MongoDB Atlas por defecto.
echo       Usa los comandos 'start-atlas-*' para trabajar con Atlas.
echo.
goto end

:end
endlocal
