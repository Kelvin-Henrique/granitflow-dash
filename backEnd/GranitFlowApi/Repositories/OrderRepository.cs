using Microsoft.EntityFrameworkCore;
using GranitFlowApi.Data;
using GranitFlowApi.Models;

namespace GranitFlowApi.Repositories;

public class OrderRepository : GenericRepository<Order>, IOrderRepository
{
    public OrderRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<Order>> GetAllAsync()
    {
        return await _dbSet
            .Include(o => o.Customer)
            .Include(o => o.Project)
            .ToListAsync();
    }

    public override async Task<Order?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(o => o.Customer)
            .Include(o => o.Project)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<IEnumerable<Order>> GetByCustomerIdAsync(int customerId)
    {
        return await _dbSet
            .Include(o => o.Customer)
            .Include(o => o.Project)
            .Where(o => o.CustomerId == customerId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> SearchAsync(string searchTerm)
    {
        return await _dbSet
            .Include(o => o.Customer)
            .Include(o => o.Project)
            .Where(o => o.Customer.Name.Contains(searchTerm) || 
                       o.Number.Contains(searchTerm) ||
                       (o.Project != null && o.Project.Name.Contains(searchTerm)))
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetAllWithDetailsAsync()
    {
        return await _dbSet
            .Include(o => o.Customer)
            .Include(o => o.Project)
            .ToListAsync();
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _dbSet.CountAsync();
    }

    public async Task<int> GetPendingOrdersCountAsync()
    {
        return await _dbSet.CountAsync(o => o.Status == "pending" || o.Status == "processing");
    }

    public async Task<decimal> GetTotalRevenueAsync()
    {
        return await _dbSet
            .Where(o => o.Status == "completed" || o.Status == "delivered")
            .SumAsync(o => o.Value);
    }

    public async Task<decimal> GetMonthlyRevenueAsync()
    {
        var currentMonth = DateTime.Now.Month;
        var currentYear = DateTime.Now.Year;
        
        return await _dbSet
            .Where(o => (o.Status == "completed" || o.Status == "delivered") &&
                       o.CreatedAt.Month == currentMonth &&
                       o.CreatedAt.Year == currentYear)
            .SumAsync(o => o.Value);
    }
}