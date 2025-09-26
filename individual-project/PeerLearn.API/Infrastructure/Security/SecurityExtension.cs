using System.Text;
using System.Threading.RateLimiting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication;
using PeerLearn.Infrastructure.Data;

namespace PeerLearn.API.Infrastructure.Security;


/// <summary>
/// SecurityExtensions is a class that contains the extensions for the security.
/// </summary>
public static class SecurityExtensions
{
    /// <summar>
    /// AddAppSecurity is a method that adds the security.
    /// </summar>
    /// <param name="services">The services to add the security to.</param>
    /// <param name="config">The configuration to use.</param>
    /// <returns>The services with the security added.</returns>
    public static IServiceCollection AddAppSecurity(this IServiceCollection services, IConfiguration config)
    {
        services.Configure<JwtOptions>(config.GetSection(JwtOptions.SectionName));
        services.AddJwtAuth();
        services.AddAuthorizationPolicies();
        services.AddCorsPolicies(config);
        services.AddRateLimitingPolicies();
        return services;
    }

    /// <summary>
    /// UseAppSecurity is a method that uses the security.
    /// </summary>
    /// <param name="app">The application to use the security on.</param>
    /// <returns>The application with the security used.</returns>
    public static IApplicationBuilder UseAppSecurity(this IApplicationBuilder app)
    {
        app.UseHttpsRedirection();
        app.UseCors("Default");        // after routing in minimal APIs
        app.UseRateLimiter();          // .NET 8
        app.UseAuthentication();
        app.UseAuthorization();
        return app;
    }

    private static IServiceCollection AddJwtAuth(this IServiceCollection services)
    {

        var jwt = services.BuildServiceProvider().GetRequiredService<IOptions<JwtOptions>>().Value;

        services.AddAuthentication(o =>
        {
            o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(o =>
        {
            o.TokenValidationParameters = new()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = "PeerLearn",
                ValidAudience = "PeerLearnUsers",
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key))
            };
        });
        return services;
    }

    /// <summary>
    /// AddAuthorizationPolicies is a method that adds the authorization policies.
    /// </summary>
    /// <param name="services">The services to add the authorization policies to.</param>
    /// <returns>The services with the authorization policies added.</returns>
    public static IServiceCollection AddAuthorizationPolicies(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", p => p.RequireRole("admin"));

            options.AddPolicy("CanManageRooms", p =>
                p.RequireClaim("permissions", "rooms:manage"));
        });

        return services;
    }


    /// <summary>
    /// AddCorsPolicies is a method that adds the cors policies.
    /// </summary>
    /// <param name="services">The services to add the cors policies to.</param>
    /// <param name="config">The configuration to use.</param>
    /// <returns>The services with the cors policies added.</returns>
    public static IServiceCollection AddCorsPolicies(this IServiceCollection services, IConfiguration config)
    {
        var origins = config.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
        services.AddCors(o =>
        {
            o.AddPolicy("Default", b => b
                .WithOrigins(origins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials());
        });
        return services;
    }


    /// <summary>
    /// AddRateLimitingPolicies is a method that adds the rate limiting policies.
    /// </summary>
    /// <param name="services">The services to add the rate limiting policies to.</param>
    /// <returns>The services with the rate limiting policies added.</returns>
    public static IServiceCollection AddRateLimitingPolicies(this IServiceCollection services)
    {
        services.AddRateLimiter(o =>
        {
            o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            o.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(ctx =>
            {
                var key = ctx.User.Identity?.Name ?? ctx.Connection.RemoteIpAddress?.ToString() ?? "anon";
                return RateLimitPartition.GetFixedWindowLimiter(key, _ => new()
                {
                    PermitLimit = 100,
                    Window = TimeSpan.FromMinutes(1),
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                    QueueLimit = 0
                });
            });
        });
        return services;
    }
}

