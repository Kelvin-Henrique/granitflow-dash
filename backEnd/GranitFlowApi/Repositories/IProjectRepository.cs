using GranitFlowApi.Models;

namespace GranitFlowApi.Repositories;

public interface IProjectRepository : IGenericRepository<Project>
{
    Task<IEnumerable<Project>> GetByCustomerIdAsync(int customerId);
    Task<Project?> GetWithMaterialsAsync(int id);
    Task<IEnumerable<Project>> SearchAsync(string searchTerm);
    Task<IEnumerable<Project>> GetAllWithCustomerAsync();
    Task<Project?> GetWithDetailsAsync(int id);
    Task<int> GetTotalCountAsync();
    Task<int> GetActiveProjectsCountAsync();
}