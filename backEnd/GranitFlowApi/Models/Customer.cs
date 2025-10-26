using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GranitFlowApi.Models;

[Table("customers")]
public class Customer
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

    [StringLength(20)]
    [Column("phone")]
    public string Phone { get; set; } = string.Empty;

    [StringLength(20)]
    [Column("cpf_cnpj")]
    public string CpfCnpj { get; set; } = string.Empty;

    [StringLength(20)]
    [Column("status")]
    public string Status { get; set; } = "ativo";

    [StringLength(200)]
    [Column("address")]
    public string Address { get; set; } = string.Empty;

    [StringLength(100)]
    [Column("city")]
    public string City { get; set; } = string.Empty;

    [StringLength(2)]
    [Column("state")]
    public string State { get; set; } = string.Empty;

    [StringLength(10)]
    [Column("zip_code")]
    public string ZipCode { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("last_contact")]
    public DateTime LastContact { get; set; } = DateTime.UtcNow;

    [Column("notes", TypeName = "text")]
    public string Notes { get; set; } = string.Empty;

    // Navigation properties
    public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
    public virtual ICollection<Quote> Quotes { get; set; } = new List<Quote>();
}