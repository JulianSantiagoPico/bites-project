import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Ubicacion from "../models/Ubicacion.js";
import Restaurante from "../models/Restaurante.js";

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde el directorio raíz del backend
dotenv.config({ path: join(__dirname, "../../.env") });

async function cleanUbicaciones() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Eliminar todas las ubicaciones con keys inválidas (que empiezan con $ o contienen propiedades de Mongoose)
    const invalidKeys = [
      "si",
      "$__parent",
      "$__path",
      "$__pathRelativeToParent",
      "$__schemaType",
      "customUbicaciones",
    ];

    const result = await Ubicacion.deleteMany({
      key: { $in: invalidKeys },
    });

    console.log(`🗑️  Eliminadas ${result.deletedCount} ubicaciones corruptas`);

    // Obtener todos los restaurantes
    const restaurantes = await Restaurante.find({});
    console.log(`📋 Encontrados ${restaurantes.length} restaurantes`);

    // Crear ubicaciones predeterminadas para cada restaurante que no las tenga
    for (const restaurante of restaurantes) {
      const ubicacionesExistentes = await Ubicacion.countDocuments({
        restauranteId: restaurante._id,
      });

      if (ubicacionesExistentes === 0) {
        const defaultUbicaciones = [
          {
            restauranteId: restaurante._id,
            key: "interior",
            label: "Interior",
            icon: "🏠",
            orden: 1,
            activo: true,
            predefinida: true,
          },
          {
            restauranteId: restaurante._id,
            key: "exterior",
            label: "Exterior",
            icon: "🌳",
            orden: 2,
            activo: true,
            predefinida: true,
          },
          {
            restauranteId: restaurante._id,
            key: "terraza",
            label: "Terraza",
            icon: "☀️",
            orden: 3,
            activo: true,
            predefinida: true,
          },
          {
            restauranteId: restaurante._id,
            key: "barra",
            label: "Barra",
            icon: "🍺",
            orden: 4,
            activo: true,
            predefinida: true,
          },
          {
            restauranteId: restaurante._id,
            key: "privado",
            label: "Privado",
            icon: "🔒",
            orden: 5,
            activo: true,
            predefinida: true,
          },
        ];

        await Ubicacion.insertMany(defaultUbicaciones);
        console.log(
          `✅ Creadas ubicaciones predeterminadas para restaurante ${restaurante.nombre}`
        );
      } else {
        console.log(
          `⏭️  Restaurante ${restaurante.nombre} ya tiene ${ubicacionesExistentes} ubicaciones válidas`
        );
      }
    }

    console.log("✅ Limpieza completada exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en limpieza:", error);
    process.exit(1);
  }
}

cleanUbicaciones();
