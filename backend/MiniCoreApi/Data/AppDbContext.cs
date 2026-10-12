using Microsoft.EntityFrameworkCore;
using MiniCoreApi.Models;

namespace MiniCoreApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Vendedor> Vendedores => Set<Vendedor>();
    public DbSet<Regla> Reglas => Set<Regla>();
    public DbSet<Venta> Ventas => Set<Venta>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Vendedor>().HasData(
            new Vendedor { Id = 1, Nombre = "Jorge Negrete" },
            new Vendedor { Id = 2, Nombre = "Ricardo Vega" },
            new Vendedor { Id = 3, Nombre = "Diego Pérez" },
            new Vendedor { Id = 4, Nombre = "Martin Torres" }
        );

        modelBuilder.Entity<Regla>().HasData(
            new Regla { Id = 1, MontoMinimo = 600m, Porcentaje = 0.06m },
            new Regla { Id = 2, MontoMinimo = 500m, Porcentaje = 0.08m },
            new Regla { Id = 3, MontoMinimo = 800m, Porcentaje = 0.10m },
            new Regla { Id = 4, MontoMinimo = 1000m, Porcentaje = 0.15m }
        );

        modelBuilder.Entity<Venta>().HasData(
            new Venta { Id = 1, FechaVenta = new DateTime(2025, 5, 21), Monto = 400m, VendedorId = 1, ReglaId = 1 },
            new Venta { Id = 2, FechaVenta = new DateTime(2025, 5, 29), Monto = 600m, VendedorId = 2, ReglaId = 2 },
            new Venta { Id = 3, FechaVenta = new DateTime(2025, 6, 3), Monto = 200m, VendedorId = 2, ReglaId = 1 },
            new Venta { Id = 4, FechaVenta = new DateTime(2025, 6, 9), Monto = 300m, VendedorId = 1, ReglaId = 1 },
            new Venta { Id = 5, FechaVenta = new DateTime(2025, 6, 11), Monto = 900m, VendedorId = 3, ReglaId = 3 },
            new Venta { Id = 6, FechaVenta = new DateTime(2025, 6, 14), Monto = 500m, VendedorId = 1, ReglaId = 2 }
        );
    }
}
