import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const nombreUsuario = localStorage.getItem("nombreUsuario") ?? "usuario";

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("nombreUsuario");
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
