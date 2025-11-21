import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
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
import productoRoutes from "./src/routes/producto.routes.js";
import pedidoRoutes from "./src/routes/pedido.routes.js";
import cocinaRoutes from "./src/routes/cocina.routes.js";
import rolesRoutes from "./src/routes/roles.routes.js";
import ocasionesRoutes from "./src/routes/ocasiones.routes.js";
import ubicacionesRoutes from "./src/routes/ubicaciones.routes.js";
import categoriasRoutes from "./src/routes/categorias.routes.js";
import estadisticasRoutes from "./src/routes/estadisticas.routes.js";

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Crear servidor HTTP
const httpServer = createServer(app);

// Configurar Socket.IO
// Soportar múltiples orígenes (desarrollo y producción)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173"];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
  // Configuración para Railway y producción
  transports: ["websocket", "polling"],
  allowUpgrades: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Hacer io accesible globalmente en la aplicación
app.set("io", io);

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(helmet()); // Seguridad HTTP headers
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
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
      productos: "/api/productos",
      pedidos: "/api/pedidos",
      cocina: "/api/cocina",
      roles: "/api/roles",
      ocasiones: "/api/ocasiones",
      ubicaciones: "/api/ubicaciones",
      categorias: "/api/categorias",
      estadisticas: "/api/estadisticas",
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
app.use("/api/productos", productoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/cocina", cocinaRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/ocasiones", ocasionesRoutes);
app.use("/api/ubicaciones", ubicacionesRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/estadisticas", estadisticasRoutes);

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado",
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Configurar Socket.IO
io.on("connection", (socket) => {
  console.log(
    `✅ Cliente conectado: ${socket.id} desde ${socket.handshake.address}`
  );

  // Unirse a una sala por restaurante
  socket.on("join:restaurante", (restauranteId) => {
    socket.join(`restaurante:${restauranteId}`);
    console.log(`📡 Socket ${socket.id} unido a restaurante:${restauranteId}`);
    // Confirmar unión
    socket.emit("joined:restaurante", { restauranteId, socketId: socket.id });
  });

  // Unirse a sala de cocina
  socket.on("join:cocina", (restauranteId) => {
    socket.join(`cocina:${restauranteId}`);
    console.log(`👨‍🍳 Socket ${socket.id} unido a cocina:${restauranteId}`);
    // Confirmar unión
    socket.emit("joined:cocina", { restauranteId, socketId: socket.id });
  });

  socket.on("disconnect", (reason) => {
    console.log(`❌ Cliente desconectado: ${socket.id} - Razón: ${reason}`);
  });

  socket.on("error", (error) => {
    console.error(`⚠️ Error en socket ${socket.id}:`, error);
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket habilitado\n`);
});

// Manejo de errores no capturados
process.on("unhandledRejection", (err) => {
  console.error("❌ Error no manejado:", err.message);
  process.exit(1);
});
