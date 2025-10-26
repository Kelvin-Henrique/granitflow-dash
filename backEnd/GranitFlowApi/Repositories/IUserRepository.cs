using GranitFlowApi.Models;

namespace GranitFlowApi.Repositories;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
}