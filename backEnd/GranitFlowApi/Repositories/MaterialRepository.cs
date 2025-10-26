using Microsoft.EntityFrameworkCore;
using GranitFlowApi.Data;
using GranitFlowApi.Models;

namespace GranitFlowApi.Repositories;

public class MaterialRepository : GenericRepository<Material>, IMaterialRepository
{
    public MaterialRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Material>> GetLowStockAsync()
    {
        return await _dbSet
            .Where(m => m.CurrentStock <= m.MinStock)
            .ToListAsync();
    }

    public async Task<IEnumerable<Material>> SearchAsync(string searchTerm)
    {
        return await _dbSet
            .Where(m => m.Name.Contains(searchTerm) || 
                       m.Type.Contains(searchTerm) ||
                       m.Supplier.Contains(searchTerm))
            .ToListAsync();
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _dbSet.CountAsync();
    }

    public async Task<int> GetLowStockCountAsync()
    {
        return await _dbSet.CountAsync(m => m.CurrentStock <= m.MinStock);
    }
}