# 🚂 Guía de Deployment en Railway

Esta guía te ayudará a desplegar tu aplicación Bites en Railway usando servicios separados para frontend y backend.

## 📋 Prerrequisitos

- Cuenta en [Railway.app](https://railway.app)
- MongoDB Atlas configurado (ya lo tienes)
- Repositorio en GitHub

## 🏗️ Arquitectura en Railway

Railway no soporta Docker Compose directamente. En su lugar, crearás:

1. **Backend Service** - API Node.js
2. **Frontend Service** - React + Nginx
3. **MongoDB** - Usarás MongoDB Atlas (externo)

## 🚀 Pasos de Deployment

### **1. Preparar el Repositorio**

Asegúrate de que tus cambios estén en GitHub:

```bash
git add .
git commit -m "chore: add Railway configuration files"
git push origin test-docker
```

### **2. Crear Proyecto en Railway**

1. Ve a [railway.app](https://railway.app) y haz login
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway a acceder a tu repositorio
5. Selecciona el repositorio `bites-project`

### **3. Configurar Backend Service**

#### 3.1 Crear el servicio

1. En tu proyecto de Railway, click en **"+ New"**
2. Selecciona **"GitHub Repo"**
3. Elige tu repositorio
4. Railway detectará automáticamente el Dockerfile

#### 3.2 Configurar el Builder

1. Ve a **Settings** del servicio backend
2. En **"Build"** sección:
   - **Builder**: Dockerfile
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Root Directory**: `/` (raíz del proyecto)

#### 3.3 Configurar Variables de Entorno

En **Variables** tab, añade:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=tu_mongodb_atlas_uri_aqui
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
CORS_ORIGIN=${{RAILWAY_STATIC_URL}}
```

**Importante**:

- Reemplaza `MONGODB_URI` con tu URI de MongoDB Atlas
- Genera un JWT_SECRET seguro
- `${{RAILWAY_STATIC_URL}}` es una variable de Railway que se auto-completa

#### 3.4 Configurar Networking

1. Ve a **Settings** → **Networking**
2. Click en **"Generate Domain"** para obtener una URL pública
3. Copia esta URL (la necesitarás para el frontend)

### **4. Configurar Frontend Service**

#### 4.1 Crear el servicio

1. Click en **"+ New"** en tu proyecto
2. Selecciona **"GitHub Repo"**
3. Elige el mismo repositorio
4. Nómbralo "frontend" para diferenciarlo

#### 4.2 Configurar el Builder

1. Ve a **Settings** del servicio frontend
2. En **"Build"** sección:
   - **Builder**: Dockerfile
   - **Dockerfile Path**: `frontend/Dockerfile`
   - **Root Directory**: `/` (raíz del proyecto)

#### 4.3 Configurar Build Arguments

En **Variables** tab, añade:

```env
VITE_API_URL=https://tu-backend-url.railway.app
```

**Importante**: Reemplaza con la URL que generaste en el paso 3.4

#### 4.4 Configurar Networking

1. Ve a **Settings** → **Networking**
2. Click en **"Generate Domain"**
3. Esta será la URL pública de tu aplicación

### **5. Actualizar CORS en Backend**

Vuelve al servicio backend y actualiza la variable:

```env
CORS_ORIGIN=https://tu-frontend-url.railway.app
```

### **6. Re-deploy**

1. Ambos servicios se desplegarán automáticamente
2. Puedes ver los logs en tiempo real en cada servicio
3. Espera a que ambos servicios estén en estado **"Active"**

## 🔧 Configuración Avanzada

### Usar Railway CLI (Opcional)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link al proyecto
railway link

# Ver logs
railway logs

# Deploy manualmente
railway up
```

### Variables de Entorno Completas

#### Backend (`backend` service)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bites_db
JWT_SECRET=super-secret-key-change-this
CORS_ORIGIN=https://your-frontend.railway.app
```

#### Frontend (`frontend` service)

```env
VITE_API_URL=https://your-backend.railway.app
```

## 📊 Monitoreo

Railway proporciona:

- **Logs en tiempo real**: Click en el servicio → Logs
- **Métricas**: CPU, RAM, Network
- **Deployments**: Historial de deployments

## 🐛 Troubleshooting

### Error: "Cannot find Dockerfile"

**Solución**: Verifica que el **Root Directory** esté en `/` y el **Dockerfile Path** sea correcto:

- Backend: `backend/Dockerfile`
- Frontend: `frontend/Dockerfile`

### Error: "Build failed"

**Solución**: Revisa los logs de build. Comúnmente:

- Falta `package.json` en el contexto
- Variables de entorno faltantes
- Errores de sintaxis en Dockerfile

### Frontend no se conecta al Backend

**Solución**:

1. Verifica que `VITE_API_URL` esté configurado correctamente
2. Verifica que `CORS_ORIGIN` en backend incluya la URL del frontend
3. Asegúrate de que ambos servicios estén "Active"

### Error de MongoDB Connection

**Solución**:

1. Verifica que `MONGODB_URI` sea correcto
2. Asegúrate de que MongoDB Atlas permita conexiones desde cualquier IP (0.0.0.0/0)
3. Verifica que el usuario de MongoDB tenga permisos correctos

## 💰 Costos

Railway ofrece:

- **$5 USD de crédito gratis** cada mes
- **Hobby Plan**: $5/mes de crédito
- **Pro Plan**: $20/mes + uso

Tu aplicación debería caber en el plan gratuito para desarrollo/testing.

## 🔄 CI/CD Automático

Railway automáticamente:

- ✅ Detecta cambios en GitHub
- ✅ Hace build automático
- ✅ Despliega automáticamente
- ✅ Rollback si falla

Para configurar qué rama desplegar:

1. Settings → **Source**
2. Selecciona la rama (ej: `main` o `test-docker`)

## 📝 Checklist de Deployment

- [ ] Repositorio en GitHub actualizado
- [ ] MongoDB Atlas configurado y accesible
- [ ] Proyecto creado en Railway
- [ ] Backend service configurado con Dockerfile correcto
- [ ] Variables de entorno del backend configuradas
- [ ] Backend domain generado
- [ ] Frontend service configurado con Dockerfile correcto
- [ ] VITE_API_URL apunta al backend
- [ ] Frontend domain generado
- [ ] CORS_ORIGIN actualizado en backend
- [ ] Ambos servicios en estado "Active"
- [ ] Aplicación accesible desde el navegador

## 🎉 ¡Listo!

Tu aplicación debería estar funcionando en:

- **Frontend**: `https://your-frontend.railway.app`
- **Backend**: `https://your-backend.railway.app`

---

**¿Necesitas ayuda?** Revisa los logs en Railway o consulta la [documentación oficial](https://docs.railway.app).
