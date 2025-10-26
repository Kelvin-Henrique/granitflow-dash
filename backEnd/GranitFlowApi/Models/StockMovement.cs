using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GranitFlowApi.Models;

[Table("stock_movements")]
public class StockMovement
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("material_id")]
    public int MaterialId { get; set; }

    [Required]
    [StringLength(20)]
    [Column("type")]
    public string Type { get; set; } = string.Empty; // "entrada" ou "saida"

    [Column("quantity", TypeName = "decimal(10,2)")]
    public decimal Quantity { get; set; }

    [Column("balance", TypeName = "decimal(10,2)")]
    public decimal Balance { get; set; }

    [StringLength(200)]
    [Column("reference")]
    public string Reference { get; set; } = string.Empty; // projeto, fornecedor, etc.

    [Column("project_id")]
    public int? ProjectId { get; set; }

    [Column("date")]
    public DateTime Date { get; set; } = DateTime.UtcNow;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("MaterialId")]
    public virtual Material Material { get; set; } = null!;

    [ForeignKey("ProjectId")]
    public virtual Project? Project { get; set; }
}