import mongoose from "mongoose";
import Restaurante from "../models/Restaurante.js";
import Ubicacion from "../models/Ubicacion.js";
import dotenv from "dotenv";

dotenv.config();

const migrateUbicacionesToCollection = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDB");

    // Obtener todos los restaurantes
    const restaurantes = await Restaurante.find({});
    console.log(`\nEncontrados ${restaurantes.length} restaurantes`);

    let totalUbicacionesMigradas = 0;

    for (const restaurante of restaurantes) {
      console.log(`\n--- Procesando restaurante: ${restaurante.nombre} ---`);

      // Verificar si ya tiene ubicaciones en la colección
      const ubicacionesExistentes = await Ubicacion.countDocuments({
        restauranteId: restaurante._id,
      });

      if (ubicacionesExistentes > 0) {
        console.log(
          `  ✓ Ya tiene ${ubicacionesExistentes} ubicaciones en la colección`
        );
        continue;
      }

      // Ubicaciones predeterminadas
      const defaultUbicaciones = {
        interior: { label: "Interior", icon: "🏠" },
        exterior: { label: "Exterior", icon: "🌳" },
        terraza: { label: "Terraza", icon: "☀️" },
        barra: { label: "Barra", icon: "🍺" },
        privado: { label: "Privado", icon: "🔒" },
      };

      // Obtener ubicaciones personalizadas o usar predeterminadas
      const customUbicaciones = restaurante.customUbicaciones || {};
      const ubicacionesIconsMap = restaurante.ubicacionesIcons || {};

      // Convertir Map a objeto plano si es necesario
      const ubicacionesIcons =
        ubicacionesIconsMap instanceof Map
          ? Object.fromEntries(ubicacionesIconsMap)
          : ubicacionesIconsMap;

      // Determinar qué ubicaciones usar
      const ubicacionesAMigrar =
        Object.keys(customUbicaciones).length > 0
          ? customUbicaciones
          : defaultUbicaciones;

      let orden = 0;
      const ubicacionesParaInsertar = [];

      for (const [key, value] of Object.entries(ubicacionesAMigrar)) {
        orden++;

        // Determinar label e icon
        let label, icon;

        if (typeof value === "string") {
          // Si value es string, es el label
          label = value;
          icon = ubicacionesIcons[key] || defaultUbicaciones[key]?.icon || "📍";
        } else if (typeof value === "object" && value !== null) {
          // Si value es objeto, puede tener label e icon
          label = value.label || key;
          icon =
            value.icon ||
            ubicacionesIcons[key] ||
            defaultUbicaciones[key]?.icon ||
            "📍";
        } else {
          // Valor inválido, usar key como label
          label = key;
          icon = defaultUbicaciones[key]?.icon || "📍";
        }

        ubicacionesParaInsertar.push({
          restauranteId: restaurante._id,
          key,
          label,
          icon,
          orden,
          activo: true,
          predefinida: Object.keys(defaultUbicaciones).includes(key),
        });
      }

      if (ubicacionesParaInsertar.length > 0) {
        await Ubicacion.insertMany(ubicacionesParaInsertar);
        console.log(
          `  ✓ Migradas ${ubicacionesParaInsertar.length} ubicaciones`
        );
        totalUbicacionesMigradas += ubicacionesParaInsertar.length;
      }
    }

    console.log(
      `\n✅ Migración completada. Total de ubicaciones migradas: ${totalUbicacionesMigradas}`
    );

    await mongoose.connection.close();
    console.log("\nConexión cerrada");
  } catch (error) {
    console.error("\n❌ Error en la migración:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Ejecutar la migración
migrateUbicacionesToCollection();
