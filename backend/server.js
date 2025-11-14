import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./src/config/database.js";
import errorHandler from "./src/middlewares/errorHandler.js";

// Importar rutas
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import restauranteRoutes from "./src/routes/restaurante.routes.js";
import inventarioRoutes from "./src/routes/inventario.routes.js";
import mesaRoutes from "./src/routes/mesa.routes.js";
import reservaRoutes from "./src/routes/reserva.routes.js";

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(helmet()); // Seguridad HTTP headers
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev")); // Logger de peticiones HTTP
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Bites ERP API - Sistema de gestión para restaurantes",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      restaurante: "/api/restaurante",
      inventario: "/api/inventario",
      mesas: "/api/mesas",
      reservas: "/api/reservas",
    },
  });
});

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurante", restauranteRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/mesas", mesaRoutes);
app.use("/api/reservas", reservaRoutes);

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado",
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 URL: http://localhost:${PORT}\n`);
});

// Manejo de errores no capturados
process.on("unhandledRejection", (err) => {
  console.error("❌ Error no manejado:", err.message);
  process.exit(1);
});
