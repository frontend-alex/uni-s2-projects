using server.Middlewares;
using System.Reflection;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.Configure<Microsoft.AspNetCore.Mvc.ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

// Add Swagger/OpenAPI services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Peer Learn API",
        Version = "v1",
        Description = "API documentation for Peer Learn application - Version 1",
        Contact = new OpenApiContact
        {
            Name = "Peer Learn Team",
            Email = "support@peerlearn.com"
        }
    });

    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Peer Learn API v1");
        c.RoutePrefix = "swagger"; // Set Swagger UI at /swagger
    });
}

app.UseMiddleware<ErrorHandlerMiddleware>();
app.UseHttpsRedirection();

// Configure API routing with version prefix
app.MapControllers();

app.Run();