import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión</h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `block py-2.5 px-4 rounded transition duration-200 ${
                    isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                  }`
                }
              >
                Inventario
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/recipes" 
                className={({ isActive }) => 
                  `block py-2.5 px-4 rounded transition duration-200 ${
                    isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                  }`
                }
              >
                Recetas
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}
