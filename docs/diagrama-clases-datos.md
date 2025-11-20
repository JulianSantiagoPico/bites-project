# Diagrama de Clases - Sistema de Gestión de Restaurante

## 📋 Información General

Este documento contiene toda la información necesaria para crear el diagrama de clases UML del sistema de gestión de restaurantes "Bites Project". El diagrama incluye:

- **Atributos**: Extraídos de los modelos de MongoDB
- **Métodos**: Extraídos de los controladores y métodos de los modelos
- **Relaciones**: Basadas en las referencias entre modelos

---

## 🏗️ Clases Principales

### 1. **Restaurante**

#### Atributos:

- `_id: ObjectId`
- `nombre: String`
- `descripcion: String`
- `telefono: String`
- `email: String`
- `direccion: Object`
  - `calle: String`
  - `ciudad: String`
  - `estado: String`
  - `codigoPostal: String`
  - `pais: String`
- `logo: String`
- `horarios: Object`
  - `lunes: {apertura, cierre, cerrado}`
  - `martes: {apertura, cierre, cerrado}`
  - `miercoles: {apertura, cierre, cerrado}`
  - `jueves: {apertura, cierre, cerrado}`
  - `viernes: {apertura, cierre, cerrado}`
  - `sabado: {apertura, cierre, cerrado}`
  - `domingo: {apertura, cierre, cerrado}`
- `adminId: ObjectId` (ref: User)
- `activo: Boolean`
- `createdAt: Date`
- `updatedAt: Date`

#### Métodos (desde controladores):

- `getRestaurante()`
- `updateRestaurante()`
- `updateHorarios()`
- `uploadLogo()`

#### Relaciones:

- **1 a N** con User (tiene muchos empleados)
- **1 a N** con Mesa (tiene muchas mesas)
- **1 a N** con Producto (tiene muchos productos)
- **1 a N** con Pedido (tiene muchos pedidos)
- **1 a N** con Reserva (tiene muchas reservas)
- **1 a N** con Inventario (tiene muchos items de inventario)
- **1 a N** con Categoria (tiene muchas categorías)
- **1 a N** con Rol (tiene muchos roles)
- **1 a N** con Ubicacion (tiene muchas ubicaciones)
- **1 a N** con Ocasion (tiene muchas ocasiones)

---

### 2. **User** (Usuario/Empleado)

#### Atributos:

- `_id: ObjectId`
- `nombre: String`
- `apellido: String`
- `email: String`
- `password: String` (hasheado)
- `rol: String` (ref: Rol key)
- `restauranteId: ObjectId` (ref: Restaurante)
- `telefono: String`
- `foto: String`
- `activo: Boolean`
- `creadoPor: ObjectId` (ref: User)
- `ultimoAcceso: Date`
- `configuracionCompleta: Boolean`
- `createdAt: Date`
- `updatedAt: Date`

#### Métodos de Instancia:

- `comparePassword(candidatePassword): Boolean`
- `toPublicJSON(): Object`

#### Métodos Virtuales:

- `nombreCompleto: String` (getter)

#### Métodos (desde controladores):

- `getUsers()`
- `getUserById(id)`
- `createUser()`
- `updateUser(id)`
- `deleteUser(id)` (soft delete)
- `login()`
- `register()`
- `getCurrentUser()`
- `updateProfile()`
- `changePassword()`

#### Relaciones:

- **N a 1** con Restaurante (pertenece a un restaurante)
- **1 a N** con Pedido (como mesero, crea muchos pedidos)
- **1 a N** con Mesa (puede estar asignado a muchas mesas)
- **1 a N** con Reserva (crea/modifica reservas)

---

### 3. **Pedido**

#### Atributos:

- `_id: ObjectId`
- `numeroPedido: String` (único por restaurante)
- `mesaId: ObjectId` (ref: Mesa)
- `meseroId: ObjectId` (ref: User)
- `items: Array<ItemPedido>`
  - `productoId: ObjectId` (ref: Producto)
  - `nombre: String`
  - `cantidad: Number`
  - `precioUnitario: Number`
  - `subtotal: Number`
  - `notas: String`
- `subtotal: Number`
- `impuestos: Number`
- `propina: Number`
- `total: Number`
- `estado: String` (enum: pendiente, en_preparacion, listo, entregado, cancelado)
- `historialEstados: Array<HistorialEstado>`
  - `estado: String`
  - `fechaCambio: Date`
  - `cambiadoPor: ObjectId` (ref: User)
- `nombreCliente: String`
- `notas: String`
- `fechaEstimadaEntrega: Date`
- `fechaEntrega: Date`
- `restauranteId: ObjectId` (ref: Restaurante)
- `activo: Boolean`
- `creadoPor: ObjectId` (ref: User)
- `modificadoPor: ObjectId` (ref: User)
- `createdAt: Date`
- `updatedAt: Date`

#### Métodos Estáticos:

- `generarNumeroPedido(restauranteId): String`

#### Métodos de Instancia:

- `calcularTotales(porcentajeImpuesto): Number`
- `toPublicJSON(): Object`

#### Métodos (desde controladores):

- `getPedidos()`
- `getPedidoById(id)`
- `getPedidosByMesa(mesaId)`
- `createPedido()`
- `updatePedido(id)`
- `changeEstado(id, estado)`
- `cancelPedido(id)`
- `getEstadisticas()`

#### Relaciones:

- **N a 1** con Mesa (pertenece a una mesa)
- **N a 1** con User (creado por un mesero)
- **N a 1** con Restaurante (pertenece a un restaurante)
- **N a N** con Producto (a través de items)

---

### 4. **Producto**

#### Atributos:

- `_id: ObjectId`
- `nombre: String`
- `descripcion: String`
- `categoria: String` (ref: Categoria key)
- `precio: Number`
- `imagen: String` (emoji o URL)
- `disponible: Boolean`
- `destacado: Boolean`
- `tiempoPreparacion: Number` (minutos)
- `tags: Array<String>`
- `restauranteId: ObjectId` (ref: Restaurante)
- `activo: Boolean`
- `creadoPor: ObjectId` (ref: User)
- `modificadoPor: ObjectId` (ref: User)
- `createdAt: Date`
- `updatedAt: Date`

#### Métodos Virtuales:

- `estaDisponible: Boolean` (getter)

#### Métodos de Instancia:

- `toPublicJSON(): Object`

#### Métodos (desde controladores):

- `getProductos()`
- `getProductoById(id)`
- `createProducto()`
- `updateProducto(id)`
- `deleteProducto(id)` (soft delete)
- `toggleDisponibilidad(id)`
- `getEstadisticas()`
- `getProductosDestacados()`

#### Relaciones:

- **N a 1** con Restaurante (pertenece a un restaurante)
- **N a 1** con Categoria (pertenece a una categoría)
- **N a N** con Pedido (a través de items)

---

### 5. **Mesa**

#### Atributos:

- `_id: ObjectId`
- `numero: Number` (único por restaurante)
- `capacidad: Number`
- `ubicacion: String` (ref: Ubicacion key)
- `estado: String` (enum: disponible, ocupada, reservada, en_limpieza)
- `meseroAsignado: ObjectId` (ref: User)
- `notas: String`
- `restauranteId: ObjectId` (ref: Restaurante)
- `activo: Boolean`
- `creadoPor: ObjectId` (ref: User)
- `modificadoPor: ObjectId` (ref: User)
- `createdAt: Date`
- `updatedAt: Date`

#### Métodos Virtuales:

- `estaDisponible: Boolean` (getter)
- `estadoInfo: Object` (getter - color, texto, icon)

#### Métodos de Instancia:

- `toPublicJSON(): Object`

#### Métodos (desde controladores):

- `getMesas()`
- `getMesaById(id)`
- `createMesa()`
- `updateMesa(id)`
- `deleteMesa(id)` (soft delete)
- `changeEstado(id, estado)`
- `asignarMesero(id, meseroId)`
- `getEstadisticas()`

#### Relaciones:

- **N a 1** con Restaurante (pertenece a un restaurante)
- **N a 1** con User (asignada a un mesero)
- **N a 1** con Ubicacion (tiene una ubicación)
- **1 a N** con Pedido (puede tener muchos pedidos)
- **1 a N** con Reserva (puede tener muchas reservas)

---

### 6. **Reserva**

#### Atributos:

- `_id: ObjectId`
- `nombreCliente: String`
- `telefonoCliente: String`
- `emailCliente: String`
- `fecha: Date`
- `hora: String` (formato HH:MM)
- `numeroPersonas: Number`
- `mesaAsignada: ObjectId` (ref: Mesa)
- `estado: String` (enum: pendiente, confirmada, sentada, completada, cancelada, no_show)
- `notas: String`
- `ocasion: String` (ref: Ocasion key)
- `restauranteId: ObjectId` (ref: Restaurante)
- `activo: Boolean`
- `creadoPor: ObjectId` (ref: User)
- `modificadoPor: ObjectId` (ref: User)
- `createdAt: Date`
- `updatedAt: Date`

#### Métodos Virtuales:

- `fechaHoraCompleta: Date` (getter)

#### Métodos de Instancia:

- `esHoy(): Boolean`
- `haPasado(): Boolean`
- `toPublicJSON(): Object`

#### Métodos (desde controladores):

- `getReservas()`
- `getReservaById(id)`
- `createReserva()`
- `updateReserva(id)`
- `deleteReserva(id)` (soft delete)
- `changeEstado(id, estado)`
- `asignarMesa(id, mesaId)`
- `getEstadisticas()`

#### Relaciones:

- **N a 1** con Restaurante (pertenece a un restaurante)
- **N a 1** con Mesa (asignada a una mesa)
- **N a 1** con Ocasion (tiene una ocasión)

---

### 7. **Inventario**

#### Atributos:

- `_id: ObjectId`
- `nombre: String`
- `descripcion: String`
- `categoria: String` (enum: Carnes, Vegetales, Lácteos, Bebidas, Especias, Otros)
- `cantidad: Number`
- `unidadMedida: String` (enum: kg, litros, unidades, cajas)
- `cantidadMinima: Number`
- `precioUnitario: Number`
- `proveedor: String`
- `lote: String`
- `fechaVencimiento: Date`
- `restauranteId: ObjectId` (ref: Restaurante)
- `activo: Boolean`
- `creadoPor: ObjectId` (ref: User)
- `modificadoPor: ObjectId` (ref: User)
- `createdAt: Date`
- `updatedAt: Date`

#### Métodos Virtuales:

- `estado: String` (getter - Agotado, Crítico, Bajo Stock, Normal)
- `valorTotal: Number` (getter)
- `proximoAVencer: Boolean` (getter)
- `vencido: Boolean` (getter)

#### Métodos de Instancia:

- `toPublicJSON(): Object`

#### Métodos Estáticos:

- `getEstadisticas(restauranteId): Object`
- `getAlertas(restauranteId): Object`

#### Métodos (desde controladores):

- `getInventario()`
- `getInventarioById(id)`
- `createInventario()`
- `updateInventario(id)`
- `deleteInventario(id)` (soft delete)
- `getEstadisticas()`
- `getAlertas()`
- `registrarMovimiento(id, tipo, cantidad)`

#### Relaciones:

- **N a 1** con Restaurante (pertenece a un restaurante)

---

### 8. **Categoria**

#### Atributos:

- `_id: ObjectId`
- `restauranteId: ObjectId` (ref: Restaurante)
- `key: String` (identificador único)
- `label: String` (nombre visible)
- `icon: String` (emoji)
- `orden: Number`
- `activo: Boolean`
- `predefinida: Boolean`
- `createdAt: Date`
- `updatedAt: Date`

#### Métodos (desde controladores):

- `getCategorias()`
- `getCategoriaById(id)`
- `createCategoria()`
- `updateCategoria(id)`
- `deleteCategoria(id)`
- `reordenarCategorias()`

#### Relaciones:

- **N a 1** con Restaurante (pertenece a un restaurante)
- **1 a N** con Producto (una categoría tiene muchos productos)

---

### 9. **Rol**

#### Atributos:

- `_id: ObjectId`
- `restauranteId: ObjectId` (ref: Restaurante)
- `key: String` (identificador único, ej: "mesero")
- `label: String` (nombre visible, ej: "Mesero")
- `icon: String` (emoji)
- `permisos: Array<String>`
- `orden: Number`
- `activo: Boolean`
- `predefinido: Boolean`
- `createdAt: Date`
- `updatedAt: Date`

#### Métodos (desde controladores):

- `getRoles()`
- `getRolById(id)`
- `createRol()`
- `updateRol(id)`
- `deleteRol(id)`
- `updatePermisos(id, permisos)`

#### Relaciones:

- **N a 1** con Restaurante (pertenece a un restaurante)
- **1 a N** con User (un rol puede ser asignado a muchos usuarios)

---

### 10. **Ubicacion**

#### Atributos:

- `_id: ObjectId`
- `restauranteId: ObjectId` (ref: Restaurante)
- `key: String` (identificador único)
- `label: String` (nombre visible)
- `icon: String` (emoji)
- `orden: Number`
- `activo: Boolean`
- `predefinida: Boolean`
- `createdAt: Date`
- `updatedAt: Date`

#### Métodos (desde controladores):

- `getUbicaciones()`
- `getUbicacionById(id)`
- `createUbicacion()`
- `updateUbicacion(id)`
- `deleteUbicacion(id)`

#### Relaciones:

- **N a 1** con Restaurante (pertenece a un restaurante)
- **1 a N** con Mesa (una ubicación tiene muchas mesas)

---

### 11. **Ocasion**

#### Atributos:

- `_id: ObjectId`
- `restauranteId: ObjectId` (ref: Restaurante)
- `key: String` (identificador único)
- `label: String` (nombre visible)
- `icon: String` (emoji)
- `orden: Number`
- `activo: Boolean`
- `predefinida: Boolean`
- `createdAt: Date`
- `updatedAt: Date`

#### Métodos (desde controladores):

- `getOcasiones()`
- `getOcasionById(id)`
- `createOcasion()`
- `updateOcasion(id)`
- `deleteOcasion(id)`

#### Relaciones:

- **N a 1** con Restaurante (pertenece a un restaurante)
- **1 a N** con Reserva (una ocasión puede estar en muchas reservas)

---

## 🔗 Resumen de Relaciones

### Relaciones Principales:

1. **Restaurante → User** (1:N)

   - Un restaurante tiene muchos empleados
   - Clave foránea: `User.restauranteId`

2. **Restaurante → Mesa** (1:N)

   - Un restaurante tiene muchas mesas
   - Clave foránea: `Mesa.restauranteId`

3. **Restaurante → Producto** (1:N)

   - Un restaurante tiene muchos productos
   - Clave foránea: `Producto.restauranteId`

4. **Restaurante → Pedido** (1:N)

   - Un restaurante tiene muchos pedidos
   - Clave foránea: `Pedido.restauranteId`

5. **Restaurante → Reserva** (1:N)

   - Un restaurante tiene muchas reservas
   - Clave foránea: `Reserva.restauranteId`

6. **Restaurante → Inventario** (1:N)

   - Un restaurante tiene muchos items de inventario
   - Clave foránea: `Inventario.restauranteId`

7. **Restaurante → Categoria** (1:N)

   - Un restaurante tiene muchas categorías
   - Clave foránea: `Categoria.restauranteId`

8. **Restaurante → Rol** (1:N)

   - Un restaurante tiene muchos roles
   - Clave foránea: `Rol.restauranteId`

9. **Restaurante → Ubicacion** (1:N)

   - Un restaurante tiene muchas ubicaciones
   - Clave foránea: `Ubicacion.restauranteId`

10. **Restaurante → Ocasion** (1:N)

    - Un restaurante tiene muchas ocasiones
    - Clave foránea: `Ocasion.restauranteId`

11. **User → Pedido** (1:N)

    - Un mesero crea muchos pedidos
    - Clave foránea: `Pedido.meseroId`

12. **Mesa → Pedido** (1:N)

    - Una mesa puede tener muchos pedidos
    - Clave foránea: `Pedido.mesaId`

13. **Mesa → Reserva** (1:N)

    - Una mesa puede tener muchas reservas
    - Clave foránea: `Reserva.mesaAsignada`

14. **Mesa → User** (N:1)

    - Una mesa puede estar asignada a un mesero
    - Clave foránea: `Mesa.meseroAsignado`

15. **Pedido → Producto** (N:N)

    - Un pedido tiene muchos productos (a través de items)
    - Relación embebida en `Pedido.items[]`

16. **Categoria → Producto** (1:N)

    - Una categoría tiene muchos productos
    - Clave foránea: `Producto.categoria` (key)

17. **Ubicacion → Mesa** (1:N)

    - Una ubicación tiene muchas mesas
    - Clave foránea: `Mesa.ubicacion` (key)

18. **Ocasion → Reserva** (1:N)

    - Una ocasión puede estar en muchas reservas
    - Clave foránea: `Reserva.ocasion` (key)

19. **Rol → User** (1:N)
    - Un rol puede ser asignado a muchos usuarios
    - Clave foránea: `User.rol` (key)

---

## 📊 Cardinalidades

| Relación                 | Tipo | Descripción                                     |
| ------------------------ | ---- | ----------------------------------------------- |
| Restaurante - User       | 1:N  | Un restaurante tiene muchos empleados           |
| Restaurante - Mesa       | 1:N  | Un restaurante tiene muchas mesas               |
| Restaurante - Producto   | 1:N  | Un restaurante tiene muchos productos           |
| Restaurante - Pedido     | 1:N  | Un restaurante tiene muchos pedidos             |
| Restaurante - Reserva    | 1:N  | Un restaurante tiene muchas reservas            |
| Restaurante - Inventario | 1:N  | Un restaurante tiene muchos items               |
| Restaurante - Categoria  | 1:N  | Un restaurante tiene muchas categorías          |
| Restaurante - Rol        | 1:N  | Un restaurante tiene muchos roles               |
| Restaurante - Ubicacion  | 1:N  | Un restaurante tiene muchas ubicaciones         |
| Restaurante - Ocasion    | 1:N  | Un restaurante tiene muchas ocasiones           |
| User - Pedido            | 1:N  | Un mesero crea muchos pedidos                   |
| Mesa - Pedido            | 1:N  | Una mesa tiene muchos pedidos                   |
| Mesa - Reserva           | 1:N  | Una mesa tiene muchas reservas                  |
| Mesa - User              | N:1  | Muchas mesas pueden estar asignadas a un mesero |
| Pedido - Producto        | N:N  | Muchos pedidos tienen muchos productos          |
| Categoria - Producto     | 1:N  | Una categoría tiene muchos productos            |
| Ubicacion - Mesa         | 1:N  | Una ubicación tiene muchas mesas                |
| Ocasion - Reserva        | 1:N  | Una ocasión está en muchas reservas             |
| Rol - User               | 1:N  | Un rol se asigna a muchos usuarios              |

---

## 🎯 Recomendaciones para el Diagrama UML

### Organización Visual:

1. **Clase Central**: Coloca `Restaurante` en el centro, ya que es la entidad principal del sistema multi-tenant
2. **Grupo de Gestión**: Agrupa `User`, `Rol` cerca del restaurante
3. **Grupo de Operaciones**: Agrupa `Mesa`, `Pedido`, `Producto`, `Reserva`
4. **Grupo de Configuración**: Agrupa `Categoria`, `Ubicacion`, `Ocasion`
5. **Grupo de Inventario**: Coloca `Inventario` separado

### Notación UML:

- **Atributos**: Usa `-` para privados, `+` para públicos
- **Métodos**: Usa `+` para públicos
- **Relaciones**:
  - Línea sólida con flecha para asociaciones
  - Rombo para composición (cuando una entidad no puede existir sin otra)
  - Números en los extremos para cardinalidad

### Métodos a Incluir:

Para cada clase, incluye:

1. **Métodos CRUD básicos** (get, create, update, delete)
2. **Métodos de instancia** específicos del modelo
3. **Métodos estáticos** si existen
4. **Métodos virtuales** importantes

### Colores Sugeridos (opcional):

- **Azul**: Entidades principales (Restaurante, User, Pedido)
- **Verde**: Entidades de configuración (Categoria, Rol, Ubicacion, Ocasion)
- **Naranja**: Entidades operativas (Mesa, Producto, Reserva)
- **Morado**: Entidades de gestión (Inventario)

---

## 📝 Notas Adicionales

### Patrón Multi-Tenant:

Todas las entidades (excepto Restaurante) tienen el campo `restauranteId` para implementar el patrón multi-tenant, donde cada restaurante tiene sus propios datos aislados.

### Soft Delete:

La mayoría de las entidades implementan "soft delete" mediante el campo `activo: Boolean`, lo que permite desactivar registros sin eliminarlos físicamente.

### Auditoría:

Muchas entidades tienen campos de auditoría:

- `creadoPor: ObjectId` (ref: User)
- `modificadoPor: ObjectId` (ref: User)
- `createdAt: Date`
- `updatedAt: Date`

### Validaciones:

Los modelos incluyen validaciones extensivas que podrían representarse como constraints en el diagrama UML.

---

## 🛠️ Herramientas Recomendadas

Para crear el diagrama UML, puedes usar:

1. **Draw.io / diagrams.net** - Gratuito, basado en web
2. **Lucidchart** - Profesional, con plantillas UML
3. **PlantUML** - Basado en texto, ideal para versionamiento
4. **StarUML** - Desktop, muy completo
5. **Visual Paradigm** - Profesional, con generación de código

---

**Fecha de creación**: 2025-11-19
**Versión del sistema**: Backend v1.0
**Total de clases**: 11
**Total de relaciones**: 19
