using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GranitFlowApi.Models;

[Table("projects")]
public class Project
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Column("customer_id")]
    public int CustomerId { get; set; }

    [StringLength(50)]
    [Column("status")]
    public string Status { get; set; } = "em_medicao";

    [Column("area", TypeName = "decimal(8,2)")]
    public decimal Area { get; set; }

    [Column("cost", TypeName = "decimal(12,2)")]
    public decimal Cost { get; set; }

    [Column("progress")]
    public int Progress { get; set; } = 0;

    [Column("deadline")]
    public DateTime? Deadline { get; set; }

    [StringLength(200)]
    [Column("location")]
    public string Location { get; set; } = string.Empty;

    [Column("description", TypeName = "text")]
    public string Description { get; set; } = string.Empty;

    [Column("image_count")]
    public int ImageCount { get; set; } = 0;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("CustomerId")]
    public virtual Customer Customer { get; set; } = null!;
    
    public virtual ICollection<ProjectMaterial> ProjectMaterials { get; set; } = new List<ProjectMaterial>();
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    public virtual ICollection<Quote> Quotes { get; set; } = new List<Quote>();
    public virtual ICollection<ScheduleEvent> ScheduleEvents { get; set; } = new List<ScheduleEvent>();
}