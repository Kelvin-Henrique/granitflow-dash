using GranitFlowApi.Models;

namespace GranitFlowApi.Repositories;

public interface IOrderRepository : IGenericRepository<Order>
{
    Task<IEnumerable<Order>> GetByCustomerIdAsync(int customerId);
    Task<IEnumerable<Order>> SearchAsync(string searchTerm);
    Task<IEnumerable<Order>> GetAllWithDetailsAsync();
    Task<int> GetTotalCountAsync();
    Task<int> GetPendingOrdersCountAsync();
    Task<decimal> GetTotalRevenueAsync();
    Task<decimal> GetMonthlyRevenueAsync();
}