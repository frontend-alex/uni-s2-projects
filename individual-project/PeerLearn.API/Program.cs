using FluentValidation;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using MongoDB.Driver;
using PeerLearn.API.Infrastructure.Security;
using PeerLearn.API.Middlewares;
using PeerLearn.API.Validators;
using PeerLearn.App.Services;
using PeerLearn.Core.DTOs;
using PeerLearn.Core.Interfaces;
using PeerLearn.Infrastructure.Data;
using PeerLearn.Infrastructure.Repositories;
using PeerLearn.Infrastructure.Repositories.Adapters;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.Configure<Microsoft.AspNetCore.Mvc.ApiBehaviorOptions>(o => o.SuppressModelStateInvalidFilter = true);

builder.Services.AddAppSecurity(builder.Configuration);
builder.Services.AddApiDocumentation();
builder.Services.AddMongo(builder.Configuration);

// Get database type from configuration
var databaseType = builder.Configuration["Database:Type"] ?? "MSSQL";
Console.WriteLine($"Database Type from configuration: {databaseType}");

if (databaseType == "MSSQL")
{
    // Add Entity Framework for MSSQL only when MSSQL is selected
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

    builder.Services.AddScoped<IMSSQLUserRepository, MSSQLUserRepository>();
    builder.Services.AddScoped<IUserRepository, MSSQLUserRepositoryAdapter>();
}
else
{
    // MongoDB setup
    builder.Services.AddScoped<IMongoUserRepository, MongoUserRepository>();
    builder.Services.AddScoped<IUserRepository, MongoUserRepositoryAdapter>();
}

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();

// Add FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<LoginDTOValidator>();

// Register validators
builder.Services.AddScoped<IValidator<LoginDTO>, LoginDTOValidator>();
builder.Services.AddScoped<IValidator<ForgotPasswordDTO>, ForgotPasswordDTOValidator>();
builder.Services.AddScoped<IValidator<ResetPasswordDTO>, ResetPasswordDTOValidator>();
builder.Services.AddScoped<IValidator<ChangePasswordDTO>, ChangePasswordDTOValidator>();
builder.Services.AddScoped<IValidator<UpdateUserDTO>, UpdateUserDTOValidator>();
builder.Services.AddScoped<IValidator<CreateUserDTO>, CreateUserDTOValidator>();

var app = builder.Build();

app.UseMiddleware<ErrorHandlerMiddleware>();
app.UseModelValidation();

app.UseApiDocumentation(app.Environment);

app.UseRouting();

app.MapGet("/health", async (IServiceProvider services, CancellationToken ct) =>
{
    var databaseType = app.Configuration["Database:Type"] ?? "MSSQL";
    Console.WriteLine($"Health check - Database Type: {databaseType}");

    if (databaseType == "MSSQL")
    {
        var sqlDb = services.GetRequiredService<ApplicationDbContext>();
        await sqlDb.Database.CanConnectAsync(ct);
        return Results.Ok(new { database = "mssql", status = "ok" });
    }
    else
    {
        var mongoDb = services.GetRequiredService<IMongoDatabase>();
        await mongoDb.RunCommandAsync((Command<BsonDocument>)"{ ping: 1 }", cancellationToken: ct);
        return Results.Ok(new { database = "mongodb", status = "ok" });
    }
}).AllowAnonymous();

app.UseAppSecurity();
app.UseMiddleware<JwtHandlerMiddleware>(); // Run after routing but before authorization
app.MapControllers().RequireAuthorization(); // secure by default

app.Run();
