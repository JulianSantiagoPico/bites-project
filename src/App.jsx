import "./App.css";
import Colors from "./colors.js";

function App() {
  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: Colors.background }}
    >
      {/* Header/Navbar */}
      <header className="w-full h-20 flex items-center justify-between px-8 md:px-16 lg:px-20">
        <div className="text-xl font-bold" style={{ color: Colors.primary }}>
          Bytes
        </div>
        <div className="flex gap-3">
          <button
            className="px-5 py-2 text-sm font-medium hover:underline transition cursor-pointer"
            style={{ color: Colors.primary }}
          >
            Login
          </button>
          <button
            className="px-5 py-2 rounded-md text-white text-sm font-medium transition cursor-pointer"
            style={{ backgroundColor: Colors.primary }}
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full px-8 md:px-16 lg:px-20 py-20">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-16">
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span style={{ color: Colors.primary }}>Titulo</span>
              <br />
              <span style={{ color: Colors.accent }}>Principal</span>
            </h1>
            <p
              className="text-zinc-600 text-base"
              style={{ color: Colors.textSecondary }}
            >
              Propuesta de valor
            </p>
            <button
              className="w-fit px-8 py-3 rounded text-white text-base font-medium transition cursor-pointer"
              style={{ backgroundColor: Colors.primary }}
            >
              Register
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
              Seccion: Nuestros clientes
            </h2>
            <p
              className="text-base text-center"
              style={{ color: Colors.textSecondary }}
            >
              Algunos ejemplos de clientes
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
              Sección:
              <br />
              ¿Por que elegirnos?
            </h2>
            <p className="text-base text-center" style={{ color: Colors.text }}>
              Who is Nextcent suitable for?
            </p>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[900px]">
            {[
              "Membership Organisations",
              "National Associations",
              "Clubs And Groups",
            ].map((title, i) => (
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
                  {title}
                </h3>
                <p
                  className="text-sm text-center leading-relaxed"
                  style={{ color: Colors.textSecondary }}
                >
                  Our membership management software provides full automation of
                  membership renewals and payments
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
              Seccion: Caracteristicas principales
            </h2>
            <p
              className="text-neutral-600 text-base leading-relaxed"
              style={{ color: Colors.text }}
            >
              {" "}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
              amet justo ipsum. Sed accumsan quam vitae est varius fringilla.
              Pellentesque placerat vestibulum lorem sed porta. Nullam mattis
              tristique iaculis. Nullam pulvinar sit amet
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
          <div className="flex-1 flex flex-col gap-3 max-w-[400px]">
            <h2 className="text-4xl font-bold leading-tight">
              <span style={{ color: Colors.text }}>Seccion:</span>
              <br />
              <span style={{ color: Colors.accent }}>
                Estadisticas (simuladas)
              </span>
            </h2>
            <p className="text-base" style={{ color: Colors.textSecondary }}>
              We reached here with our hard work and dedication
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
            {[
              { number: "2,245,341", label: "Members" },
              { number: "46,328", label: "Clubs" },
              { number: "828,867", label: "Event Bookings" },
              { number: "1,926,436", label: "Payments" },
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
              Seccion: Beneficios
            </h2>
            <p
              className="text-base text-center leading-relaxed"
              style={{ color: Colors.text }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
              amet justo ipsum. Sed accumsan quam vitae est varius fringilla.
              Pellentesque placerat vestibulum lorem sed porta.
            </p>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Beneficio #1", "Beneficio #2", "Beneficio #3"].map(
              (title, i) => (
                <div key={i} className="flex flex-col items-stretch">
                  <div
                    className="w-full h-72 rounded-lg"
                    style={{ backgroundColor: Colors.primary }}
                  />
                  <div
                    className="w-[90%] -mt-20 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-3 relative z-10 mx-auto"
                    style={{ backgroundColor: Colors.backgroundSecondary }}
                  >
                    <h3 className="text-neutral-700 text-xl font-bold text-center">
                      {title}
                    </h3>
                    <button
                      className="flex items-center gap-2 font-semibold hover:gap-3 transition-all"
                      style={{ color: Colors.primary }}
                    >
                      <span>Readmore</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )
            )}
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
              <div className="text-white text-3xl font-bold">Bytes</div>
              <p className="text-slate-200 text-sm">Copyright © 2025 Bytes</p>
              <p className="text-slate-200 text-sm">All rights reserved</p>
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
              <h3 className="text-white text-lg font-semibold">Company</h3>
              <div className="flex flex-col gap-2">
                {[
                  "About us",
                  "Blog",
                  "Contact us",
                  "Pricing",
                  "Testimonials",
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
              <h3 className="text-white text-lg font-semibold">Support</h3>
              <div className="flex flex-col gap-2">
                {[
                  "Help center",
                  "Terms of service",
                  "Legal",
                  "Privacy policy",
                  "Status",
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
                Stay up to date
              </h3>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
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

export default App;
