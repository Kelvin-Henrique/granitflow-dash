using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GranitFlowApi.Models;

[Table("users")]
public class User
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Column("password_hash")]
    public string PasswordHash { get; set; } = string.Empty;

    [StringLength(20)]
    [Column("role")]
    public string Role { get; set; } = "user";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [Column("is_active")]
    public bool IsActive { get; set; } = true;
}