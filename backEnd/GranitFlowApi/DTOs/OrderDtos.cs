namespace GranitFlowApi.DTOs;

public class OrderItemDto
{
    public int Id { get; set; }
    public int MaterialId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public class CreateOrderItemDto
{
    public int MaterialId { get; set; }
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public class OrderDto
{
    public int Id { get; set; }
    public string Number { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public int? ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public DateTime? Deadline { get; set; }
    public int Progress { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}

public class CreateOrderDto
{
    public int CustomerId { get; set; }
    public int? ProjectId { get; set; }
    public string Status { get; set; } = "orcamento";
    public decimal Value { get; set; }
    public DateTime? Deadline { get; set; }
    public List<CreateOrderItemDto> Items { get; set; } = new();
}

public class UpdateOrderDto
{
    public int CustomerId { get; set; }
    public int? ProjectId { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public DateTime? Deadline { get; set; }
    public int Progress { get; set; }
    public List<CreateOrderItemDto> Items { get; set; } = new();
}