import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import colors from "../../styles/colors";

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main
        className="flex-1 transition-all duration-300"
        style={{
          marginLeft: isCollapsed ? "80px" : "280px",
        }}
      >
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 backdrop-blur-sm border-b"
          style={{
            backgroundColor: `${colors.background}95`,
            borderColor: colors.secondary + "20",
          }}
        >
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h2
                className="text-2xl font-bold"
                style={{ color: colors.primary }}
              >
                Dashboard
              </h2>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Bienvenido al panel de control
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button
                className="p-2 rounded-lg hover:bg-white/50 transition-colors relative"
                style={{ color: colors.secondary }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.accent }}
                ></span>
              </button>

              {/* Settings */}
              <button
                className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                style={{ color: colors.secondary }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
