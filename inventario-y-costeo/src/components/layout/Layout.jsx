import { NavLink, Outlet } from "react-router-dom";
import "@/modern-theme.css";

export default function Layout() {
  const linkStyle = {
    fontWeight: 'bold',
    textTransform: 'uppercase'
  };

  const inactiveStyle = {
    color: 'yellow',
    ...linkStyle
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'black', color: '#87CEEB' }}>
      <aside className="w-64 flex flex-col p-4" style={{ backgroundColor: 'black', color: '#87CEEB', borderRight: 'none' }}>
        <div className="p-4">
          <h1 className="text-3xl font-bold">Gestión</h1>
        </div>
        <nav className="flex flex-col mt-10">
          <NavLink 
            to="/" 
            style={({ isActive }) => isActive ? linkStyle : inactiveStyle}
            className={({ isActive }) => 
              `py-3 px-4 rounded transition duration-200 text-lg mb-10 ${
                isActive ? "modern-button" : "hover:bg-gray-700"
              }`
            }
          >
            Inventario
          </NavLink>
          <NavLink 
            to="/recipes" 
            style={({ isActive }) => isActive ? linkStyle : inactiveStyle}
            className={({ isActive }) => 
              `py-3 px-4 rounded transition duration-200 text-lg ${
                isActive ? "modern-button" : "hover:bg-gray-700"
              }`
            }
          >
            Recetas
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-10" style={{ backgroundColor: 'white', color: 'black' }}>
        <Outlet />
      </main>
    </div>
  );
}
