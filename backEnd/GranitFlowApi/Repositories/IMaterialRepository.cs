using GranitFlowApi.Models;

namespace GranitFlowApi.Repositories;

public interface IMaterialRepository : IGenericRepository<Material>
{
    Task<IEnumerable<Material>> GetLowStockAsync();
    Task<IEnumerable<Material>> SearchAsync(string searchTerm);
    Task<int> GetTotalCountAsync();
    Task<int> GetLowStockCountAsync();
}