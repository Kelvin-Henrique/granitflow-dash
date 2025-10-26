using BC = BCrypt.Net.BCrypt;
using GranitFlowApi.DTOs;
using GranitFlowApi.Models;
using GranitFlowApi.Repositories;

namespace GranitFlowApi.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
    Task<UserDto?> GetUserByIdAsync(int userId);
}

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public AuthService(IUserRepository userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
    {
        var user = await _userRepository.GetByEmailAsync(loginDto.Email);
        
        if (user == null || !user.IsActive || !BC.Verify(loginDto.Password, user.PasswordHash))
        {
            return null;
        }

        var token = _jwtService.GenerateToken(user);
        
        return new AuthResponseDto
        {
            Token = token,
            User = MapToUserDto(user)
        };
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
    {
        // Check if user already exists
        var existingUser = await _userRepository.GetByEmailAsync(registerDto.Email);
        if (existingUser != null)
        {
            return null;
        }

        var user = new User
        {
            Name = registerDto.Name,
            Email = registerDto.Email,
            PasswordHash = BC.HashPassword(registerDto.Password),
            Role = registerDto.Role,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsActive = true
        };

        var createdUser = await _userRepository.AddAsync(user);
        var token = _jwtService.GenerateToken(createdUser);

        return new AuthResponseDto
        {
            Token = token,
            User = MapToUserDto(createdUser)
        };
    }

    public async Task<UserDto?> GetUserByIdAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        return user != null ? MapToUserDto(user) : null;
    }

    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        };
    }
}