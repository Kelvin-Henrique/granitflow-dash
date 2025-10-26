namespace GranitFlowApi.DTOs;

public class ProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Area { get; set; }
    public decimal Cost { get; set; }
    public int Progress { get; set; }
    public DateTime? Deadline { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int ImageCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<ProjectMaterialDto> Materials { get; set; } = new();
}

public class ProjectMaterialDto
{
    public int MaterialId { get; set; }
    public string MaterialName { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal Cost { get; set; }
}

public class CreateProjectDto
{
    public string Name { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string Status { get; set; } = "em_medicao";
    public decimal Area { get; set; }
    public decimal Cost { get; set; }
    public DateTime? Deadline { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class UpdateProjectDto
{
    public string Name { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Area { get; set; }
    public decimal Cost { get; set; }
    public int Progress { get; set; }
    public DateTime? Deadline { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int ImageCount { get; set; }
}