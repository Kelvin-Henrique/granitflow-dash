namespace GranitFlowApi.DTOs;

public class MaterialDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal CurrentStock { get; set; }
    public decimal MinStock { get; set; }
    public decimal UnitCost { get; set; }
    public decimal UnitPrice { get; set; }
    public string Supplier { get; set; } = string.Empty;
    public string[] Colors { get; set; } = Array.Empty<string>();
    public DateTime? LastPurchase { get; set; }
    public decimal TotalValue => CurrentStock * UnitCost;
    public bool IsLowStock => CurrentStock <= MinStock;
}

public class CreateMaterialDto
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal CurrentStock { get; set; }
    public decimal MinStock { get; set; }
    public decimal UnitCost { get; set; }
    public decimal UnitPrice { get; set; }
    public string Supplier { get; set; } = string.Empty;
    public string[] Colors { get; set; } = Array.Empty<string>();
}

public class UpdateMaterialDto
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal CurrentStock { get; set; }
    public decimal MinStock { get; set; }
    public decimal UnitCost { get; set; }
    public decimal UnitPrice { get; set; }
    public string Supplier { get; set; } = string.Empty;
    public string[] Colors { get; set; } = Array.Empty<string>();
}