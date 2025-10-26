using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GranitFlowApi.Models;

[Table("project_materials")]
public class ProjectMaterial
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("project_id")]
    public int ProjectId { get; set; }

    [Required]
    [Column("material_id")]
    public int MaterialId { get; set; }

    [Column("quantity", TypeName = "decimal(10,2)")]
    public decimal Quantity { get; set; }

    [Column("cost", TypeName = "decimal(12,2)")]
    public decimal Cost { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("ProjectId")]
    public virtual Project Project { get; set; } = null!;

    [ForeignKey("MaterialId")]
    public virtual Material Material { get; set; } = null!;
}