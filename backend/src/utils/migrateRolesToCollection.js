import mongoose from "mongoose";
import dotenv from "dotenv";
import Restaurante from "../models/Restaurante.js";
import Rol from "../models/Rol.js";
import { ROLE_PERMISSIONS } from "../config/roles.js";

dotenv.config();

/**
 * Script para migrar customRoles de Restaurante a la colección Rol
 */
async function migrateRolesToCollection() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Roles predefinidos por defecto
    const defaultRoles = [
      {
        key: "mesero",
        label: "Mesero",
        icon: "🍽️",
        permisos: ROLE_PERMISSIONS.mesero || [],
        orden: 1,
        predefinido: true,
      },
      {
        key: "cocinero",
        label: "Cocinero",
        icon: "👨‍🍳",
        permisos: ROLE_PERMISSIONS.cocinero || [],
        orden: 2,
        predefinido: true,
      },
      {
        key: "cajero",
        label: "Cajero",
        icon: "💰",
        permisos: ROLE_PERMISSIONS.cajero || [],
        orden: 3,
        predefinido: true,
      },
      {
        key: "gerente",
        label: "Gerente",
        icon: "👔",
        permisos: ROLE_PERMISSIONS.gerente || [],
        orden: 4,
        predefinido: true,
      },
    ];

    // Buscar todos los restaurantes
    const restaurantes = await Restaurante.find({});
    console.log(`\n📋 Se encontraron ${restaurantes.length} restaurantes\n`);

    let totalRoles = 0;

    for (const restaurante of restaurantes) {
      console.log(`\n🏪 Procesando: ${restaurante.nombre}`);

      // Verificar si ya tiene roles migrados
      const existentes = await Rol.countDocuments({
        restauranteId: restaurante._id,
      });
      if (existentes > 0) {
        console.log(`  ⚠️  Ya tiene ${existentes} roles en la colección`);
        continue;
      }

      let rolesToInsert = [];
      let siguienteOrden = 5; // Después de los predefinidos

      // Si tiene customRoles, migrarlos
      if (
        restaurante.customRoles &&
        typeof restaurante.customRoles === "object"
      ) {
        const customKeys = Object.keys(restaurante.customRoles);

        if (customKeys.length > 0) {
          console.log(
            `  📦 Migrando ${customKeys.length} roles personalizados...`
          );

          for (const key of customKeys) {
            // Verificar si no es una propiedad de Mongoose
            if (key.startsWith("$") || key.startsWith("_")) {
              continue;
            }

            const label = restaurante.customRoles[key];
            const icon = restaurante.rolesIcons?.[key] || "👤";

            // Obtener permisos si existen
            let permisos = [];
            if (restaurante.customRolePermissions) {
              permisos = restaurante.customRolePermissions.get(key) || [];
            }

            // Si no tiene permisos personalizados, usar los predeterminados
            if (permisos.length === 0 && ROLE_PERMISSIONS[key]) {
              permisos = ROLE_PERMISSIONS[key];
            }

            // Verificar si es un rol predefinido
            const esPredefinido = defaultRoles.some((def) => def.key === key);

            if (esPredefinido) {
              // Usar los datos del rol predefinido pero con el icono guardado
              const rolPredefinido = defaultRoles.find(
                (def) => def.key === key
              );
              rolesToInsert.push({
                restauranteId: restaurante._id,
                key: rolPredefinido.key,
                label: rolPredefinido.label,
                icon: icon,
                permisos:
                  permisos.length > 0 ? permisos : rolPredefinido.permisos,
                orden: rolPredefinido.orden,
                predefinido: true,
                activo: true,
              });
            } else {
              // Rol personalizado
              rolesToInsert.push({
                restauranteId: restaurante._id,
                key: key,
                label: label,
                icon: icon,
                permisos: permisos,
                orden: siguienteOrden++,
                predefinido: false,
                activo: true,
              });
            }
          }
        } else {
          // No tiene roles personalizados, usar los predefinidos
          console.log(`  📋 Usando roles predefinidos...`);
          rolesToInsert = defaultRoles.map((rol) => ({
            restauranteId: restaurante._id,
            ...rol,
            activo: true,
          }));
        }
      } else {
        // No tiene customRoles, usar los predefinidos
        console.log(`  📋 Usando roles predefinidos...`);
        rolesToInsert = defaultRoles.map((rol) => ({
          restauranteId: restaurante._id,
          ...rol,
          activo: true,
        }));
      }

      // Insertar los roles
      if (rolesToInsert.length > 0) {
        await Rol.insertMany(rolesToInsert);
        console.log(`  ✅ Insertados ${rolesToInsert.length} roles`);
        totalRoles += rolesToInsert.length;
      }
    }

    console.log("\n📊 Resumen:");
    console.log(`  - Total de roles migrados: ${totalRoles}`);
    console.log("\n✅ Migración completada exitosamente");

    console.log("\n💡 Próximos pasos:");
    console.log(
      "  1. Verificar que los roles se muestran correctamente en el frontend"
    );
    console.log("  2. Probar crear/editar/eliminar roles");
    console.log(
      "  3. Verificar que los permisos de cada rol funcionan correctamente"
    );
    console.log(
      "  4. Si todo funciona, puedes eliminar los campos customRoles, rolesIcons y customRolePermissions del modelo Restaurante"
    );
  } catch (error) {
    console.error("\n❌ Error durante la migración:", error.message);
    console.error(error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Desconectado de MongoDB");
  }
}

// Ejecutar la migración
migrateRolesToCollection()
  .then(() => {
    console.log("\n🎉 Script completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Error fatal:", error);
    process.exit(1);
  });
