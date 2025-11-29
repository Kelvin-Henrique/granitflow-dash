namespace GranitFlowApi.DTOs;

public class QuoteDto
{
    public int Id { get; set; }
    public string Number { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public int? ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public DateTime ValidUntil { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<QuoteItemDto> Items { get; set; } = new();
}

public class QuoteItemDto
{
    public int Id { get; set; }
    public int? MaterialId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public class CreateQuoteDto
{
    public int CustomerId { get; set; }
    public int? ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string Status { get; set; } = "rascunho";
    public DateTime ValidUntil { get; set; }
    public List<CreateQuoteItemDto> Items { get; set; } = new();
}

public class CreateQuoteItemDto
{
    public int MaterialId { get; set; }
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public class UpdateQuoteDto
{
    public int CustomerId { get; set; }
    public int? ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime ValidUntil { get; set; }
    public List<CreateQuoteItemDto> Items { get; set; } = new();
}