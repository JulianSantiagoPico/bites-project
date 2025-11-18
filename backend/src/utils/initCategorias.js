import mongoose from "mongoose";
import dotenv from "dotenv";
import Restaurante from "../models/Restaurante.js";

dotenv.config();

/**
 * Script para inicializar categorías predefinidas en restaurantes existentes
 */
async function initCategorias() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Categorías predefinidas
    const defaultCategorias = {
      entradas: "Entradas",
      platos_fuertes: "Platos Fuertes",
      postres: "Postres",
      bebidas: "Bebidas",
      extras: "Extras",
    };

    const defaultIcons = {
      entradas: "🥗",
      platos_fuertes: "🍽️",
      postres: "🍰",
      bebidas: "🍹",
      extras: "🍟",
    };

    // Buscar todos los restaurantes
    const restaurantes = await Restaurante.find({});
    console.log(`\n📋 Se encontraron ${restaurantes.length} restaurantes`);

    let actualizados = 0;
    let yaConfigurados = 0;

    for (const restaurante of restaurantes) {
      // Verificar si ya tiene categorías configuradas
      if (
        restaurante.customCategorias &&
        Object.keys(restaurante.customCategorias).length > 0
      ) {
        console.log(`✓ ${restaurante.nombre} ya tiene categorías configuradas`);
        yaConfigurados++;
        continue;
      }

      // Inicializar categorías predefinidas
      restaurante.customCategorias = defaultCategorias;
      restaurante.categoriasIcons = defaultIcons;

      restaurante.markModified("customCategorias");
      restaurante.markModified("categoriasIcons");

      await restaurante.save();

      console.log(`✅ ${restaurante.nombre} - Categorías inicializadas`);
      actualizados++;
    }

    console.log("\n📊 Resumen:");
    console.log(`  - Restaurantes actualizados: ${actualizados}`);
    console.log(`  - Ya configurados: ${yaConfigurados}`);
    console.log(`  - Total: ${restaurantes.length}`);

    console.log("\n✅ Migración completada exitosamente");
  } catch (error) {
    console.error("\n❌ Error durante la migración:", error.message);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Desconectado de MongoDB");
  }
}

// Ejecutar la migración
initCategorias()
  .then(() => {
    console.log("\n🎉 Script completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Error fatal:", error);
    process.exit(1);
  });
