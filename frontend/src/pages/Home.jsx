import { Link } from "react-router-dom";
import { storage } from "../storage";

export default function Home() {
  const nombreUsuario = storage.read("nombreUsuario") ?? "usuario";

  return (
    <section className="page">
      <p className="eyebrow">Inicio</p>
      <h1>Hola, {nombreUsuario}</h1>
      <p className="lede">
        Desde aquí puedes dar de alta, modificar y eliminar clientes y productos.
      </p>

      <div className="home-grid">
        <Link className="home-card" to="/clientes">
          <span>ABC</span>
          <h2>Clientes</h2>
          <p>Crear, actualizar y eliminar registros de la tabla cliente.</p>
        </Link>
        <Link className="home-card" to="/productos">
          <span>ABC</span>
          <h2>Productos</h2>
          <p>Crear, actualizar y eliminar registros de la tabla producto.</p>
        </Link>
      </div>
    </section>
  );
}
