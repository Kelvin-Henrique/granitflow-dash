using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GranitFlowApi.Models;

[Table("schedule_events")]
public class ScheduleEvent
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    [Column("type")]
    public string Type { get; set; } = string.Empty;

    [Required]
    [Column("customer_id")]
    public int CustomerId { get; set; }

    [Column("project_id")]
    public int? ProjectId { get; set; }

    [Required]
    [StringLength(10)]
    [Column("time")]
    public string Time { get; set; } = string.Empty;

    [Column("date")]
    public DateTime Date { get; set; }

    [StringLength(200)]
    [Column("location")]
    public string Location { get; set; } = string.Empty;

    [StringLength(100)]
    [Column("team")]
    public string Team { get; set; } = string.Empty;

    [StringLength(20)]
    [Column("status")]
    public string Status { get; set; } = "agendado";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("CustomerId")]
    public virtual Customer Customer { get; set; } = null!;

    [ForeignKey("ProjectId")]
    public virtual Project? Project { get; set; }
}