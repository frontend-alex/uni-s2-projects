using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using MongoDB.Driver;
using PeerLearn.API.Infrastructure.Security;
using PeerLearn.API.Middlewares;
using PeerLearn.App.Services;
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

// Add Entity Framework for MSSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register repositories and services
builder.Services.AddScoped<IMongoUserRepository, MongoUserRepository>(); // MongoDB UserRepo
builder.Services.AddScoped<IMSSQLUserRepository, MSSQLUserRepository>(); // MSSQL UserRepo

// Register repository adapters based on configuration
var databaseType = builder.Configuration["Database:Type"] ?? "MSSQL";
if (databaseType == "MSSQL")
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
app.UseMiddleware<JwtHandlerMiddleware>(); // Run after routing but before authorization
app.MapControllers().RequireAuthorization(); // secure by default

app.Run();
