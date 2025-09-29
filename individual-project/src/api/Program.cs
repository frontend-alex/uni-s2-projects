using API.Setup.Swagger;
using Core.Mappings;
using API.Middleware;
using API.Setup.Security;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence.SQL;
using App.Contracts.Persistence;
using App.Services.Auth;
using Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.WriteIndented = true;
    });
builder.Services.AddEndpointsApiExplorer();

// Add security services (CORS, JWT, etc.)
builder.Services.AddSecurityServices(builder.Configuration);

// Add database context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register AutoMapper
builder.Services.AddAutoMapper(typeof(UserMappingProfile));

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IOtpRepository, OtpRepository>();

// Register services
builder.Services.AddScoped<App.Contracts.Security.IPasswordService, App.Services.Security.PasswordService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<OtpService>();

builder.Services.AddSwaggerServices();

var app = builder.Build();

// Add security middleware (CORS, JWT, etc.)
app.UseSecurityMiddleware();

// Add authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

// Add error handling middleware
app.UseMiddleware<ErrorHandler>();

using (var scope = app.Services.CreateScope()) {
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment()) {
    app.UseSwaggerServices(app.Environment);
}

app.UseHttpsRedirection();
app.UseRouting();

app.MapControllers();

app.Run();
