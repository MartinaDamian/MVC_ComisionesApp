using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniCoreApi.Data;
using MiniCoreApi.Models;

namespace MiniCoreApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MiniCoreController : ControllerBase
{
    private readonly AppDbContext _context;

    public MiniCoreController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("vendedores")]
    public async Task<ActionResult<IEnumerable<Vendedor>>> GetVendedores()
    {
        return await _context.Vendedores.ToListAsync();
    }

    [HttpGet("reglas")]
    public async Task<ActionResult<IEnumerable<Regla>>> GetReglas()
    {
        return await _context.Reglas.ToListAsync();
    }

    [HttpGet("ventas")]
    public async Task<ActionResult<IEnumerable<object>>> GetVentas()
    {
        var ventas = await _context.Ventas
            .Include(v => v.Vendedor)
            .Include(v => v.Regla)
            .Select(v => new
            {
                v.Id,
                v.FechaVenta,
                v.Monto,
                v.VendedorId,
                VendedorNombre = v.Vendedor != null ? v.Vendedor.Nombre : string.Empty,
                v.ReglaId,
                ReglaMontoMinimo = v.Regla != null ? v.Regla.MontoMinimo : 0m,
                ReglaPorcentaje = v.Regla != null ? v.Regla.Porcentaje : 0m
            })
            .ToListAsync();

        return Ok(ventas);
    }

    [HttpGet("calcular-comisiones")]
    public async Task<ActionResult<IEnumerable<ComisionResultadoDto>>> CalcularComisiones(
        [FromQuery] DateTime fechaInicio,
        [FromQuery] DateTime fechaFin)
    {
        var inicio = fechaInicio.Date;
        var fin = fechaFin.Date;

        var vendedores = await _context.Vendedores.ToListAsync();
        var ventas = await _context.Ventas
            .Include(v => v.Regla)
            .Where(v => v.FechaVenta.Date >= inicio && v.FechaVenta.Date <= fin)
            .ToListAsync();

        var resultados = vendedores.Select(vendedor =>
        {
            var ventasVendedor = ventas.Where(v => v.VendedorId == vendedor.Id);
            decimal comisionTotal = 0m;

            foreach (var venta in ventasVendedor)
            {
                if (venta.Regla != null && venta.Monto >= venta.Regla.MontoMinimo)
                {
                    comisionTotal += venta.Monto * venta.Regla.Porcentaje;
                }
            }

            return new ComisionResultadoDto
            {
                VendedorId = vendedor.Id,
                VendedorNombre = vendedor.Nombre,
                ComisionCalculada = Math.Round(comisionTotal, 2)
            };
        }).ToList();

        return Ok(resultados);
    }
}

public class ComisionResultadoDto
{
    public int VendedorId { get; set; }
    public string VendedorNombre { get; set; } = string.Empty;
    public decimal ComisionCalculada { get; set; }
}
