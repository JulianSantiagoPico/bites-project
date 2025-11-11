import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testConnection = async () => {
  try {
    console.log("🔄 Probando conexión a MongoDB...");
    console.log(`📍 URI: ${process.env.MONGODB_URI}`);

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("\n✅ Conexión exitosa!");
    console.log(`🏢 Host: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log(
      `⚡ Estado: ${
        conn.connection.readyState === 1 ? "Conectado" : "Desconectado"
      }`
    );

    // Listar colecciones existentes
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(`\n📁 Colecciones existentes (${collections.length}):`);
    collections.forEach((col) => console.log(`   - ${col.name}`));

    // Cerrar conexión
    await mongoose.connection.close();
    console.log("\n✅ Conexión cerrada correctamente\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error al conectar a MongoDB:");
    console.error(`   ${error.message}\n`);
    console.error("💡 Sugerencias:");
    console.error("   1. Verifica que MongoDB esté corriendo");
    console.error("   2. Verifica la URI en el archivo .env");
    console.error("   3. Verifica que el puerto 27017 esté disponible\n");
    process.exit(1);
  }
};

testConnection();
