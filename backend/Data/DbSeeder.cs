using DemoEntrevista.Api.Models;
using DemoEntrevista.Api.Services;

namespace DemoEntrevista.Api.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (!db.Usuarios.Any())
        {
            db.Usuarios.Add(new Usuario
            {
                Email = "admin@demo.com",
                NombreUsuario = "admin",
                Password = Md5Hasher.Hash("admin123")
            });
        }

        if (!db.Clientes.Any())
        {
            db.Clientes.AddRange(
                new Cliente
                {
                    Nombre = "Ana López",
                    Email = "ana@correo.com",
                    Telefono = "555-0101",
                    Direccion = "Av. Reforma 120"
                },
                new Cliente
                {
                    Nombre = "Carlos Ruiz",
                    Email = "carlos@correo.com",
                    Telefono = "555-0102",
                    Direccion = "Calle 5 de Mayo 45"
                });
        }

        if (!db.Productos.Any())
        {
            db.Productos.AddRange(
                new Producto
                {
                    Nombre = "Laptop 14\"",
                    Descripcion = "Equipo portátil para oficina",
                    Precio = 18999.00m,
                    Stock = 12
                },
                new Producto
                {
                    Nombre = "Mouse inalámbrico",
                    Descripcion = "Mouse óptico con receptor USB",
                    Precio = 349.50m,
                    Stock = 40
                });
        }

        db.SaveChanges();
    }
}
