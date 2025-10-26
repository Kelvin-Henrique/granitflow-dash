using Microsoft.EntityFrameworkCore;
using GranitFlowApi.Data;
using GranitFlowApi.Models;

namespace GranitFlowApi.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }
}