using API.Setup.Swagger;
using API.Middleware;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence.SQL;
using App.Contracts.Persistence;
using App.Services.Auth;
using Infrastructure.Repositories;
using Core.Mappings;
using Core.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Add database context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register AutoMapper
builder.Services.AddAutoMapper(typeof(UserMappingProfile));

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Register services
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<AuthService>();

builder.Services.AddSwaggerServices();

var app = builder.Build();

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
app.UseAuthorization();

app.MapControllers();

app.Run();
