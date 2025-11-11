# 🔐 Sistema RBAC - Control de Acceso Basado en Roles

## Arquitectura de Permisos

El sistema implementa RBAC (Role-Based Access Control) granular que permite controlar el acceso a cada funcionalidad según el rol del usuario.

## 🎭 Roles Disponibles

### 1. Admin (Administrador)

**Descripción**: Dueño del restaurante con acceso completo al sistema.

**Permisos**:

- ✅ Gestión completa de empleados (crear, editar, eliminar)
- ✅ Gestión completa de productos
- ✅ Gestión completa de inventario
- ✅ Gestión completa de órdenes
- ✅ Gestión completa de mesas
- ✅ Gestión completa de reservas
- ✅ Acceso a reportes y análisis
- ✅ Configuración del restaurante

**Creación**: Se crea automáticamente al registrar un nuevo restaurante.

---

### 2. Mesero

**Descripción**: Personal de servicio que atiende las mesas y toma pedidos.

**Permisos**:

- ✅ Tomar pedidos (crear órdenes)
- ✅ Ver órdenes existentes
- ✅ Actualizar estado de órdenes
- ✅ Ver lista de productos
- ✅ Ver y actualizar estado de mesas
- ✅ Ver su perfil y actualizarlo
- ❌ No puede crear/eliminar empleados
- ❌ No puede gestionar inventario
- ❌ No puede eliminar órdenes

**Módulos visibles en el dashboard**:

- Tomar Pedido
- Órdenes
- Mesas
- Productos (solo lectura)
- Perfil

---

### 3. Cocinero

**Descripción**: Personal de cocina que prepara los pedidos.

**Permisos**:

- ✅ Ver órdenes pendientes
- ✅ Actualizar estado de órdenes (en preparación, lista)
- ✅ Ver productos
- ✅ Ver inventario (solo lectura)
- ✅ Ver su perfil y actualizarlo
- ❌ No puede crear órdenes
- ❌ No puede gestionar mesas
- ❌ No puede crear empleados

**Módulos visibles en el dashboard**:

- Órdenes (vista de cocina)
- Productos (solo lectura)
- Inventario (solo lectura)
- Perfil

---

### 4. Cajero

**Descripción**: Personal que procesa los pagos y cierra cuentas.

**Permisos**:

- ✅ Ver órdenes
- ✅ Actualizar órdenes (procesar pagos)
- ✅ Ver productos
- ✅ Ver su perfil y actualizarlo
- ❌ No puede crear órdenes
- ❌ No puede gestionar empleados
- ❌ No puede gestionar inventario

**Módulos visibles en el dashboard**:

- Órdenes (vista de caja)
- Productos (solo lectura)
- Perfil

---

### 5. Host

**Descripción**: Personal de recepción que gestiona reservas y asigna mesas.

**Permisos**:

- ✅ Gestión completa de reservas (crear, editar, cancelar)
- ✅ Ver y actualizar mesas
- ✅ Asignar mesas a clientes
- ✅ Ver su perfil y actualizarlo
- ❌ No puede tomar pedidos
- ❌ No puede gestionar empleados
- ❌ No puede gestionar inventario

**Módulos visibles en el dashboard**:

- Reservas
- Mesas
- Perfil

---

## 🔑 Matriz de Permisos Detallada

### Módulo: Empleados

| Acción            | Admin | Mesero | Cocinero | Cajero | Host |
| ----------------- | ----- | ------ | -------- | ------ | ---- |
| Ver empleados     | ✅    | ❌     | ❌       | ❌     | ❌   |
| Crear empleado    | ✅    | ❌     | ❌       | ❌     | ❌   |
| Editar empleado   | ✅    | ❌     | ❌       | ❌     | ❌   |
| Eliminar empleado | ✅    | ❌     | ❌       | ❌     | ❌   |

### Módulo: Productos

| Acción            | Admin | Mesero | Cocinero | Cajero | Host |
| ----------------- | ----- | ------ | -------- | ------ | ---- |
| Ver productos     | ✅    | ✅     | ✅       | ✅     | ❌   |
| Crear producto    | ✅    | ❌     | ❌       | ❌     | ❌   |
| Editar producto   | ✅    | ❌     | ❌       | ❌     | ❌   |
| Eliminar producto | ✅    | ❌     | ❌       | ❌     | ❌   |

### Módulo: Inventario

| Acción         | Admin | Mesero | Cocinero | Cajero | Host |
| -------------- | ----- | ------ | -------- | ------ | ---- |
| Ver inventario | ✅    | ❌     | ✅       | ❌     | ❌   |
| Crear item     | ✅    | ❌     | ❌       | ❌     | ❌   |
| Editar item    | ✅    | ❌     | ❌       | ❌     | ❌   |
| Eliminar item  | ✅    | ❌     | ❌       | ❌     | ❌   |

### Módulo: Órdenes

| Acción         | Admin | Mesero | Cocinero | Cajero | Host |
| -------------- | ----- | ------ | -------- | ------ | ---- |
| Ver órdenes    | ✅    | ✅     | ✅       | ✅     | ❌   |
| Crear orden    | ✅    | ✅     | ❌       | ❌     | ❌   |
| Editar orden   | ✅    | ✅     | ✅       | ✅     | ❌   |
| Eliminar orden | ✅    | ❌     | ❌       | ❌     | ❌   |
| Tomar pedido   | ✅    | ✅     | ❌       | ❌     | ❌   |

### Módulo: Mesas

| Acción        | Admin | Mesero | Cocinero | Cajero | Host |
| ------------- | ----- | ------ | -------- | ------ | ---- |
| Ver mesas     | ✅    | ✅     | ❌       | ❌     | ✅   |
| Crear mesa    | ✅    | ❌     | ❌       | ❌     | ❌   |
| Editar mesa   | ✅    | ✅     | ❌       | ❌     | ✅   |
| Eliminar mesa | ✅    | ❌     | ❌       | ❌     | ❌   |

### Módulo: Reservas

| Acción           | Admin | Mesero | Cocinero | Cajero | Host |
| ---------------- | ----- | ------ | -------- | ------ | ---- |
| Ver reservas     | ✅    | ❌     | ❌       | ❌     | ✅   |
| Crear reserva    | ✅    | ❌     | ❌       | ❌     | ✅   |
| Editar reserva   | ✅    | ❌     | ❌       | ❌     | ✅   |
| Eliminar reserva | ✅    | ❌     | ❌       | ❌     | ✅   |

### Módulo: Perfil

| Acción        | Todos los roles |
| ------------- | --------------- |
| Ver perfil    | ✅              |
| Editar perfil | ✅              |

---

## 🔒 Implementación en el Backend

### Middleware de Autorización

```javascript
// Verificar rol específico
authorize(ROLES.ADMIN);

// Verificar permiso específico
checkPermission(PERMISSIONS.EMPLEADOS.CREATE);

// Verificar mismo restaurante
checkSameRestaurant;
```

### Ejemplo de uso en rutas:

```javascript
// Solo admin puede crear empleados
router.post(
  "/users",
  protect, // Verificar autenticación
  authorize(ROLES.ADMIN), // Verificar rol admin
  validateCreateEmployee, // Validar datos
  createUser // Controlador
);

// Cualquier usuario autenticado puede ver su perfil
router.get(
  "/auth/me",
  protect, // Solo verificar autenticación
  getMe
);
```

---

## 📝 Buenas Prácticas

### 1. Principio de Menor Privilegio

Cada rol tiene solo los permisos necesarios para realizar su trabajo.

### 2. Separación de Responsabilidades

Los permisos están organizados por módulos y acciones específicas.

### 3. Validación en Múltiples Capas

- Frontend: Oculta opciones según el rol
- Backend: Valida permisos en cada endpoint

### 4. Auditoría

- Todos los usuarios tienen un campo `creadoPor`
- Se registra el `ultimoAcceso` en cada login

### 5. Seguridad

- Soft delete: No se eliminan usuarios, solo se desactivan
- No se puede cambiar el rol del admin principal
- No se puede asignar rol de admin desde la creación de empleados

---

## 🔄 Flujo de Autenticación

```
1. Usuario hace login
   ↓
2. Backend verifica credenciales
   ↓
3. Si es válido, genera JWT con el ID del usuario
   ↓
4. Frontend guarda el token
   ↓
5. Cada petición incluye el token en headers
   ↓
6. Backend verifica token y carga datos del usuario
   ↓
7. Middleware verifica permisos según el rol
   ↓
8. Si tiene permiso, ejecuta la acción
```

---

## 🛡️ Seguridad Adicional

### Restricción por Restaurante

Todos los empleados están asociados a un restaurante específico. Un admin del Restaurante A no puede ver/editar empleados del Restaurante B.

### Tokens con Expiración

Los JWT tienen una expiración configurable (por defecto 7 días). Después de este tiempo, el usuario debe volver a iniciar sesión.

### Contraseñas Seguras

- Hasheadas con bcrypt (10 rounds)
- Mínimo 6 caracteres requerido
- Nunca se devuelven en las respuestas de la API

---

## 📊 Ejemplo de Configuración

Ver el archivo `backend/src/config/roles.js` para la configuración completa de roles y permisos.

```javascript
export const ROLES = {
  ADMIN: "admin",
  MESERO: "mesero",
  COCINERO: "cocinero",
  CAJERO: "cajero",
  HOST: "host",
};

export const PERMISSIONS = {
  EMPLEADOS: {
    VIEW: "empleados:view",
    CREATE: "empleados:create",
    UPDATE: "empleados:update",
    DELETE: "empleados:delete",
  },
  // ... más permisos
};
```

---

## 🎯 Próximas Mejoras

- [ ] Permisos personalizados por usuario
- [ ] Múltiples roles por usuario
- [ ] Logs de auditoría de todas las acciones
- [ ] Permisos temporales
- [ ] Jerarquía de roles
