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

app.MapGet("/api/materials/{id}", async (int id, IMaterialRepository materialRepository) =>
{
    try
    {
        var material = await materialRepository.GetByIdAsync(id);
        
        if (material == null)
            return Results.NotFound(new { message = "Material não encontrado" });
        
        var materialDto = new MaterialDto
        {
            Id = material.Id,
            Name = material.Name,
            Type = material.Type,
            CurrentStock = material.CurrentStock,
            MinStock = material.MinStock,
            UnitCost = material.UnitCost,
            UnitPrice = material.UnitPrice,
            Supplier = material.Supplier,
            Colors = material.Colors,
            LastPurchase = material.LastPurchase
        };
        
        return Results.Ok(materialDto);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

app.MapPost("/api/materials", async (CreateMaterialDto createMaterialDto, IMaterialRepository materialRepository) =>
{
    try
    {
        var material = new Material
        {
            Name = createMaterialDto.Name,
            Type = createMaterialDto.Type,
            CurrentStock = createMaterialDto.CurrentStock,
            MinStock = createMaterialDto.MinStock,
            UnitCost = createMaterialDto.UnitCost,
            UnitPrice = createMaterialDto.UnitPrice,
            Supplier = createMaterialDto.Supplier,
            Colors = createMaterialDto.Colors,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        
        var createdMaterial = await materialRepository.AddAsync(material);
        
        return Results.Created($"/api/materials/{createdMaterial.Id}", new MaterialDto
        {
            Id = createdMaterial.Id,
            Name = createdMaterial.Name,
            Type = createdMaterial.Type,
            CurrentStock = createdMaterial.CurrentStock,
            MinStock = createdMaterial.MinStock,
            UnitCost = createdMaterial.UnitCost,
            UnitPrice = createdMaterial.UnitPrice,
            Supplier = createdMaterial.Supplier,
            Colors = createdMaterial.Colors,
            LastPurchase = createdMaterial.LastPurchase
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

app.MapPut("/api/materials/{id}", async (int id, UpdateMaterialDto updateMaterialDto, IMaterialRepository materialRepository) =>
{
    try
    {
        var existingMaterial = await materialRepository.GetByIdAsync(id);
        
        if (existingMaterial == null)
            return Results.NotFound(new { message = "Material não encontrado" });
        
        existingMaterial.Name = updateMaterialDto.Name;
        existingMaterial.Type = updateMaterialDto.Type;
        existingMaterial.CurrentStock = updateMaterialDto.CurrentStock;
        existingMaterial.MinStock = updateMaterialDto.MinStock;
        existingMaterial.UnitCost = updateMaterialDto.UnitCost;
        existingMaterial.UnitPrice = updateMaterialDto.UnitPrice;
        existingMaterial.Supplier = updateMaterialDto.Supplier;
        existingMaterial.Colors = updateMaterialDto.Colors;
        existingMaterial.UpdatedAt = DateTime.UtcNow;
        
        var updatedMaterial = await materialRepository.UpdateAsync(existingMaterial);
        
        return Results.Ok(new MaterialDto
        {
            Id = updatedMaterial.Id,
            Name = updatedMaterial.Name,
            Type = updatedMaterial.Type,
            CurrentStock = updatedMaterial.CurrentStock,
            MinStock = updatedMaterial.MinStock,
            UnitCost = updatedMaterial.UnitCost,
            UnitPrice = updatedMaterial.UnitPrice,
            Supplier = updatedMaterial.Supplier,
            Colors = updatedMaterial.Colors,
            LastPurchase = updatedMaterial.LastPurchase
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

app.MapDelete("/api/materials/{id}", async (int id, IMaterialRepository materialRepository) =>
{
    try
    {
        var success = await materialRepository.DeleteAsync(id);
        
        if (!success)
            return Results.NotFound(new { message = "Material não encontrado" });
        
        return Results.NoContent();
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

app.MapGet("/api/projects/{id:int}", async (int id, IProjectRepository projectRepository) =>
{
    try
    {
        var project = await projectRepository.GetWithDetailsAsync(id);
        if (project == null)
            return Results.NotFound(new { message = "Projeto não encontrado" });

        var projectDto = new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            CustomerId = project.CustomerId,
            CustomerName = project.Customer?.Name ?? "N/A",
            Status = project.Status,
            Area = project.Area,
            Cost = project.Cost,
            Progress = project.Progress,
            Deadline = project.Deadline,
            Location = project.Location,
            CreatedAt = project.CreatedAt
        };

        return Results.Ok(projectDto);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

app.MapPost("/api/projects", async (CreateProjectDto dto, IProjectRepository projectRepository) =>
{
    try
    {
        var project = new Project
        {
            Name = dto.Name,
            CustomerId = dto.CustomerId,
            Status = dto.Status,
            Area = dto.Area,
            Cost = dto.Cost,
            Deadline = dto.Deadline.HasValue ? DateTime.SpecifyKind(dto.Deadline.Value, DateTimeKind.Utc) : null,
            Location = dto.Location,
            Description = dto.Description,
            Progress = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await projectRepository.AddAsync(project);

        return Results.Created($"/api/projects/{project.Id}", new { id = project.Id, message = "Projeto criado com sucesso" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

app.MapPut("/api/projects/{id:int}", async (int id, UpdateProjectDto dto, IProjectRepository projectRepository) =>
{
    try
    {
        var project = await projectRepository.GetByIdAsync(id);
        if (project == null)
            return Results.NotFound(new { message = "Projeto não encontrado" });

        project.Name = dto.Name;
        project.CustomerId = dto.CustomerId;
        project.Status = dto.Status;
        project.Area = dto.Area;
        project.Cost = dto.Cost;
        project.Progress = dto.Progress;
        project.Deadline = dto.Deadline.HasValue ? DateTime.SpecifyKind(dto.Deadline.Value, DateTimeKind.Utc) : null;
        project.Location = dto.Location;
        project.Description = dto.Description;
        project.UpdatedAt = DateTime.UtcNow;

        await projectRepository.UpdateAsync(project);

        return Results.Ok(new { message = "Projeto atualizado com sucesso" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

app.MapDelete("/api/projects/{id:int}", async (int id, IProjectRepository projectRepository, ApplicationDbContext context) =>
{
    try
    {
        var project = await context.Projects
            .Include(p => p.Orders)
            .Include(p => p.Quotes)
            .FirstOrDefaultAsync(p => p.Id == id);
            
        if (project == null)
            return Results.NotFound(new { message = "Projeto não encontrado" });

        // Verificar se existem OS vinculadas
        if (project.Orders != null && project.Orders.Any())
            return Results.BadRequest(new { message = "Não é possível excluir este projeto pois existem Ordens de Serviço vinculadas a ele" });

        // Verificar se existem orçamentos vinculados
        if (project.Quotes != null && project.Quotes.Any())
        {
            // Desvincular orçamentos antes de excluir
            foreach (var quote in project.Quotes)
            {
                quote.ProjectId = null;
            }
            await context.SaveChangesAsync();
        }

        await projectRepository.DeleteAsync(id);

        return Results.Ok(new { message = "Projeto deletado com sucesso" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

// ==================== QUOTES ENDPOINTS ====================

app.MapGet("/api/quotes", async (IQuoteRepository quoteRepository, string? search = null) =>
{
    try
    {
        var quotes = string.IsNullOrEmpty(search)
            ? await quoteRepository.GetAllWithDetailsAsync()
            : await quoteRepository.SearchAsync(search);

        var quoteDtos = quotes.Select(q => new QuoteDto
        {
            Id = q.Id,
            Number = q.Number,
            CustomerId = q.CustomerId,
            CustomerName = q.Customer?.Name ?? "N/A",
            ProjectId = q.ProjectId,
            ProjectName = q.ProjectName,
            Status = q.Status,
            Value = q.Value,
            ValidUntil = q.ValidUntil,
            CreatedAt = q.CreatedAt,
            Items = q.QuoteItems.Select(item => new QuoteItemDto
            {
                Id = item.Id,
                MaterialId = item.MaterialId,
                Name = item.Name,
                Quantity = decimal.TryParse(item.Quantity, out var qty) ? qty : 0,
                UnitPrice = item.UnitPrice,
                TotalPrice = item.TotalPrice
            }).ToList()
        });

        return Results.Ok(quoteDtos);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

app.MapGet("/api/quotes/{id:int}", async (int id, IQuoteRepository quoteRepository) =>
{
    try
    {
        var quote = await quoteRepository.GetByIdAsync(id);
        if (quote == null)
            return Results.NotFound(new { message = "Orçamento não encontrado" });

        var quoteDto = new QuoteDto
        {
            Id = quote.Id,
            Number = quote.Number,
            CustomerId = quote.CustomerId,
            CustomerName = quote.Customer?.Name ?? "N/A",
            ProjectId = quote.ProjectId,
            ProjectName = quote.ProjectName,
            Status = quote.Status,
            Value = quote.Value,
            ValidUntil = quote.ValidUntil,
            CreatedAt = quote.CreatedAt,
            Items = quote.QuoteItems.Select(item => new QuoteItemDto
            {
                Id = item.Id,
                MaterialId = item.MaterialId,
                Name = item.Name,
                Quantity = decimal.TryParse(item.Quantity, out var qty) ? qty : 0,
                UnitPrice = item.UnitPrice,
                TotalPrice = item.TotalPrice
            }).ToList()
        };

        return Results.Ok(quoteDto);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

app.MapPost("/api/quotes", async (CreateQuoteDto dto, IQuoteRepository quoteRepository, IMaterialRepository materialRepository) =>
{
    try
    {
        // Gerar número do orçamento
        var quoteNumber = $"ORC-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}";

        var quote = new Quote
        {
            Number = quoteNumber,
            CustomerId = dto.CustomerId,
            ProjectId = dto.ProjectId,
            ProjectName = dto.ProjectName,
            Status = dto.Status,
            ValidUntil = DateTime.SpecifyKind(dto.ValidUntil, DateTimeKind.Utc),
            Value = dto.Items.Sum(i => i.TotalPrice),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await quoteRepository.AddAsync(quote);

        // Adicionar itens
        foreach (var itemDto in dto.Items)
        {
            var material = await materialRepository.GetByIdAsync(itemDto.MaterialId);
            var item = new QuoteItem
            {
                QuoteId = quote.Id,
                MaterialId = itemDto.MaterialId,
                Name = material?.Name ?? "Material não encontrado",
                Quantity = itemDto.Quantity.ToString(),
                UnitPrice = itemDto.UnitPrice,
                TotalPrice = itemDto.TotalPrice
            };
            quote.QuoteItems.Add(item);
        }

        await quoteRepository.UpdateAsync(quote);

        return Results.Created($"/api/quotes/{quote.Id}", new { id = quote.Id, number = quote.Number, message = "Orçamento criado com sucesso" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

app.MapPut("/api/quotes/{id:int}", async (int id, UpdateQuoteDto dto, IQuoteRepository quoteRepository, IMaterialRepository materialRepository) =>
{
    try
    {
        var quote = await quoteRepository.GetByIdAsync(id);
        if (quote == null)
            return Results.NotFound(new { message = "Orçamento não encontrado" });

        quote.CustomerId = dto.CustomerId;
        quote.ProjectId = dto.ProjectId;
        quote.ProjectName = dto.ProjectName;
        quote.Status = dto.Status;
        quote.ValidUntil = DateTime.SpecifyKind(dto.ValidUntil, DateTimeKind.Utc);
        quote.Value = dto.Items.Sum(i => i.TotalPrice);
        quote.UpdatedAt = DateTime.UtcNow;

        // Remover itens antigos e adicionar novos
        quote.QuoteItems.Clear();
        foreach (var itemDto in dto.Items)
        {
            var material = await materialRepository.GetByIdAsync(itemDto.MaterialId);
            var item = new QuoteItem
            {
                QuoteId = quote.Id,
                MaterialId = itemDto.MaterialId,
                Name = material?.Name ?? "Material não encontrado",
                Quantity = itemDto.Quantity.ToString(),
                UnitPrice = itemDto.UnitPrice,
                TotalPrice = itemDto.TotalPrice
            };
            quote.QuoteItems.Add(item);
        }

        await quoteRepository.UpdateAsync(quote);

        return Results.Ok(new { message = "Orçamento atualizado com sucesso" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

app.MapDelete("/api/quotes/{id:int}", async (int id, IQuoteRepository quoteRepository) =>
{
    try
    {
        var quote = await quoteRepository.GetByIdAsync(id);
        if (quote == null)
            return Results.NotFound(new { message = "Orçamento não encontrado" });

        await quoteRepository.DeleteAsync(id);

        return Results.Ok(new { message = "Orçamento deletado com sucesso" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

// Aprovar orçamento e converter em projeto
app.MapPost("/api/quotes/{id:int}/approve", async (int id, IQuoteRepository quoteRepository, IProjectRepository projectRepository) =>
{
    try
    {
        var quote = await quoteRepository.GetByIdAsync(id);
        if (quote == null)
            return Results.NotFound(new { message = "Orçamento não encontrado" });

        if (quote.Status == "aprovado")
            return Results.BadRequest(new { message = "Orçamento já foi aprovado" });

        // Atualizar status do orçamento
        quote.Status = "aprovado";
        quote.UpdatedAt = DateTime.UtcNow;

        // Criar projeto a partir do orçamento
        var project = new Project
        {
            Name = quote.ProjectName,
            CustomerId = quote.CustomerId,
            Status = "aprovado",
            Area = 0, // Será preenchido posteriormente
            Cost = quote.Value,
            Description = $"Projeto criado a partir do orçamento {quote.Number}",
            Location = "",
            Progress = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await projectRepository.AddAsync(project);

        // Vincular o projeto ao orçamento
        quote.ProjectId = project.Id;
        await quoteRepository.UpdateAsync(quote);

        return Results.Ok(new { 
            message = "Orçamento aprovado e projeto criado com sucesso",
            projectId = project.Id,
            quoteId = quote.Id
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

// Rejeitar orçamento
app.MapPost("/api/quotes/{id:int}/reject", async (int id, IQuoteRepository quoteRepository) =>
{
    try
    {
        var quote = await quoteRepository.GetByIdAsync(id);
        if (quote == null)
            return Results.NotFound(new { message = "Orçamento não encontrado" });

        quote.Status = "rejeitado";
        quote.UpdatedAt = DateTime.UtcNow;
        await quoteRepository.UpdateAsync(quote);

        return Results.Ok(new { message = "Orçamento rejeitado" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

// ==================== ORDERS (OS) ENDPOINTS ====================

// Get all orders
app.MapGet("/api/orders", async (IOrderRepository orderRepository, ApplicationDbContext context, string? search) =>
{
    try
    {
        var orders = await context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Project)
            .Include(o => o.OrderItems)
            .ToListAsync();

        if (!string.IsNullOrEmpty(search))
        {
            orders = orders.Where(o =>
                o.Number.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                o.Customer.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                (o.Project != null && o.Project.Name.Contains(search, StringComparison.OrdinalIgnoreCase))
            ).ToList();
        }

        var orderDtos = orders.Select(o => new OrderDto
        {
            Id = o.Id,
            Number = o.Number,
            CustomerId = o.CustomerId,
            CustomerName = o.Customer.Name,
            ProjectId = o.ProjectId,
            ProjectName = o.Project?.Name ?? "",
            Status = o.Status,
            Value = o.Value,
            Deadline = o.Deadline,
            Progress = o.Progress,
            CreatedAt = o.CreatedAt,
            Items = o.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                MaterialId = oi.MaterialId,
                Name = oi.Name,
                Quantity = decimal.Parse(oi.Quantity),
                UnitPrice = oi.UnitPrice,
                TotalPrice = oi.TotalPrice
            }).ToList()
        }).ToList();

        return Results.Ok(orderDtos);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

// Get order by ID
app.MapGet("/api/orders/{id}", async (int id, ApplicationDbContext context) =>
{
    try
    {
        var order = await context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Project)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Material)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return Results.NotFound(new { message = "OS não encontrada" });

        var orderDto = new OrderDto
        {
            Id = order.Id,
            Number = order.Number,
            CustomerId = order.CustomerId,
            CustomerName = order.Customer.Name,
            ProjectId = order.ProjectId,
            ProjectName = order.Project?.Name ?? "",
            Status = order.Status,
            Value = order.Value,
            Deadline = order.Deadline,
            Progress = order.Progress,
            CreatedAt = order.CreatedAt,
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                MaterialId = oi.MaterialId,
                Name = oi.Name,
                Quantity = decimal.Parse(oi.Quantity),
                UnitPrice = oi.UnitPrice,
                TotalPrice = oi.TotalPrice
            }).ToList()
        };

        return Results.Ok(orderDto);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

// Create order from approved project
app.MapPost("/api/orders/from-project/{projectId}", async (
    int projectId,
    ApplicationDbContext context) =>
{
    try
    {
        // Validate project exists and is approved
        var project = await context.Projects
            .Include(p => p.Customer)
            .Include(p => p.ProjectMaterials)
                .ThenInclude(pm => pm.Material)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project == null)
            return Results.NotFound(new { message = "Projeto não encontrado" });

        if (project.Status != "aprovado")
            return Results.BadRequest(new { message = "Projeto precisa estar aprovado para criar OS" });

        // Generate order number
        var orderNumber = $"OS-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}";

        // Create order
        var order = new Order
        {
            Number = orderNumber,
            CustomerId = project.CustomerId,
            ProjectId = project.Id,
            Status = "pendente",
            Value = project.Cost,
            Deadline = project.Deadline,
            Progress = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Orders.Add(order);
        await context.SaveChangesAsync();

        // Copy project materials to order items
        foreach (var pm in project.ProjectMaterials)
        {
            var orderItem = new OrderItem
            {
                OrderId = order.Id,
                MaterialId = pm.MaterialId,
                Name = pm.Material.Name,
                Quantity = pm.Quantity.ToString(),
                UnitPrice = pm.Material.UnitPrice,
                TotalPrice = pm.Cost
            };

            context.OrderItems.Add(orderItem);
        }

        await context.SaveChangesAsync();

        // Return created order
        var createdOrder = await context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Project)
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == order.Id);

        var orderDto = new OrderDto
        {
            Id = createdOrder!.Id,
            Number = createdOrder.Number,
            CustomerId = createdOrder.CustomerId,
            CustomerName = createdOrder.Customer.Name,
            ProjectId = createdOrder.ProjectId,
            ProjectName = createdOrder.Project?.Name ?? "",
            Status = createdOrder.Status,
            Value = createdOrder.Value,
            Deadline = createdOrder.Deadline,
            Progress = createdOrder.Progress,
            CreatedAt = createdOrder.CreatedAt,
            Items = createdOrder.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                MaterialId = oi.MaterialId,
                Name = oi.Name,
                Quantity = decimal.Parse(oi.Quantity),
                UnitPrice = oi.UnitPrice,
                TotalPrice = oi.TotalPrice
            }).ToList()
        };

        return Results.Created($"/api/orders/{order.Id}", orderDto);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

// Approve order (creates stock movements and deducts from inventory)
app.MapPost("/api/orders/{id}/approve", async (int id, ApplicationDbContext context) =>
{
    try
    {
        var order = await context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return Results.NotFound(new { message = "OS não encontrada" });

        if (order.Status == "aprovada")
            return Results.BadRequest(new { message = "OS já está aprovada" });

        // Deduct materials from stock
        foreach (var item in order.OrderItems)
        {
            var material = await context.Materials.FindAsync(item.MaterialId);
            if (material == null)
                continue;

            var quantity = decimal.Parse(item.Quantity);

            // Check if enough stock
            if (material.CurrentStock < quantity)
                return Results.BadRequest(new { 
                    message = $"Estoque insuficiente para o material {material.Name}. Disponível: {material.CurrentStock}, Necessário: {quantity}" 
                });

            // Deduct from stock
            material.CurrentStock -= quantity;
            material.UpdatedAt = DateTime.UtcNow;

            // Create stock movement (saida)
            var stockMovement = new StockMovement
            {
                MaterialId = item.MaterialId,
                Type = "saida",
                Quantity = quantity,
                Balance = material.CurrentStock,
                Reference = $"OS {order.Number}",
                ProjectId = order.ProjectId,
                Date = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            context.StockMovements.Add(stockMovement);
        }

        // Update order status
        order.Status = "aprovada";
        order.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        return Results.Ok(new { 
            message = "OS aprovada e materiais baixados do estoque",
            orderId = order.Id,
            orderNumber = order.Number
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Internal server error: {ex.Message}");
    }
}).RequireAuthorization();

// Delete order
app.MapDelete("/api/orders/{id}", async (int id, ApplicationDbContext context) =>
{
    try
    {
        var order = await context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return Results.NotFound(new { message = "OS não encontrada" });

        if (order.Status == "aprovada")
            return Results.BadRequest(new { message = "Não é possível excluir uma OS já aprovada" });

        context.OrderItems.RemoveRange(order.OrderItems);
        context.Orders.Remove(order);
        await context.SaveChangesAsync();

        return Results.Ok(new { message = "OS excluída com sucesso" });
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