import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Gestión</h1>
        <nav>
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? "font-bold" : ""}>
                Inventario
              </NavLink>
            </li>
            <li>
              <NavLink to="/recipes" className={({ isActive }) => isActive ? "font-bold" : ""}>
                Recetas
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
