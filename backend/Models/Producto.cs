using System.ComponentModel.DataAnnotations;

namespace DemoEntrevista.Api.Models;

public class Producto
{
    public int Id { get; set; }

    [Required]
    [MaxLength(120)]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    [MaxLength(300)]
    public string Descripcion { get; set; } = string.Empty;

    [Range(0, 999999999)]
    public decimal Precio { get; set; }

    [Range(0, 1000000)]
    public int Stock { get; set; }
}
