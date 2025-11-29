using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GranitFlowApi.Models;

[Table("orders")]
public class Order
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    [Column("number")]
    public string Number { get; set; } = string.Empty;

    [Required]
    [Column("customer_id")]
    public int CustomerId { get; set; }

    [Column("project_id")]
    public int? ProjectId { get; set; }

    [StringLength(20)]
    [Column("status")]
    public string Status { get; set; } = "orcamento";

    [Column("value", TypeName = "decimal(12,2)")]
    public decimal Value { get; set; }

    [Column("deadline")]
    public DateTime? Deadline { get; set; }

    [Column("progress")]
    public int Progress { get; set; } = 0;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("CustomerId")]
    public virtual Customer Customer { get; set; } = null!;

    [ForeignKey("ProjectId")]
    public virtual Project? Project { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}