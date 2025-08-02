import { NavLink, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import "@/modern-theme.css";

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

export default function Layout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-surface text-text flex flex-col p-4 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="p-4">
          <h1 className="text-3xl font-bold text-primary">Gestión</h1>
        </div>
        <nav className="flex flex-col mt-10 flex-grow">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `py-3 px-4 rounded transition duration-200 text-lg mb-10 ${
                isActive ? "modern-button" : "hover:bg-primary-hover"
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            Inventario
          </NavLink>
          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              `py-3 px-4 rounded transition duration-200 text-lg ${
                isActive ? "modern-button" : "hover:bg-primary-hover"
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            Recetas
          </NavLink>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="flex justify-between items-center p-4 bg-surface">
          <button
            className="modern-button md:hidden"
            onClick={toggleSidebar}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </header>
        <main className="flex-1 p-10">
          <Outlet />
        </main>
      </div>
      <div className="fixed top-4 right-4 z-50">
        <button onClick={toggleTheme} className="modern-button">
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  );
}
