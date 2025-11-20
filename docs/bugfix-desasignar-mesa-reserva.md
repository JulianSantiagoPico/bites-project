# Bug Fix: Desasignación de Mesa en Reservas

## Problema Identificado

Al intentar desasignar la mesa de una reserva desde el modal de detalles o el modal de edición, aunque el toast mostraba "estado actualizado", la mesa seguía asignada a la reserva.

## Causa Raíz

El bug estaba en el backend, específicamente en el controlador `reserva.controller.js`, función `asignarMesa` (línea 508).

### Código Problemático

```javascript
// Si se está desasignando la mesa
if (!mesaId) {
  reserva.mesaAsignada = null;
  // ...
}
```

### Problema

La condición `if (!mesaId)` solo detectaba cuando `mesaId` era `null` o `undefined`, pero **no detectaba cuando era una cadena vacía `""`**.

Cuando el frontend enviaba una cadena vacía (que es lo que ocurre cuando se selecciona "Sin mesa asignada" en el modal), el backend no entraba en el bloque de desasignación y continuaba con la validación de mesa, causando que la operación fallara silenciosamente o no actualizara correctamente.

## Solución Implementada

Se modificó la condición para detectar tanto `null`/`undefined` como cadenas vacías:

```javascript
// Si se está desasignando la mesa (mesaId puede ser null, undefined o cadena vacía)
if (!mesaId || mesaId === "") {
  reserva.mesaAsignada = null;
  reserva.modificadoPor = req.user._id;
  await reserva.save();
  // ...
}
```

## Archivos Modificados

1. **backend/src/controllers/reserva.controller.js** (línea 508)

   - Actualizada la condición para manejar cadenas vacías

2. **backend/api-tests-reservas.http** (línea 219)
   - Agregado test case para desasignación con cadena vacía

## Verificación

El fix permite que la desasignación de mesa funcione correctamente en los siguientes escenarios:

1. ✅ Desde el modal de detalles de reserva (botón "Cambiar" → seleccionar "Sin mesa asignada")
2. ✅ Desde el modal de edición de reserva (dropdown de mesa → seleccionar "Sin asignar")
3. ✅ Mediante la API con `mesaId: null`
4. ✅ Mediante la API con `mesaId: ""`

## Notas Adicionales

- La función `updateReserva` ya manejaba correctamente este caso en la línea 323 con `mesaAsignada || null`
- No se requirieron cambios en el frontend, ya que estaba enviando correctamente los datos
- El problema era exclusivamente de validación en el backend
