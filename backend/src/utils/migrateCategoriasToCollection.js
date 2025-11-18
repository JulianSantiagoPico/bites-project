import mongoose from "mongoose";
import dotenv from "dotenv";
import Restaurante from "../models/Restaurante.js";
import Categoria from "../models/Categoria.js";

dotenv.config();

/**
 * Script para migrar customCategorias de Restaurante a la colección Categoria
 */
async function migrateCategoriasToCollection() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Categorías predefinidas por defecto
    const defaultCategorias = [
      {
        key: "entradas",
        label: "Entradas",
        icon: "🥗",
        orden: 1,
        predefinida: true,
      },
      {
        key: "platos_fuertes",
        label: "Platos Fuertes",
        icon: "🍽️",
        orden: 2,
        predefinida: true,
      },
      {
        key: "postres",
        label: "Postres",
        icon: "🍰",
        orden: 3,
        predefinida: true,
      },
      {
        key: "bebidas",
        label: "Bebidas",
        icon: "🍹",
        orden: 4,
        predefinida: true,
      },
      {
        key: "extras",
        label: "Extras",
        icon: "🍟",
        orden: 5,
        predefinida: true,
      },
    ];

    // Buscar todos los restaurantes
    const restaurantes = await Restaurante.find({});
    console.log(`\n📋 Se encontraron ${restaurantes.length} restaurantes\n`);

    let totalCategorias = 0;

    for (const restaurante of restaurantes) {
      console.log(`\n🏪 Procesando: ${restaurante.nombre}`);

      // Verificar si ya tiene categorías migradas
      const existentes = await Categoria.countDocuments({
        restauranteId: restaurante._id,
      });
      if (existentes > 0) {
        console.log(`  ⚠️  Ya tiene ${existentes} categorías en la colección`);
        continue;
      }

      let categoriasToInsert = [];
      let siguienteOrden = 6; // Después de las predefinidas

      // Si tiene customCategorias, migrarlas
      if (
        restaurante.customCategorias &&
        typeof restaurante.customCategorias === "object"
      ) {
        const customKeys = Object.keys(restaurante.customCategorias);

        if (customKeys.length > 0) {
          console.log(
            `  📦 Migrando ${customKeys.length} categorías personalizadas...`
          );

          for (const key of customKeys) {
            // Verificar si no es una propiedad de Mongoose
            if (key.startsWith("$") || key.startsWith("_")) {
              continue;
            }

            const label = restaurante.customCategorias[key];
            const icon = restaurante.categoriasIcons?.[key] || "📦";

            // Verificar si es una categoría predefinida
            const esPredefinida = defaultCategorias.some(
              (def) => def.key === key
            );

            if (esPredefinida) {
              // Usar los datos de la categoría predefinida pero con el icono guardado
              const catPredefinida = defaultCategorias.find(
                (def) => def.key === key
              );
              categoriasToInsert.push({
                restauranteId: restaurante._id,
                key: catPredefinida.key,
                label: catPredefinida.label,
                icon: icon,
                orden: catPredefinida.orden,
                predefinida: true,
                activo: true,
              });
            } else {
              // Categoría personalizada
              categoriasToInsert.push({
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
          // No tiene categorías personalizadas, usar las predefinidas
          console.log(`  📋 Usando categorías predefinidas...`);
          categoriasToInsert = defaultCategorias.map((cat) => ({
            restauranteId: restaurante._id,
            ...cat,
            activo: true,
          }));
        }
      } else {
        // No tiene customCategorias, usar las predefinidas
        console.log(`  📋 Usando categorías predefinidas...`);
        categoriasToInsert = defaultCategorias.map((cat) => ({
          restauranteId: restaurante._id,
          ...cat,
          activo: true,
        }));
      }

      // Insertar las categorías
      if (categoriasToInsert.length > 0) {
        await Categoria.insertMany(categoriasToInsert);
        console.log(`  ✅ Insertadas ${categoriasToInsert.length} categorías`);
        totalCategorias += categoriasToInsert.length;
      }
    }

    console.log("\n📊 Resumen:");
    console.log(`  - Total de categorías migradas: ${totalCategorias}`);
    console.log("\n✅ Migración completada exitosamente");

    console.log("\n💡 Próximos pasos:");
    console.log(
      "  1. Verificar que las categorías se muestran correctamente en el frontend"
    );
    console.log("  2. Probar crear/editar/eliminar categorías");
    console.log(
      "  3. Si todo funciona, puedes eliminar los campos customCategorias y categoriasIcons del modelo Restaurante"
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
migrateCategoriasToCollection()
  .then(() => {
    console.log("\n🎉 Script completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Error fatal:", error);
    process.exit(1);
  });
