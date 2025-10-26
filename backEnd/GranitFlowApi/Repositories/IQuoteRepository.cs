using GranitFlowApi.Models;

namespace GranitFlowApi.Repositories;

public interface IQuoteRepository : IGenericRepository<Quote>
{
    Task<IEnumerable<Quote>> GetByCustomerIdAsync(int customerId);
    Task<Quote?> GetWithItemsAsync(int id);
    Task<IEnumerable<Quote>> SearchAsync(string searchTerm);
    Task<IEnumerable<Quote>> GetAllWithDetailsAsync();
    Task<int> GetTotalCountAsync();
}