using API.Setup.Swagger;
using API.Middleware;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence.SQL;
using App.Contracts.Persistence;
using App.Services.Auth;
using App.Contracts.Security;
using Infrastructure.Repositories;
using Core.Mappings;

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
builder.Services.AddScoped<IOtpRepository, OtpRepository>();

// Register services
builder.Services.AddScoped<App.Contracts.Security.IPasswordService, App.Services.Security.PasswordService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<OtpService>();

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
