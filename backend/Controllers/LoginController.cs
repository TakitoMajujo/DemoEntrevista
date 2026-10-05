using DemoEntrevista.Api.Data;
using DemoEntrevista.Api.Dtos;
using DemoEntrevista.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DemoEntrevista.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly TokenService _tokenService;

    public LoginController(AppDbContext db, TokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }

    [HttpPost]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var usuario = request.Usuario.Trim();
        var passwordHash = Md5Hasher.Hash(request.Password);

        var user = await _db.Usuarios.FirstOrDefaultAsync(item =>
            (item.NombreUsuario == usuario || item.Email == usuario) &&
            item.Password == passwordHash);

        if (user is null)
        {
            return Unauthorized(new { message = "Usuario o contraseña incorrectos." });
        }

        return Ok(new LoginResponse
        {
            Token = _tokenService.CreateToken(user),
            NombreUsuario = user.NombreUsuario,
            Email = user.Email
        });
    }
}
