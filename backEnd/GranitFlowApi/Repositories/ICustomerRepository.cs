using GranitFlowApi.Models;

namespace GranitFlowApi.Repositories;

public interface ICustomerRepository : IGenericRepository<Customer>
{
    Task<IEnumerable<Customer>> SearchAsync(string searchTerm);
    Task<Customer?> GetWithProjectsAsync(int id);
    Task<int> GetTotalCountAsync();
}