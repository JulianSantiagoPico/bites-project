import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true, // Necesario para Docker
      port: 5173,
      strictPort: true,
      watch: {
        usePolling: true, // Necesario para hot-reload en Docker
      },
      // Proxy para desarrollo (opcional, si quieres evitar CORS)
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
        },
        "/socket.io": {
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
          ws: true,
        },
      },
    },
    preview: {
      host: true,
      port: 4173,
      strictPort: true,
    },
  };
});
