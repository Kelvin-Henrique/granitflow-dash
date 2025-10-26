using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GranitFlowApi.Models;

[Table("quote_items")]
public class QuoteItem
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("quote_id")]
    public int QuoteId { get; set; }

    [Column("material_id")]
    public int? MaterialId { get; set; }

    [Required]
    [StringLength(200)]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    [Column("quantity")]
    public string Quantity { get; set; } = string.Empty;

    [Column("unit_price", TypeName = "decimal(10,2)")]
    public decimal UnitPrice { get; set; }

    [Column("total_price", TypeName = "decimal(12,2)")]
    public decimal TotalPrice { get; set; }

    // Navigation properties
    [ForeignKey("QuoteId")]
    public virtual Quote Quote { get; set; } = null!;

    [ForeignKey("MaterialId")]
    public virtual Material? Material { get; set; }
}