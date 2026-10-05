import { useEffect, useState } from "react";
import { api } from "../api";

const emptyForm = {
  nombre: "",
  email: "",
  telefono: "",
  direccion: "",
};

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setClientes(await api("/cliente"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
  }

  function openEdit(cliente) {
    setEditingId(cliente.id);
    setForm({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
    });
    setShowForm(true);
    setError("");
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function onChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await api(`/cliente/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({ id: editingId, ...form }),
        });
      } else {
        await api("/cliente", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      closeForm();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(cliente) {
    if (!window.confirm(`¿Eliminar a ${cliente.nombre}?`)) {
      return;
    }

    setError("");
    try {
      await api(`/cliente/${cliente.id}`, { method: "DELETE" });
      if (editingId === cliente.id) {
        closeForm();
      }
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Tabla cliente</p>
          <h1>Clientes</h1>
        </div>
        <button type="button" className="primary" onClick={openCreate}>
          Nuevo cliente
        </button>
      </div>

      {error && <p className="alert">{error}</p>}

      {showForm && (
        <form className="editor" onSubmit={onSubmit}>
          <h2>{editingId ? "Editar cliente" : "Nuevo cliente"}</h2>
          <div className="form-grid">
            <label>
              Nombre
              <input name="nombre" value={form.nombre} onChange={onChange} required />
            </label>
            <label>
              Correo
              <input name="email" type="email" value={form.email} onChange={onChange} required />
            </label>
            <label>
              Teléfono
              <input name="telefono" value={form.telefono} onChange={onChange} required />
            </label>
            <label>
              Dirección
              <input name="direccion" value={form.direccion} onChange={onChange} required />
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" className="ghost" onClick={closeForm}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5">Cargando clientes...</td>
              </tr>
            )}
            {!loading && clientes.length === 0 && (
              <tr>
                <td colSpan="5">No hay clientes registrados.</td>
              </tr>
            )}
            {!loading && clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.direccion}</td>
                <td className="row-actions">
                  <button type="button" className="ghost" onClick={() => openEdit(cliente)}>
                    Editar
                  </button>
                  <button type="button" className="danger" onClick={() => onDelete(cliente)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
