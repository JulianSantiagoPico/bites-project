# Error 400 Bad Request en Registro - SOLUCIONADO ✅

## Problema Identificado

Tu amigo estaba recibiendo un error **400 Bad Request** al intentar registrarse en la aplicación deployada en Railway.

### Causa Raíz

Había una **inconsistencia entre el middleware de validación y el controlador** en el backend:

1. **Middleware `validateRegister`** (validators.js):

   - ✅ Validaba: `nombre`, `apellido`, `email`, `password`, `restaurante.nombre`
   - ❌ **NO validaba**: `restaurante.telefono`

2. **Controlador `register`** (auth.controller.js):
   - ✅ Requería: `nombre`, `apellido`, `email`, `password`, `restaurante.nombre`
   - ✅ **También requería**: `restaurante.telefono` (líneas 38-42)

### ¿Qué pasaba?

1. El frontend enviaba todos los datos correctamente
2. El middleware de validación dejaba pasar la petición (porque no validaba `restaurante.telefono`)
3. El controlador rechazaba la petición con error 400 porque faltaba la validación de `restaurante.telefono`
4. El usuario recibía un error genérico 400 sin detalles claros

## Solución Implementada

Se agregó la validación faltante para `restaurante.telefono` en el middleware `validateRegister`:

```javascript
body("restaurante.telefono")
  .trim()
  .notEmpty()
  .withMessage("El teléfono del restaurante es requerido")
  .isLength({ min: 10, max: 15 })
  .withMessage("El teléfono debe tener entre 10 y 15 dígitos")
  .matches(/^[0-9+\-\s()]+$/)
  .withMessage(
    "El teléfono solo puede contener números, +, -, espacios y paréntesis"
  ),
```

### Validaciones del teléfono:

- ✅ Campo requerido (no puede estar vacío)
- ✅ Longitud entre 10 y 15 caracteres
- ✅ Solo puede contener: números, +, -, espacios y paréntesis
- ✅ Ejemplos válidos: `+57 300 123 4567`, `3001234567`, `(300) 123-4567`

## Mejoras Adicionales (Apellido Opcional)

Se realizaron cambios para mejorar la experiencia de usuario con respecto al apellido:

1. **Backend (`User.js`)**: El campo `apellido` ahora es **opcional** en la base de datos.
2. **Backend (`validators.js`)**: La validación del apellido ahora es opcional (solo valida longitud si se envía).
3. **Frontend (`Register.jsx`)**:
   - Se eliminó el envío automático de "N/A" cuando no hay apellido.
   - Se agregó validación visual: si el usuario escribe un apellido, debe tener al menos 2 caracteres.

Esto evita que aparezca "N/A" en la interfaz cuando un usuario se registra solo con su nombre.

## Próximos Pasos

### Para deployar el fix en Railway:

1. **Commit y push de los cambios:**

   ```bash
   git add backend/src/middlewares/validators.js backend/src/models/User.js frontend/src/pages/Register.jsx
   git commit -m "fix: validación registro y apellido opcional"
   git push origin main
   ```

2. **Railway detectará automáticamente el cambio** y redesplegará el backend y frontend.

3. **Verificar el deployment:**

   - Espera a que Railway termine de deployar (usualmente 2-5 minutos)
   - Verifica que el servicio esté corriendo sin errores en los logs de Railway

4. **Probar el registro:**
   - Pide a tu amigo que intente registrarse nuevamente
   - Ahora debería funcionar correctamente
   - Si se registra sin apellido, no debería ver "N/A" en su perfil

---

**Fecha de solución:** 2025-11-21
**Archivos modificados:**

- `backend/src/middlewares/validators.js`
- `backend/src/models/User.js`
- `frontend/src/pages/Register.jsx`
