using Microsoft.EntityFrameworkCore;
using GranitFlowApi.Data;
using GranitFlowApi.Models;

namespace GranitFlowApi.Repositories;

public class ProjectRepository : GenericRepository<Project>, IProjectRepository
{
    public ProjectRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<Project>> GetAllAsync()
    {
        return await _dbSet
            .Include(p => p.Customer)
            .ToListAsync();
    }

    public override async Task<Project?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Customer)
            .Include(p => p.ProjectMaterials)
                .ThenInclude(pm => pm.Material)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Project>> GetByCustomerIdAsync(int customerId)
    {
        return await _dbSet
            .Include(p => p.Customer)
            .Where(p => p.CustomerId == customerId)
            .ToListAsync();
    }

    public async Task<Project?> GetWithMaterialsAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Customer)
            .Include(p => p.ProjectMaterials)
                .ThenInclude(pm => pm.Material)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Project>> SearchAsync(string searchTerm)
    {
        return await _dbSet
            .Include(p => p.Customer)
            .Where(p => p.Name.Contains(searchTerm) || 
                       p.Customer.Name.Contains(searchTerm) ||
                       p.Location.Contains(searchTerm))
            .ToListAsync();
    }

    public async Task<IEnumerable<Project>> GetAllWithCustomerAsync()
    {
        return await _dbSet
            .Include(p => p.Customer)
            .Include(p => p.Quotes)
            .Include(p => p.Orders)
            .ToListAsync();
    }

    public async Task<Project?> GetWithDetailsAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Customer)
            .Include(p => p.Quotes)
            .Include(p => p.Orders)
            .Include(p => p.ProjectMaterials)
                .ThenInclude(pm => pm.Material)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _dbSet.CountAsync();
    }

    public async Task<int> GetActiveProjectsCountAsync()
    {
        return await _dbSet.CountAsync(p => p.Status == "active" || p.Status == "in_progress");
    }
}