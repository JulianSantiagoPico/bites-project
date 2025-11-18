import mongoose from "mongoose";
import dotenv from "dotenv";
import Restaurante from "../models/Restaurante.js";
import Ocasion from "../models/Ocasion.js";

dotenv.config();

/**
 * Script para migrar customOcasiones de Restaurante a la colección Ocasion
 */
async function migrateOcasionesToCollection() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Ocasiones predefinidas por defecto
    const defaultOcasiones = [
      {
        key: "cumpleaños",
        label: "Cumpleaños",
        icon: "🎂",
        orden: 1,
        predefinida: true,
      },
      {
        key: "aniversario",
        label: "Aniversario",
        icon: "💐",
        orden: 2,
        predefinida: true,
      },
      { key: "cita", label: "Cita", icon: "💑", orden: 3, predefinida: true },
      {
        key: "negocio",
        label: "Negocio",
        icon: "💼",
        orden: 4,
        predefinida: true,
      },
    ];

    // Buscar todos los restaurantes
    const restaurantes = await Restaurante.find({});
    console.log(`\n📋 Se encontraron ${restaurantes.length} restaurantes\n`);

    let totalOcasiones = 0;

    for (const restaurante of restaurantes) {
      console.log(`\n🏪 Procesando: ${restaurante.nombre}`);

      // Verificar si ya tiene ocasiones migradas
      const existentes = await Ocasion.countDocuments({
        restauranteId: restaurante._id,
      });
      if (existentes > 0) {
        console.log(`  ⚠️  Ya tiene ${existentes} ocasiones en la colección`);
        continue;
      }

      let ocasionesToInsert = [];
      let siguienteOrden = 5; // Después de las predefinidas

      // Si tiene customOcasiones, migrarlas
      if (
        restaurante.customOcasiones &&
        typeof restaurante.customOcasiones === "object"
      ) {
        const customKeys = Object.keys(restaurante.customOcasiones);

        if (customKeys.length > 0) {
          console.log(
            `  📦 Migrando ${customKeys.length} ocasiones personalizadas...`
          );

          for (const key of customKeys) {
            // Verificar si no es una propiedad de Mongoose
            if (key.startsWith("$") || key.startsWith("_")) {
              continue;
            }

            const label = restaurante.customOcasiones[key];
            const icon = restaurante.ocasionesIcons?.[key] || "🎉";

            // Verificar si es una ocasión predefinida
            const esPredefinida = defaultOcasiones.some(
              (def) => def.key === key
            );

            if (esPredefinida) {
              // Usar los datos de la ocasión predefinida pero con el icono guardado
              const ocPredefinida = defaultOcasiones.find(
                (def) => def.key === key
              );
              ocasionesToInsert.push({
                restauranteId: restaurante._id,
                key: ocPredefinida.key,
                label: ocPredefinida.label,
                icon: icon,
                orden: ocPredefinida.orden,
                predefinida: true,
                activo: true,
              });
            } else {
              // Ocasión personalizada
              ocasionesToInsert.push({
                restauranteId: restaurante._id,
                key: key,
                label: label,
                icon: icon,
                orden: siguienteOrden++,
                predefinida: false,
                activo: true,
              });
            }
          }
        } else {
          // No tiene ocasiones personalizadas, usar las predefinidas
          console.log(`  📋 Usando ocasiones predefinidas...`);
          ocasionesToInsert = defaultOcasiones.map((oc) => ({
            restauranteId: restaurante._id,
            ...oc,
            activo: true,
          }));
        }
      } else {
        // No tiene customOcasiones, usar las predefinidas
        console.log(`  📋 Usando ocasiones predefinidas...`);
        ocasionesToInsert = defaultOcasiones.map((oc) => ({
          restauranteId: restaurante._id,
          ...oc,
          activo: true,
        }));
      }

      // Insertar las ocasiones
      if (ocasionesToInsert.length > 0) {
        await Ocasion.insertMany(ocasionesToInsert);
        console.log(`  ✅ Insertadas ${ocasionesToInsert.length} ocasiones`);
        totalOcasiones += ocasionesToInsert.length;
      }
    }

    console.log("\n📊 Resumen:");
    console.log(`  - Total de ocasiones migradas: ${totalOcasiones}`);
    console.log("\n✅ Migración completada exitosamente");

    console.log("\n💡 Próximos pasos:");
    console.log(
      "  1. Verificar que las ocasiones se muestran correctamente en el frontend"
    );
    console.log("  2. Probar crear/editar/eliminar ocasiones");
    console.log(
      "  3. Si todo funciona, puedes eliminar los campos customOcasiones y ocasionesIcons del modelo Restaurante"
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
migrateOcasionesToCollection()
  .then(() => {
    console.log("\n🎉 Script completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Error fatal:", error);
    process.exit(1);
  });
