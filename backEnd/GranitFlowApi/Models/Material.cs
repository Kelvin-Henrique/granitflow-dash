using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GranitFlowApi.Models;

[Table("materials")]
public class Material
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    [Column("type")]
    public string Type { get; set; } = string.Empty;

    [Column("current_stock", TypeName = "decimal(10,2)")]
    public decimal CurrentStock { get; set; }

    [Column("min_stock", TypeName = "decimal(10,2)")]
    public decimal MinStock { get; set; }

    [Column("unit_cost", TypeName = "decimal(10,2)")]
    public decimal UnitCost { get; set; }

    [Column("unit_price", TypeName = "decimal(10,2)")]
    public decimal UnitPrice { get; set; }

    [StringLength(100)]
    [Column("supplier")]
    public string Supplier { get; set; } = string.Empty;

    [Column("colors", TypeName = "text[]")]
    public string[] Colors { get; set; } = Array.Empty<string>();

    [Column("last_purchase")]
    public DateTime? LastPurchase { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<ProjectMaterial> ProjectMaterials { get; set; } = new List<ProjectMaterial>();
    public virtual ICollection<QuoteItem> QuoteItems { get; set; } = new List<QuoteItem>();
    public virtual ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
}