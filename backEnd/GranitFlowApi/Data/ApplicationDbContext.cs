using Microsoft.EntityFrameworkCore;
using GranitFlowApi.Models;

namespace GranitFlowApi.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Material> Materials { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Quote> Quotes { get; set; }
    public DbSet<QuoteItem> QuoteItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<ScheduleEvent> ScheduleEvents { get; set; }
    public DbSet<ProjectMaterial> ProjectMaterials { get; set; }
    public DbSet<StockMovement> StockMovements { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure array properties for PostgreSQL
        modelBuilder.Entity<Material>()
            .Property(e => e.Colors)
            .HasColumnType("text[]");

        // Configure decimal precision
        modelBuilder.Entity<Material>()
            .Property(e => e.CurrentStock)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Material>()
            .Property(e => e.MinStock)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Material>()
            .Property(e => e.UnitCost)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Material>()
            .Property(e => e.UnitPrice)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Project>()
            .Property(e => e.Area)
            .HasPrecision(8, 2);

        modelBuilder.Entity<Project>()
            .Property(e => e.Cost)
            .HasPrecision(12, 2);

        modelBuilder.Entity<Quote>()
            .Property(e => e.Value)
            .HasPrecision(12, 2);

        modelBuilder.Entity<QuoteItem>()
            .Property(e => e.UnitPrice)
            .HasPrecision(10, 2);

        modelBuilder.Entity<QuoteItem>()
            .Property(e => e.TotalPrice)
            .HasPrecision(12, 2);

        modelBuilder.Entity<Order>()
            .Property(e => e.Value)
            .HasPrecision(12, 2);

        modelBuilder.Entity<ProjectMaterial>()
            .Property(e => e.Quantity)
            .HasPrecision(10, 2);

        modelBuilder.Entity<ProjectMaterial>()
            .Property(e => e.Cost)
            .HasPrecision(12, 2);

        modelBuilder.Entity<StockMovement>()
            .Property(e => e.Quantity)
            .HasPrecision(10, 2);

        modelBuilder.Entity<StockMovement>()
            .Property(e => e.Balance)
            .HasPrecision(10, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(e => e.UnitPrice)
            .HasPrecision(10, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(e => e.TotalPrice)
            .HasPrecision(12, 2);

        // Configure indexes
        modelBuilder.Entity<User>()
            .HasIndex(e => e.Email)
            .IsUnique();

        modelBuilder.Entity<Customer>()
            .HasIndex(e => e.Email)
            .IsUnique();

        modelBuilder.Entity<Quote>()
            .HasIndex(e => e.Number)
            .IsUnique();

        modelBuilder.Entity<Order>()
            .HasIndex(e => e.Number)
            .IsUnique();

        // Configure relationships
        modelBuilder.Entity<ProjectMaterial>()
            .HasKey(pm => new { pm.ProjectId, pm.MaterialId });

        // Configure cascade deletes
        modelBuilder.Entity<Project>()
            .HasOne(p => p.Customer)
            .WithMany(c => c.Projects)
            .HasForeignKey(p => p.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Quote>()
            .HasOne(q => q.Customer)
            .WithMany(c => c.Quotes)
            .HasForeignKey(q => q.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Quote>()
            .HasOne(q => q.Project)
            .WithMany(p => p.Quotes)
            .HasForeignKey(q => q.ProjectId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}