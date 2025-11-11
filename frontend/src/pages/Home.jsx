import { useNavigate } from "react-router-dom";
import Colors from "../styles/colors.js";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: Colors.background }}
    >
      {/* Header/Navbar */}
      <header className="w-full h-20 flex items-center justify-between px-8 md:px-16 lg:px-20">
        <div className="text-xl font-bold" style={{ color: Colors.primary }}>
          Bites
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 text-sm font-medium hover:underline transition cursor-pointer"
            style={{ color: Colors.primary }}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 rounded-md text-white text-sm font-medium transition cursor-pointer"
            style={{ backgroundColor: Colors.primary }}
          >
            Registrarse
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full px-8 md:px-16 lg:px-20 py-20">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-16">
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span style={{ color: Colors.primary }}>Mas control</span>
              <br />
              <span style={{ color: Colors.accent }}>
                menos esfuerzo en tu restaurante
              </span>
            </h1>
            <p
              className="text-zinc-600 text-xl"
              style={{ color: Colors.textSecondary }}
            >
              Centraliza pedidos, inventario, reservas, ventas y facturación
              desde una sola plataforma, en tiempo real y con total control.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="w-fit px-8 py-3 rounded text-white text-base font-medium transition cursor-pointer"
              style={{ backgroundColor: Colors.primary }}
            >
              Registrarse
            </button>
          </div>
          <div
            className="w-full lg:w-[400px] h-[300px] lg:h-[400px] rounded-[30px]"
            style={{ backgroundColor: Colors.primary }}
          />
        </div>
      </section>

      {/* Clientes Section */}
      <section
        className="w-full px-8 md:px-16 lg:px-20 py-16"
        style={{ backgroundColor: Colors.backgroundSecondary }}
      >
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <h2
              className="text-4xl font-semibold text-center"
              style={{ color: Colors.primary }}
            >
              Restaurantes que confían en Bites
            </h2>
            <p
              className="text-xl text-center"
              style={{ color: Colors.textSecondary }}
            >
              Desde restaurantes gourmet hasta cadenas de comida rápida, Bites
              impulsa la eficiencia operativa en negocios gastronómicos de todos
              los tamaños.
            </p>
          </div>
          <div className="w-full flex flex-wrap justify-center items-center gap-12 lg:gap-16">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 bg-gray-800 rounded-lg hover:scale-110 transition"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Por que elegirnos Section */}
      <section className="w-full px-8 md:px-16 lg:px-20 py-20">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-2">
            <h2
              className="text-4xl font-semibold text-center"
              style={{ color: Colors.primary }}
            >
              Gestión completa, sin complicaciones
            </h2>
            <p className="text-base text-center" style={{ color: Colors.text }}>
              Bites combina tecnología moderna y experiencia en la industria
              para ofrecerte una solución ERP sólida, escalable y fácil de usar.
            </p>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[900px]">
            {[
              {
                title: "Gestión centralizada",
                description:
                  "Controla pedidos, inventario, reservas y facturación en una sola plataforma. Simplifica operaciones y mejora la eficiencia de tu restaurante.",
              },
              {
                title: "Eficiencia en tiempo real",
                description:
                  "Monitorea las operaciones de tu restaurante al instante. Toma decisiones rápidas basadas en datos actualizados en tiempo real.",
              },
              {
                title: "Decisiones inteligentes",
                description:
                  "Analiza reportes detallados y métricas clave para mejorar tu negocio. Identifica oportunidades y optimiza recursos con información precisa.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="px-6 py-8 rounded-lg flex flex-col items-center gap-4 hover:shadow-lg transition"
                style={{ backgroundColor: Colors.backgroundSecondary }}
              >
                <div className="w-16 h-16 bg-gray-700 rounded-lg" />
                <h3
                  className="text-xl font-bold text-center"
                  style={{ color: Colors.primary }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-md text-center leading-relaxed"
                  style={{ color: Colors.textSecondary }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Caracteristicas Section */}
      <section className="w-full px-8 md:px-16 lg:px-20 py-20">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-16">
          <div
            className="w-full lg:w-[400px] h-[300px] lg:h-[400px] rounded-[30px]"
            style={{ backgroundColor: Colors.primary }}
          />
          <div className="flex-1 flex flex-col gap-6 max-w-[600px]">
            <h2
              className="text-4xl font-bold"
              style={{ color: Colors.primary }}
            >
              Características principales
            </h2>
            <p
              className="text-neutral-600 text-xl leading-relaxed"
              style={{ color: Colors.text }}
            >
              {" "}
              Bites combina tecnología avanzada y una interfaz intuitiva para
              ofrecer una gestión integral de tu restaurante. Controla
              operaciones, analiza resultados y mejora la productividad sin
              complicaciones.
            </p>
          </div>
        </div>
      </section>

      {/* Estadisticas Section */}
      <section
        className="w-full px-8 md:px-16 lg:px-20 py-16"
        style={{ backgroundColor: Colors.backgroundSecondary }}
      >
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-20">
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="text-4xl font-bold leading-tight">
              <span style={{ color: Colors.accent }}>
                Resultados que reflejan eficiencia
              </span>
            </h2>
            <p className="text-lg" style={{ color: Colors.textSecondary }}>
              Cifras que muestran el impacto de una gestión centralizada.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
            {[
              { number: "2,245", label: "Restaurantes gestionados con éxito" },
              { number: "46,328", label: "Usuarios activos" },
              { number: "828,867", label: "Reservas administradas" },
              { number: "1,926,436", label: "Transacciones procesadas" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-12 h-12 bg-amber-400 rounded shrink-0"
                  style={{ backgroundColor: Colors.accent }}
                />
                <div className="flex flex-col">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: Colors.text }}
                  >
                    {stat.number}
                  </span>
                  <span
                    className="text-base"
                    style={{ color: Colors.textSecondary }}
                  >
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios Section */}
      <section className="w-full px-8 md:px-16 lg:px-20 py-20">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-2 max-w-[700px]">
            <h2
              className="text-4xl font-bold text-center"
              style={{ color: Colors.primary }}
            >
              Beneficios
            </h2>
            <p
              className="text-lg text-center leading-relaxed"
              style={{ color: Colors.text }}
            >
              Con Bites, optimizas cada proceso y conviertes la gestión de tu
              restaurante en una experiencia eficiente y rentable.
            </p>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "Automatiza tareas diarias y reduce errores manuales.",
              "Mejora la coordinación del equipo",
              "Toma decisiones con datos reales",
            ].map((title, i) => (
              <div key={i} className="flex flex-col items-stretch">
                <div
                  className="w-full h-72 rounded-lg"
                  style={{ backgroundColor: Colors.primary }}
                />
                <div
                  className="w-[90%] -mt-20 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-3 relative z-10 mx-auto"
                  style={{ backgroundColor: Colors.backgroundSecondary }}
                >
                  <h3 className="text-neutral-700 text-md font-bold text-center">
                    {title}
                  </h3>
                  <button
                    className="flex items-center gap-2 font-semibold hover:gap-3 transition-all"
                    style={{ color: Colors.primary }}
                  >
                    <span>Leer más</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="w-full px-8 md:px-16 lg:px-20 py-16"
        style={{ backgroundColor: Colors.primary }}
      >
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row justify-between gap-12">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="text-white text-3xl font-bold">Bites</div>
              <p className="text-slate-200 text-sm">
                © 2025 Bites — ERP para Restaurantes.{" "}
              </p>
              <p className="text-slate-200 text-sm">
                Todos los derechos reservados.
              </p>
            </div>
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition cursor-pointer"
                >
                  <div className="w-5 h-5 bg-white rounded-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
            <div className="flex flex-col gap-4">
              <h3 className="text-white text-lg font-semibold">Compañia</h3>
              <div className="flex flex-col gap-2">
                {[
                  "Sobre nosotros",
                  "Blog",
                  "Contáctanos",
                  "Precios",
                  "Testimonios",
                ].map((link, j) => (
                  <a
                    key={j}
                    href="#"
                    className="text-slate-200 text-sm hover:text-amber-400 transition"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-white text-lg font-semibold">Soporte</h3>
              <div className="flex flex-col gap-2">
                {[
                  "Centro de ayuda",
                  "Términos de servicio",
                  "Aviso legal",
                  "Política de privacidad",
                  "Estado del sistema",
                ].map((link, j) => (
                  <a
                    key={j}
                    href="#"
                    className="text-slate-200 text-sm hover:text-amber-400 transition"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-white text-lg font-semibold">
                Mantente al día
              </h3>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="w-full h-10 bg-white/20 rounded-lg px-4 pr-10 text-white placeholder:text-gray-300 text-sm focus:bg-white/30 focus:outline-none transition"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-amber-400 transition">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
