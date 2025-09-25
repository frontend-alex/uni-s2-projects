using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using MongoDB.Driver;
using server.Configuration;
using server.Infrastructure.Persistence;
using server.Infrastructure.Security;
using server.Middlewares;
using server.Repositories;
using server.Repositories.Adapters;
using server.Repositories.MSSQL;
using server.Services.auth;
using server.Services.user;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.Configure<Microsoft.AspNetCore.Mvc.ApiBehaviorOptions>(o => o.SuppressModelStateInvalidFilter = true);

builder.Services.AddAppSecurity(builder.Configuration);
builder.Services.AddApiDocumentation();
builder.Services.AddMongo(builder.Configuration);

// Add Entity Framework for MSSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register repositories and services
builder.Services.AddScoped<IUserRepo, UserRepo>(); // MongoDB UserRepo
builder.Services.AddScoped<server.Repositories.MSSQL.IUserRepo, server.Repositories.MSSQL.UserRepo>(); // MSSQL UserRepo

// Register repository adapters based on configuration
var databaseType = DatabaseConfiguration.GetDatabaseType(builder.Configuration);
if (databaseType == DatabaseConfiguration.DatabaseType.MSSQL)
{
    builder.Services.AddScoped<IUserRepository, MSSQLUserRepositoryAdapter>();
}
else
{
    builder.Services.AddScoped<IUserRepository, MongoUserRepositoryAdapter>();
}

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();

var app = builder.Build();

app.UseMiddleware<ErrorHandlerMiddleware>();

app.UseApiDocumentation(app.Environment);

app.UseRouting();

app.MapGet("/health", async (IMongoDatabase mongoDb, ApplicationDbContext sqlDb, CancellationToken ct) =>
{
    await mongoDb.RunCommandAsync((Command<BsonDocument>)"{ ping: 1 }", cancellationToken: ct);
    await sqlDb.Database.CanConnectAsync(ct);
    return Results.Ok(new { mongo = "ok", mssql = "ok" });
}).AllowAnonymous();

app.UseAppSecurity();  

app.MapControllers().RequireAuthorization(); // secure by default

app.Run();
