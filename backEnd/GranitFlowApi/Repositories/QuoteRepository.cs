using Microsoft.EntityFrameworkCore;
using GranitFlowApi.Data;
using GranitFlowApi.Models;

namespace GranitFlowApi.Repositories;

public class QuoteRepository : GenericRepository<Quote>, IQuoteRepository
{
    public QuoteRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<Quote>> GetAllAsync()
    {
        return await _dbSet
            .Include(q => q.Customer)
            .Include(q => q.Project)
            .ToListAsync();
    }

    public override async Task<Quote?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(q => q.Customer)
            .Include(q => q.Project)
            .Include(q => q.QuoteItems)
                .ThenInclude(qi => qi.Material)
            .FirstOrDefaultAsync(q => q.Id == id);
    }

    public async Task<IEnumerable<Quote>> GetByCustomerIdAsync(int customerId)
    {
        return await _dbSet
            .Include(q => q.Customer)
            .Include(q => q.Project)
            .Where(q => q.CustomerId == customerId)
            .ToListAsync();
    }

    public async Task<Quote?> GetWithItemsAsync(int id)
    {
        return await _dbSet
            .Include(q => q.Customer)
            .Include(q => q.Project)
            .Include(q => q.QuoteItems)
                .ThenInclude(qi => qi.Material)
            .FirstOrDefaultAsync(q => q.Id == id);
    }

    public async Task<IEnumerable<Quote>> SearchAsync(string searchTerm)
    {
        return await _dbSet
            .Include(q => q.Customer)
            .Include(q => q.Project)
            .Where(q => q.Customer.Name.Contains(searchTerm) || 
                       (q.Project != null && q.Project.Name.Contains(searchTerm)) ||
                       q.Number.Contains(searchTerm))
            .ToListAsync();
    }

    public async Task<IEnumerable<Quote>> GetAllWithDetailsAsync()
    {
        return await _dbSet
            .Include(q => q.Customer)
            .Include(q => q.Project)
            .Include(q => q.QuoteItems)
            .ToListAsync();
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _dbSet.CountAsync();
    }
}