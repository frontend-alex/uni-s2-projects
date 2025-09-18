using MongoDB.Bson;
using MongoDB.Driver;
using server.Infrastructure.Security;
using server.Middlewares;
using server.Repositories;
using server.Services.auth;
using server.Services.user;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.Configure<Microsoft.AspNetCore.Mvc.ApiBehaviorOptions>(o => o.SuppressModelStateInvalidFilter = true);

builder.Services.AddAppSecurity(builder.Configuration);
builder.Services.AddApiDocumentation();
builder.Services.AddMongo(builder.Configuration);

// Register repositories and services
builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();

var app = builder.Build();

app.UseMiddleware<ErrorHandlerMiddleware>();

app.UseApiDocumentation(app.Environment);

app.UseRouting();

app.MapGet("/health", async (IMongoDatabase db, CancellationToken ct) => {
    await db.RunCommandAsync((Command<BsonDocument>)"{ ping: 1 }", cancellationToken: ct);
    return Results.Ok(new { mongo = "ok" });
}).AllowAnonymous();

app.UseAppSecurity();
app.UseMiddleware<JwtHandlerMiddleware>(); // Run after routing but before authorization
app.MapControllers().RequireAuthorization(); // secure by default

app.Run();
