using Microsoft.OpenApi.Models;

namespace PeerLearn.API.Infrastructure.Security;


/// <summary>
/// SwaggerExtensions is a class that contains the extensions for the swagger.
/// </summary>
public static class SwaggerExtensions
{
    /// <summary>
    /// AddApiDocumentation is a method that adds the api documentation.
    /// </summary>
    /// <param name="services">The services to add the api documentation to.</param>
    /// <returns>The services with the api documentation added.</returns>
    public static IServiceCollection AddApiDocumentation(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Peer Learn API", Version = "v1" });

            // bearer security once, globally
            var scheme = new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "JWT Authorization header using the Bearer scheme."
            };
            c.AddSecurityDefinition("Bearer", scheme);
            c.AddSecurityRequirement(new OpenApiSecurityRequirement { { scheme, Array.Empty<string>() } });
        });
        return services;
    }

    /// <summary>
    /// UseApiDocumentation is a method that uses the api documentation.
    /// </summary>
    /// <param name="app">The app</param>
    /// <param name="env">The environment.</param>
    /// <returns>The application with the api documentation used.</returns>
    public static IApplicationBuilder UseApiDocumentation(this IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Peer Learn API v1");
                c.RoutePrefix = "swagger";
            });
        }
        return app;
    }
}
