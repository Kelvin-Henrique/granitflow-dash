using GranitFlowApi.Models;

namespace GranitFlowApi.Repositories;

public interface IScheduleEventRepository : IGenericRepository<ScheduleEvent>
{
    Task<IEnumerable<ScheduleEvent>> GetByDateAsync(DateTime date);
    Task<IEnumerable<ScheduleEvent>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<ScheduleEvent>> GetEventsByDateRangeAsync(DateTime startDate, DateTime endDate);
}