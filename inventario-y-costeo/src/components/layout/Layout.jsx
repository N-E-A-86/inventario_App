import { NavLink, Outlet } from "react-router-dom";
import "@/modern-theme.css";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-secondary text-text">
      <aside className="w-64 flex flex-col p-4 bg-surface">
        <div className="p-4">
          <h1 className="text-3xl font-bold text-primary">Gestión</h1>
        </div>
        <nav className="flex flex-col mt-10">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `py-3 px-4 rounded transition duration-200 text-lg mb-10 ${
                isActive ? "modern-button" : "hover:bg-primary-hover"
              }`
            }
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
          >
            Recetas
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-10 bg-secondary">
        <Outlet />
      </main>
    </div>
  );
}
