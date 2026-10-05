import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { storage } from "../storage";

export default function Layout() {
  const navigate = useNavigate();
  const nombreUsuario = storage.read("nombreUsuario") ?? "usuario";

  function logout() {
    storage.remove("token");
    storage.remove("nombreUsuario");
    navigate("/");
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">DE</span>
          <div>
            <strong>Demo Entrevista</strong>
            <small>Panel de administración</small>
          </div>
        </div>
        <nav className="nav">
          <NavLink to="/home">Inicio</NavLink>
          <NavLink to="/clientes">Clientes</NavLink>
          <NavLink to="/productos">Productos</NavLink>
        </nav>
        <div className="session">
          <span>{nombreUsuario}</span>
          <button type="button" className="ghost" onClick={logout}>
            Salir
          </button>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
