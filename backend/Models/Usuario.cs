using System.ComponentModel.DataAnnotations;

namespace DemoEntrevista.Api.Models;

public class Usuario
{
    public int Id { get; set; }

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(80)]
    public string NombreUsuario { get; set; } = string.Empty;

    [Required]
    [MaxLength(32)]
    public string Password { get; set; } = string.Empty;
}
