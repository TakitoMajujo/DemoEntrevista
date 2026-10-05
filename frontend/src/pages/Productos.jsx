import { useEffect, useState } from "react";
import { api } from "../api";

const emptyForm = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
};

const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setProductos(await api("/producto"));
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

  function openEdit(producto) {
    setEditingId(producto.id);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: String(producto.precio),
      stock: String(producto.stock),
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

    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      stock: Number(form.stock),
    };

    try {
      if (editingId) {
        await api(`/producto/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        await api("/producto", {
          method: "POST",
          body: JSON.stringify(payload),
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

  async function onDelete(producto) {
    if (!window.confirm(`¿Eliminar ${producto.nombre}?`)) {
      return;
    }

    setError("");
    try {
      await api(`/producto/${producto.id}`, { method: "DELETE" });
      if (editingId === producto.id) {
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
          <p className="eyebrow">Tabla producto</p>
          <h1>Productos</h1>
        </div>
        <button type="button" className="primary" onClick={openCreate}>
          Nuevo producto
        </button>
      </div>

      {error && <p className="alert">{error}</p>}

      {showForm && (
        <form className="editor" onSubmit={onSubmit}>
          <h2>{editingId ? "Editar producto" : "Nuevo producto"}</h2>
          <div className="form-grid">
            <label>
              Nombre
              <input name="nombre" value={form.nombre} onChange={onChange} required />
            </label>
            <label>
              Descripción
              <input name="descripcion" value={form.descripcion} onChange={onChange} required />
            </label>
            <label>
              Precio
              <input
                name="precio"
                type="number"
                min="0"
                step="0.01"
                value={form.precio}
                onChange={onChange}
                required
              />
            </label>
            <label>
              Stock
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={onChange}
                required
              />
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
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5">Cargando productos...</td>
              </tr>
            )}
            {!loading && productos.length === 0 && (
              <tr>
                <td colSpan="5">No hay productos registrados.</td>
              </tr>
            )}
            {!loading && productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>{money.format(producto.precio)}</td>
                <td>{producto.stock}</td>
                <td className="row-actions">
                  <button type="button" className="ghost" onClick={() => openEdit(producto)}>
                    Editar
                  </button>
                  <button type="button" className="danger" onClick={() => onDelete(producto)}>
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
