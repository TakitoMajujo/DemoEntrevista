using DemoEntrevista.Api.Data;
using DemoEntrevista.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DemoEntrevista.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ClienteController : ControllerBase
{
    private readonly AppDbContext _db;

    public ClienteController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Cliente>>> GetAll()
    {
        var clientes = await _db.Clientes
            .OrderBy(cliente => cliente.Nombre)
            .ToListAsync();

        return Ok(clientes);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Cliente>> GetById(int id)
    {
        var cliente = await _db.Clientes.FindAsync(id);
        return cliente is null ? NotFound() : Ok(cliente);
    }

    [HttpPost]
    public async Task<ActionResult<Cliente>> Create(Cliente cliente)
    {
        cliente.Id = 0;
        _db.Clientes.Add(cliente);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = cliente.Id }, cliente);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Cliente cliente)
    {
        if (id != cliente.Id)
        {
            return BadRequest(new { message = "El id de la ruta no coincide con el cliente." });
        }

        var existing = await _db.Clientes.FindAsync(id);
        if (existing is null)
        {
            return NotFound();
        }

        existing.Nombre = cliente.Nombre;
        existing.Email = cliente.Email;
        existing.Telefono = cliente.Telefono;
        existing.Direccion = cliente.Direccion;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var cliente = await _db.Clientes.FindAsync(id);
        if (cliente is null)
        {
            return NotFound();
        }

        _db.Clientes.Remove(cliente);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
