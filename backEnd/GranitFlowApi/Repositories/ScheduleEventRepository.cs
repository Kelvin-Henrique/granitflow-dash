using Microsoft.EntityFrameworkCore;
using GranitFlowApi.Data;
using GranitFlowApi.Models;

namespace GranitFlowApi.Repositories;

public class ScheduleEventRepository : GenericRepository<ScheduleEvent>, IScheduleEventRepository
{
    public ScheduleEventRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<ScheduleEvent>> GetAllAsync()
    {
        return await _dbSet
            .Include(se => se.Customer)
            .Include(se => se.Project)
            .ToListAsync();
    }

    public override async Task<ScheduleEvent?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(se => se.Customer)
            .Include(se => se.Project)
            .FirstOrDefaultAsync(se => se.Id == id);
    }

    public async Task<IEnumerable<ScheduleEvent>> GetByDateAsync(DateTime date)
    {
        return await _dbSet
            .Include(se => se.Customer)
            .Include(se => se.Project)
            .Where(se => se.Date.Date == date.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<ScheduleEvent>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Include(se => se.Customer)
            .Include(se => se.Project)
            .Where(se => se.Date.Date >= startDate.Date && se.Date.Date <= endDate.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<ScheduleEvent>> GetEventsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Include(se => se.Customer)
            .Include(se => se.Project)
            .Where(se => se.Date.Date >= startDate.Date && 
                        se.Date.Date <= endDate.Date)
            .ToListAsync();
    }
}