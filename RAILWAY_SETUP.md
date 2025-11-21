# Configuración de Railway para Bites ERP

## Variables de Entorno Requeridas

### Backend (bites-backend)

```env
# Base de datos MongoDB Atlas
MONGODB_URI=mongodb+srv://...

# Puerto (Railway lo asigna automáticamente)
PORT=5000

# Entorno
NODE_ENV=production

# JWT
JWT_SECRET=tu_jwt_secret_seguro
JWT_EXPIRE=7d

# CORS - ⚠️ IMPORTANTE: Debe ser la URL exacta del frontend, NO usar asterisco (*)
CORS_ORIGIN=https://bites-frontend.up.railway.app

# Puerto del backend (Railway lo asigna)
BACKEND_PORT=5000
```

### Frontend (bites-frontend)

```env
# URL de la API del backend (con /api al final)
VITE_API_URL=https://bites-project-production.up.railway.app/api

# URL del WebSocket (sin /api, raíz del backend)
VITE_SOCKET_URL=https://bites-project-production.up.railway.app
```

## Pasos de Configuración

### 1. Configurar Backend

1. Ve al servicio `bites-backend` en Railway
2. Click en la pestaña **Variables**
3. Configura las variables listadas arriba
4. **CRÍTICO:** Asegúrate que `CORS_ORIGIN` sea exactamente `https://bites-frontend.up.railway.app` (sin barra al final)
5. Guarda y redeploy

### 2. Configurar Frontend

1. Ve al servicio `bites-frontend` en Railway
2. Click en la pestaña **Variables**
3. Configura:
   - `VITE_API_URL=https://bites-project-production.up.railway.app/api`
   - `VITE_SOCKET_URL=https://bites-project-production.up.railway.app`
4. Guarda y redeploy

### 3. Verificar Deployment

Después de redesplegar ambos servicios:

1. Abre la consola del navegador en `https://bites-frontend.up.railway.app`
2. Deberías ver:
   ```
   🔌 Conectando a WebSocket: https://bites-project-production.up.railway.app
   ✅ WebSocket conectado: [socket-id]
   📡 Uniéndose a restaurante: [restaurante-id]
   ✅ Unido a sala de restaurante: {...}
   ```

## Troubleshooting WebSocket

### Problema: WebSocket no conecta

**Síntomas:**

- Órdenes no aparecen en tiempo real en cocina
- Errores de CORS en consola
- Mensaje "WebSocket desconectado"

**Soluciones:**

1. **Verificar CORS_ORIGIN en backend**

   ```
   ❌ INCORRECTO: CORS_ORIGIN=*
   ✅ CORRECTO: CORS_ORIGIN=https://bites-frontend.up.railway.app
   ```

2. **Verificar URLs en frontend**

   - `VITE_API_URL` debe terminar en `/api`
   - `VITE_SOCKET_URL` NO debe terminar en `/api`

3. **Verificar en consola del navegador**

   - Busca errores de conexión
   - Verifica que la URL de conexión sea correcta

4. **Verificar logs del backend en Railway**
   - Deberías ver: `✅ Cliente conectado: [socket-id]`
   - Si ves errores de CORS, revisa `CORS_ORIGIN`

### Problema: CORS Error

**Error típico:**

```
Access to XMLHttpRequest at 'https://...' from origin 'https://...'
has been blocked by CORS policy
```

**Solución:**

1. En Railway backend, configura `CORS_ORIGIN` con la URL exacta del frontend
2. NO uses `*` (asterisco) - no funciona con WebSocket + credentials
3. Si tienes múltiples dominios, sepáralos con coma:
   ```
   CORS_ORIGIN=https://bites-frontend.up.railway.app,https://otro-dominio.com
   ```

### Problema: Eventos no se reciben

**Síntomas:**

- WebSocket conecta pero no llegan eventos
- Órdenes no aparecen en cocina

**Verificar:**

1. **En consola del navegador:**

   ```javascript
   // Deberías ver estos logs al crear un pedido:
   📨 [Socket] Nuevo pedido: PED-001
   ```

2. **En logs del backend (Railway):**

   ```
   📨 [Socket] Nuevo pedido: PED-001
   ```

3. **Verificar que estás unido a las salas correctas:**
   - Módulo de cocina debe unirse a `cocina:restauranteId`
   - Otros módulos se unen a `restaurante:restauranteId`

## Comandos Útiles

### Ver logs en tiempo real (Railway CLI)

```bash
# Backend
railway logs -s bites-backend

# Frontend
railway logs -s bites-frontend
```

### Redesplegar servicios

```bash
# Backend
railway up -s bites-backend

# Frontend
railway up -s bites-frontend
```

## Checklist de Deployment

- [ ] Variables de entorno configuradas en backend
- [ ] Variables de entorno configuradas en frontend
- [ ] `CORS_ORIGIN` NO es `*`, es la URL exacta del frontend
- [ ] `VITE_SOCKET_URL` apunta al backend (sin `/api`)
- [ ] `VITE_API_URL` apunta al backend (con `/api`)
- [ ] Ambos servicios redesployados
- [ ] Consola del navegador muestra conexión exitosa
- [ ] Logs del backend muestran clientes conectados
- [ ] Prueba: crear orden y verificar que aparece en cocina

## Notas Importantes

1. **CORS_ORIGIN con asterisco (`*`) NO funciona** con Socket.IO cuando se usan credenciales
2. Railway asigna URLs automáticamente, usa las URLs exactas que te da Railway
3. Cada vez que cambies variables de entorno, debes redesplegar el servicio
4. Los logs en Railway son tu mejor amigo para debugging
