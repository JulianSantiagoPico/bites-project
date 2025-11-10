import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import DashboardLayout from "./components/Dashboard/DashboardLayout.jsx";
import DashboardHome from "./pages/Dashboard/DashboardHome.jsx";
import TomarPedido from "./pages/Dashboard/TomarPedido.jsx";
import Productos from "./pages/Dashboard/Productos.jsx";
import Ordenes from "./pages/Dashboard/Ordenes.jsx";
import Mesas from "./pages/Dashboard/Mesas.jsx";
import Reservas from "./pages/Dashboard/Reservas.jsx";
import Inventario from "./pages/Dashboard/Inventario.jsx";
import Empleados from "./pages/Dashboard/Empleados.jsx";
import Perfil from "./pages/Dashboard/Perfil.jsx";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="pedidos" element={<TomarPedido />} />
        <Route path="productos" element={<Productos />} />
        <Route path="ordenes" element={<Ordenes />} />
        <Route path="mesas" element={<Mesas />} />
        <Route path="reservas" element={<Reservas />} />
        <Route path="inventario" element={<Inventario />} />
        <Route path="empleados" element={<Empleados />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
    </Routes>
  );
}

export default App;
