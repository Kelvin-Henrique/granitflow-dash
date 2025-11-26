using Microsoft.EntityFrameworkCore;
using GranitFlowApi.Data;
using GranitFlowApi.Models;

namespace GranitFlowApi.Repositories;

public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
{
    public CustomerRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<Customer>> GetAllAsync()
    {
        return await _dbSet
            .Include(c => c.Projects)
            .ToListAsync();
    }

    public async Task<IEnumerable<Customer>> SearchAsync(string searchTerm)
    {
        return await _dbSet
            .Include(c => c.Projects)
            .Where(c => c.Name.Contains(searchTerm) || 
                       c.Email.Contains(searchTerm) ||
                       c.City.Contains(searchTerm))
            .ToListAsync();
    }

    public async Task<Customer?> GetWithProjectsAsync(int id)
    {
        return await _dbSet
            .Include(c => c.Projects)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _dbSet.CountAsync();
    }
}