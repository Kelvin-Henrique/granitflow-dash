namespace GranitFlowApi.DTOs;

public class ScheduleEventDto
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public int? ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Team { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateScheduleEventDto
{
    public string Type { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public int? ProjectId { get; set; }
    public string Time { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Team { get; set; } = string.Empty;
    public string Status { get; set; } = "agendado";
}

public class UpdateScheduleEventDto
{
    public string Type { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public int? ProjectId { get; set; }
    public string Time { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Team { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}