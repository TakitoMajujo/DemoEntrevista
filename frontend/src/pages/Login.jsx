import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api } from "../api";
import { storage } from "../storage";

export default function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (storage.read("token")) {
    return <Navigate to="/home" replace />;
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api("/login", {
        method: "POST",
        body: JSON.stringify({ usuario, password }),
      });
      const saved =
        storage.write("token", data.token) &&
        storage.write("nombreUsuario", data.nombreUsuario);
      if (!saved) {
        throw new Error("El navegador bloqueó el almacenamiento de este sitio. Permite las cookies para localhost.");
      }
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>Inicia sesión</h1>
        <p className="lede">
          Entra con tu usuario o correo. Si los datos son correctos, irás al inicio.
        </p>

        <label>
          Usuario o correo
          <input
            value={usuario}
            onChange={(event) => setUsuario(event.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="alert">{error}</p>}

        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
