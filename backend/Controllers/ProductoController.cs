using DemoEntrevista.Api.Data;
using DemoEntrevista.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DemoEntrevista.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ProductoController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProductoController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Producto>>> GetAll()
    {
        var productos = await _db.Productos
            .OrderBy(producto => producto.Nombre)
            .ToListAsync();

        return Ok(productos);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Producto>> GetById(int id)
    {
        var producto = await _db.Productos.FindAsync(id);
        return producto is null ? NotFound() : Ok(producto);
    }

    [HttpPost]
    public async Task<ActionResult<Producto>> Create(Producto producto)
    {
        producto.Id = 0;
        _db.Productos.Add(producto);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = producto.Id }, producto);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Producto producto)
    {
        if (id != producto.Id)
        {
            return BadRequest(new { message = "El id de la ruta no coincide con el producto." });
        }

        var existing = await _db.Productos.FindAsync(id);
        if (existing is null)
        {
            return NotFound();
        }

        existing.Nombre = producto.Nombre;
        existing.Descripcion = producto.Descripcion;
        existing.Precio = producto.Precio;
        existing.Stock = producto.Stock;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var producto = await _db.Productos.FindAsync(id);
        if (producto is null)
        {
            return NotFound();
        }

        _db.Productos.Remove(producto);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
