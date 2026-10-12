using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniCoreApi.Controllers;
using MiniCoreApi.Data;
using MiniCoreApi.Models;
using Xunit;

namespace MiniCoreApi.Tests;

public class MiniCoreControllerTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var context = new AppDbContext(options);
        context.Database.EnsureCreated();
        return context;
    }

    [Fact]
    public async Task GetVendedores_ReturnsAllVendedores()
    {
        using var context = GetInMemoryDbContext();
        var controller = new MiniCoreController(context);

        var result = await controller.GetVendedores();

        var actionResult = Assert.IsType<ActionResult<IEnumerable<Vendedor>>>(result);
        var vendedores = Assert.IsAssignableFrom<IEnumerable<Vendedor>>(actionResult.Value);
        Assert.Equal(4, vendedores.Count());
    }

    [Fact]
    public async Task CalcularComisiones_CalculatesCorrectlyForDateRange()
    {
        using var context = GetInMemoryDbContext();
        var controller = new MiniCoreController(context);

        // Date range 2025-05-01 to 2025-06-30 covers all seed sales
        // Sales:
        // V1: 2025-05-21 ($400, R1 min 600 -> 0), 2025-06-09 ($300, R1 min 600 -> 0), 2025-06-14 ($500, R2 min 500 -> 500*0.08 = 40.00). Total V1 = 40.00
        // V2: 2025-05-29 ($600, R2 min 500 -> 600*0.08 = 48.00), 2025-06-03 ($200, R1 min 600 -> 0). Total V2 = 48.00
        // V3: 2025-06-11 ($900, R3 min 800 -> 900*0.10 = 90.00). Total V3 = 90.00
        // V4: No sales -> 0.00

        var fechaInicio = new DateTime(2025, 5, 1);
        var fechaFin = new DateTime(2025, 6, 30);

        var result = await controller.CalcularComisiones(fechaInicio, fechaFin);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var resultados = Assert.IsAssignableFrom<IEnumerable<ComisionResultadoDto>>(okResult.Value).ToList();

        Assert.Equal(4, resultados.Count);

        var jorge = resultados.First(r => r.VendedorNombre == "Jorge Negrete");
        var ricardo = resultados.First(r => r.VendedorNombre == "Ricardo Vega");
        var diego = resultados.First(r => r.VendedorNombre == "Diego Pérez");
        var martin = resultados.First(r => r.VendedorNombre == "Martin Torres");

        Assert.Equal(40.00m, jorge.ComisionCalculada);
        Assert.Equal(48.00m, ricardo.ComisionCalculada);
        Assert.Equal(90.00m, diego.ComisionCalculada);
        Assert.Equal(0.00m, martin.ComisionCalculada);
    }
}
