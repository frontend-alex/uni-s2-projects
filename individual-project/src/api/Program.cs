using DotNetEnv;
using API.Middleware;
using API.Setup.Swagger;
using API.Setup.Security;
using Core.Services.User;
using Core.Services.Auth;
using Core.Interfaces.User;
using Core.Interfaces.Auth;
using Infrastructure.Services;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence.SQL;

Env.Load(".env");

var builder = WebApplication.CreateBuilder(args);

// Controllers & JSON
builder.Services.AddControllers()
    .AddJsonOptions(o => {
        o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        o.JsonSerializerOptions.WriteIndented = true;
    });
builder.Services.AddEndpointsApiExplorer();

// Security (CORS + Auth)
builder.Services.AddSecurityServices(builder.Configuration);

// DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        Environment.GetEnvironmentVariable("CONNECTION_STRING")
        ?? builder.Configuration.GetConnectionString("DefaultConnection"))
);

Console.WriteLine("Using connection string: "
    + (Environment.GetEnvironmentVariable("CONNECTION_STRING") ?? builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IOtpRepository, OtpRepository>();

// Services
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<OtpService>();

// Swagger
builder.Services.AddSwaggerServices();

var app = builder.Build();

// Dev-only HTTPS redirect can break preflight if FE uses http.
if (!app.Environment.IsDevelopment()) {
    app.UseHttpsRedirection();
}

// Global error handling should not short-circuit OPTIONS.
app.UseMiddleware<ErrorHandler>();

// Routing first
app.UseRouting();

// CORS must be between routing and auth
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

// Swagger after routing is fine
if (app.Environment.IsDevelopment()) {
    app.UseSwaggerServices(app.Environment);
}

// Endpoints
app.MapControllers();

// Ensure DB created
using (var scope = app.Services.CreateScope()) {
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
}

app.Run();
