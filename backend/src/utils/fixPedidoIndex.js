import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * Script para eliminar el índice único global de numeroPedido
 * y permitir que el índice compuesto (restauranteId + numeroPedido) sea el único
 */
async function fixPedidoIndex() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("pedidos");

    // Obtener todos los índices actuales
    let indexes = await collection.indexes();
    console.log("\n📋 Índices actuales:");
    indexes.forEach((index) => {
      console.log(
        `  - ${index.name}:`,
        index.key,
        index.unique ? "(único)" : ""
      );
    });

    // Buscar el índice único de numeroPedido
    const numeroPedidoIndex = indexes.find(
      (index) =>
        index.key.numeroPedido === 1 &&
        !index.key.restauranteId &&
        index.unique === true
    );

    if (numeroPedidoIndex) {
      console.log(
        `\n🗑️  Eliminando índice único global: ${numeroPedidoIndex.name}`
      );
      await collection.dropIndex(numeroPedidoIndex.name);
      console.log("✅ Índice eliminado exitosamente");
    } else {
      console.log(
        "\nℹ️  No se encontró el índice único global de numeroPedido"
      );
    }

    // Verificar si existe el índice compuesto
    const compositeIndex = indexes.find(
      (index) => index.key.restauranteId === 1 && index.key.numeroPedido === 1
    );

    if (compositeIndex && !compositeIndex.unique) {
      console.log(
        `\n🗑️  Eliminando índice compuesto no único: ${compositeIndex.name}`
      );
      await collection.dropIndex(compositeIndex.name);
      console.log("✅ Índice no único eliminado");

      // Verificar si hay duplicados antes de crear el índice único
      console.log(
        "\n🔍 Verificando duplicados en (restauranteId + numeroPedido)..."
      );
      const duplicates = await collection
        .aggregate([
          {
            $group: {
              _id: {
                restauranteId: "$restauranteId",
                numeroPedido: "$numeroPedido",
              },
              count: { $sum: 1 },
              ids: { $push: "$_id" },
            },
          },
          {
            $match: { count: { $gt: 1 } },
          },
        ])
        .toArray();

      if (duplicates.length > 0) {
        console.log(`⚠️  Se encontraron ${duplicates.length} duplicados:`);
        duplicates.forEach((dup, index) => {
          console.log(
            `  ${index + 1}. Restaurante: ${dup._id.restauranteId}, Número: ${
              dup._id.numeroPedido
            }, Cantidad: ${dup.count}`
          );
        });

        console.log(
          "\n🧹 Limpiando duplicados (manteniendo solo el más reciente)..."
        );
        for (const dup of duplicates) {
          // Obtener todos los documentos duplicados
          const docs = await collection
            .find({
              restauranteId: dup._id.restauranteId,
              numeroPedido: dup._id.numeroPedido,
            })
            .sort({ createdAt: -1 })
            .toArray();

          // Eliminar todos excepto el primero (más reciente)
          const idsToDelete = docs.slice(1).map((doc) => doc._id);
          if (idsToDelete.length > 0) {
            await collection.deleteMany({ _id: { $in: idsToDelete } });
            console.log(
              `  ✓ Eliminados ${idsToDelete.length} duplicados de ${dup._id.numeroPedido}`
            );
          }
        }
        console.log("✅ Duplicados limpiados");
      } else {
        console.log("✅ No se encontraron duplicados");
      }

      console.log(
        "\n➕ Creando índice compuesto único (restauranteId + numeroPedido)"
      );
      await collection.createIndex(
        { restauranteId: 1, numeroPedido: 1 },
        { unique: true }
      );
      console.log("✅ Índice compuesto único creado exitosamente");
    } else if (!compositeIndex) {
      // No existe el índice compuesto, verificar duplicados y crearlo
      console.log(
        "\n🔍 Verificando duplicados en (restauranteId + numeroPedido)..."
      );
      const duplicates = await collection
        .aggregate([
          {
            $group: {
              _id: {
                restauranteId: "$restauranteId",
                numeroPedido: "$numeroPedido",
              },
              count: { $sum: 1 },
              ids: { $push: "$_id" },
            },
          },
          {
            $match: { count: { $gt: 1 } },
          },
        ])
        .toArray();

      if (duplicates.length > 0) {
        console.log(`⚠️  Se encontraron ${duplicates.length} duplicados:`);
        duplicates.forEach((dup, index) => {
          console.log(
            `  ${index + 1}. Restaurante: ${dup._id.restauranteId}, Número: ${
              dup._id.numeroPedido
            }, Cantidad: ${dup.count}`
          );
        });

        console.log(
          "\n🧹 Limpiando duplicados (manteniendo solo el más reciente)..."
        );
        for (const dup of duplicates) {
          const docs = await collection
            .find({
              restauranteId: dup._id.restauranteId,
              numeroPedido: dup._id.numeroPedido,
            })
            .sort({ createdAt: -1 })
            .toArray();

          const idsToDelete = docs.slice(1).map((doc) => doc._id);
          if (idsToDelete.length > 0) {
            await collection.deleteMany({ _id: { $in: idsToDelete } });
            console.log(
              `  ✓ Eliminados ${idsToDelete.length} duplicados de ${dup._id.numeroPedido}`
            );
          }
        }
        console.log("✅ Duplicados limpiados");
      } else {
        console.log("✅ No se encontraron duplicados");
      }

      console.log(
        "\n➕ Creando índice compuesto único (restauranteId + numeroPedido)"
      );
      await collection.createIndex(
        { restauranteId: 1, numeroPedido: 1 },
        { unique: true }
      );
      console.log("✅ Índice compuesto único creado exitosamente");
    } else if (compositeIndex.unique) {
      console.log("\n✅ El índice compuesto único ya existe");
    }

    // Mostrar índices finales
    const finalIndexes = await collection.indexes();
    console.log("\n📋 Índices finales:");
    finalIndexes.forEach((index) => {
      console.log(
        `  - ${index.name}:`,
        index.key,
        index.unique ? "(único)" : ""
      );
    });

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
fixPedidoIndex()
  .then(() => {
    console.log("\n🎉 Script completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Error fatal:", error);
    process.exit(1);
  });
