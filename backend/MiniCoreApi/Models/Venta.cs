namespace MiniCoreApi.Models;

public class Venta
{
    public int Id { get; set; }
    public DateTime FechaVenta { get; set; }
    public decimal Monto { get; set; }
    public int VendedorId { get; set; }
    public Vendedor? Vendedor { get; set; }
    public int ReglaId { get; set; }
    public Regla? Regla { get; set; }
}
