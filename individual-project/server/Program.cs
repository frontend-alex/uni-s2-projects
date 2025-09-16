using MongoDB.Bson;
using MongoDB.Driver;
using server.Infrastructure.Security;
using server.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.Configure<Microsoft.AspNetCore.Mvc.ApiBehaviorOptions>(o => o.SuppressModelStateInvalidFilter = true);

builder.Services.AddAppSecurity(builder.Configuration);
builder.Services.AddApiDocumentation();
builder.Services.AddMongo(builder.Configuration);

var app = builder.Build();

app.UseMiddleware<ErrorHandlerMiddleware>();

// Docs
app.UseApiDocumentation(app.Environment);

app.UseRouting();

app.MapGet("/health", async (IMongoDatabase db, CancellationToken ct) =>
{
    await db.RunCommandAsync((Command<BsonDocument>)"{ ping: 1 }", cancellationToken: ct);
    return Results.Ok(new { mongo = "ok" });
}).AllowAnonymous();

app.UseAppSecurity();  

app.MapControllers().RequireAuthorization(); // secure-by-default

app.Run();
