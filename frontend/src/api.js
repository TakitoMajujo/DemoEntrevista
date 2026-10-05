import { storage } from "./storage";

const API_URL = "http://localhost:5167/api";

export async function api(path, options = {}) {
  const token = storage.read("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error("No se pudo conectar con el servidor.");
  }

  if (response.status === 401 && path !== "/login") {
    storage.remove("token");
    storage.remove("nombreUsuario");
    window.location.href = "/";
    throw new Error("Sesión expirada.");
  }

  if (!response.ok) {
    let message = "Ocurrió un error al procesar la solicitud.";
    try {
      const data = await response.json();
      message = data.message || data.title || message;
    } catch {
      // La respuesta no trae JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
