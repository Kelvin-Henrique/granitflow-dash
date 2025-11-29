using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using GranitFlowApi.Data;
using GranitFlowApi.DTOs;
using GranitFlowApi.Models;
using GranitFlowApi.Repositories;
using GranitFlowApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

// Configure PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new ArgumentNullException("JWT SecretKey not found");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwtSettings["Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173", 
                "http://localhost:3000", 
                "http://localhost:8080",
                "http://72.61.58.169:3000",
                "http://72.61.58.169:8080")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Register services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<IMaterialRepository, MaterialRepository>();
builder.Services.AddScoped<IQuoteRepository, QuoteRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IScheduleEventRepository, ScheduleEventRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

// Authentication endpoints
app.MapPost("/api/auth/login", async (LoginDto loginDto, IAuthService authService) =>
{
    try
    {
        var result = await authService.LoginAsync(loginDto);
        return result == null ? Results.BadRequest(new { message = "Invalid credentials" }) : Results.Ok(result);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
});

app.MapPost("/api/auth/register", async (RegisterDto registerDto, IAuthService authService) =>
{
    try
    {
        var result = await authService.RegisterAsync(registerDto);
        return result == null ? Results.BadRequest(new { message = "User already exists" }) : Results.Ok(result);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
});

app.MapGet("/api/auth/me", async (IAuthService authService, HttpContext context) =>
{
    try
    {
        var userIdClaim = context.User.FindFirst("user_id")?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
            return Results.Unauthorized();
        
        var user = await authService.GetUserByIdAsync(userId);
        return user == null ? Results.NotFound() : Results.Ok(user);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

// Customer endpoints
app.MapGet("/api/customers", async (ICustomerRepository customerRepository, string? search = null) =>
{
    try
    {
        var customers = string.IsNullOrEmpty(search) 
            ? await customerRepository.GetAllAsync()
            : await customerRepository.SearchAsync(search);
        
        var customerDtos = customers.Select(c => new CustomerDto
        {
            Id = c.Id,
            Name = c.Name,
            Email = c.Email,
            Phone = c.Phone,
            CpfCnpj = c.CpfCnpj,
            Status = c.Status,
            Address = c.Address,
            City = c.City,
            State = c.State,
            ZipCode = c.ZipCode,
            CreatedAt = c.CreatedAt,
            LastContact = c.LastContact,
            Notes = c.Notes,
            ProjectsCount = c.Projects.Count
        });
        
        return Results.Ok(customerDtos);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

app.MapGet("/api/customers/{id}", async (int id, ICustomerRepository customerRepository) =>
{
    try
    {
        var customer = await customerRepository.GetWithProjectsAsync(id);
        
        if (customer == null)
            return Results.NotFound(new { message = "Cliente não encontrado" });
        
        var customerDto = new CustomerDto
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email,
            Phone = customer.Phone,
            CpfCnpj = customer.CpfCnpj,
            Status = customer.Status,
            Address = customer.Address,
            City = customer.City,
            State = customer.State,
            ZipCode = customer.ZipCode,
            CreatedAt = customer.CreatedAt,
            LastContact = customer.LastContact,
            Notes = customer.Notes,
            ProjectsCount = customer.Projects?.Count ?? 0
        };
        
        return Results.Ok(customerDto);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

app.MapPost("/api/customers", async (CreateCustomerDto createCustomerDto, ICustomerRepository customerRepository) =>
{
    try
    {
        var customer = new Customer
        {
            Name = createCustomerDto.Name,
            Email = createCustomerDto.Email,
            Phone = createCustomerDto.Phone,
            CpfCnpj = createCustomerDto.CpfCnpj,
            Status = createCustomerDto.Status,
            Address = createCustomerDto.Address,
            City = createCustomerDto.City,
            State = createCustomerDto.State,
            ZipCode = createCustomerDto.ZipCode,
            Notes = createCustomerDto.Notes,
            CreatedAt = DateTime.UtcNow,
            LastContact = DateTime.UtcNow
        };
        
        var createdCustomer = await customerRepository.AddAsync(customer);
        
        return Results.Created($"/api/customers/{createdCustomer.Id}", new CustomerDto
        {
            Id = createdCustomer.Id,
            Name = createdCustomer.Name,
            Email = createdCustomer.Email,
            Phone = createdCustomer.Phone,
            CpfCnpj = createdCustomer.CpfCnpj,
            Status = createdCustomer.Status,
            Address = createdCustomer.Address,
            City = createdCustomer.City,
            State = createdCustomer.State,
            ZipCode = createdCustomer.ZipCode,
            CreatedAt = createdCustomer.CreatedAt,
            LastContact = createdCustomer.LastContact,
            Notes = createdCustomer.Notes,
            ProjectsCount = 0
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

app.MapPut("/api/customers/{id}", async (int id, CreateCustomerDto updateCustomerDto, ICustomerRepository customerRepository) =>
{
    try
    {
        var existingCustomer = await customerRepository.GetByIdAsync(id);
        
        if (existingCustomer == null)
            return Results.NotFound(new { message = "Cliente não encontrado" });
        
        existingCustomer.Name = updateCustomerDto.Name;
        existingCustomer.Email = updateCustomerDto.Email;
        existingCustomer.Phone = updateCustomerDto.Phone;
        existingCustomer.CpfCnpj = updateCustomerDto.CpfCnpj;
        existingCustomer.Status = updateCustomerDto.Status;
        existingCustomer.Address = updateCustomerDto.Address;
        existingCustomer.City = updateCustomerDto.City;
        existingCustomer.State = updateCustomerDto.State;
        existingCustomer.ZipCode = updateCustomerDto.ZipCode;
        existingCustomer.Notes = updateCustomerDto.Notes;
        
        var updatedCustomer = await customerRepository.UpdateAsync(existingCustomer);
        
        return Results.Ok(new CustomerDto
        {
            Id = updatedCustomer.Id,
            Name = updatedCustomer.Name,
            Email = updatedCustomer.Email,
            Phone = updatedCustomer.Phone,
            CpfCnpj = updatedCustomer.CpfCnpj,
            Status = updatedCustomer.Status,
            Address = updatedCustomer.Address,
            City = updatedCustomer.City,
            State = updatedCustomer.State,
            ZipCode = updatedCustomer.ZipCode,
            CreatedAt = updatedCustomer.CreatedAt,
            LastContact = updatedCustomer.LastContact,
            Notes = updatedCustomer.Notes,
            ProjectsCount = updatedCustomer.Projects?.Count ?? 0
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

app.MapDelete("/api/customers/{id}", async (int id, ICustomerRepository customerRepository) =>
{
    try
    {
        var success = await customerRepository.DeleteAsync(id);
        
        if (!success)
            return Results.NotFound(new { message = "Cliente não encontrado" });
        
        return Results.NoContent();
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

// Materials endpoints
app.MapGet("/api/materials", async (IMaterialRepository materialRepository, string? search = null) =>
{
    try
    {
        var materials = string.IsNullOrEmpty(search) 
            ? await materialRepository.GetAllAsync()
            : await materialRepository.SearchAsync(search);
        
        var materialDtos = materials.Select(m => new MaterialDto
        {
            Id = m.Id,
            Name = m.Name,
            Type = m.Type,
            CurrentStock = m.CurrentStock,
            MinStock = m.MinStock,
            UnitCost = m.UnitCost,
            UnitPrice = m.UnitPrice,
            Supplier = m.Supplier,
            Colors = m.Colors,
            LastPurchase = m.LastPurchase
        });
        
        return Results.Ok(materialDtos);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

// Projects endpoints
app.MapGet("/api/projects", async (IProjectRepository projectRepository, string? search = null) =>
{
    try
    {
        var projects = string.IsNullOrEmpty(search) 
            ? await projectRepository.GetAllWithCustomerAsync()
            : await projectRepository.SearchAsync(search);
        
        var projectDtos = projects.Select(p => new ProjectDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            CustomerId = p.CustomerId,
            CustomerName = p.Customer?.Name ?? "N/A",
            Status = p.Status,
            Area = p.Area,
            Cost = p.Cost,
            Progress = p.Progress,
            Deadline = p.Deadline,
            Location = p.Location,
            CreatedAt = p.CreatedAt
        });
        
        return Results.Ok(projectDtos);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

// Dashboard stats endpoint
app.MapGet("/api/dashboard/stats", async (
    ICustomerRepository customerRepository,
    IProjectRepository projectRepository,
    IMaterialRepository materialRepository,
    IOrderRepository orderRepository,
    IQuoteRepository quoteRepository) =>
{
    try
    {
        var stats = new
        {
            CustomersCount = await customerRepository.GetTotalCountAsync(),
            ProjectsCount = await projectRepository.GetTotalCountAsync(),
            ActiveProjectsCount = await projectRepository.GetActiveProjectsCountAsync(),
            OrdersCount = await orderRepository.GetTotalCountAsync(),
            PendingOrdersCount = await orderRepository.GetPendingOrdersCountAsync(),
            QuotesCount = await quoteRepository.GetTotalCountAsync(),
            MaterialsCount = await materialRepository.GetTotalCountAsync(),
            LowStockMaterialsCount = await materialRepository.GetLowStockCountAsync(),
            TotalRevenue = await orderRepository.GetTotalRevenueAsync(),
            MonthlyRevenue = await orderRepository.GetMonthlyRevenueAsync()
        };
        
        return Results.Ok(stats);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

// Create database and run migrations if needed
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await context.Database.EnsureCreatedAsync();
}

app.Run();