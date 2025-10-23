using System.Text;
using Infrastructure.Services;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Core.Interfaces.Services;

namespace API.Setup.Security;

public static class SecurityExtensions {
    public static IServiceCollection AddSecurityServices(this IServiceCollection services, IConfiguration configuration) {
        services.AddCors(options => {
            options.AddPolicy("AllowFrontend", policy => {
                policy
                    .WithOrigins(
                        "http://localhost:5173",
                        "http://127.0.0.1:5173",
                        "https://localhost:5173",
                        "https://127.0.0.1:5173",
                        "http://localhost:3000",
                        "https://localhost:3000"
                    )
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        // JWT auth: validate token + also read from HttpOnly cookie access token
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => {
                options.TokenValidationParameters = new TokenValidationParameters {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.ASCII.GetBytes(configuration["Jwt:SecretKey"]!)
                    ),
                    ValidateIssuer = true,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = configuration["Jwt:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                // Read JWT from cookie when Authorization header isn't present
                options.Events = new JwtBearerEvents {
                    OnMessageReceived = ctx => {
                        if (string.IsNullOrEmpty(ctx.Token) &&
                            ctx.Request.Cookies.TryGetValue("access_token", out var cookie)) {
                            ctx.Token = cookie;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

        // DI for token issuance/validation used elsewhere 
        services.AddScoped<IJwtService>(provider => {
            var config = provider.GetRequiredService<IConfiguration>();
            return new JwtService(
                config["Jwt:SecretKey"]!,
                config["Jwt:Issuer"]!,
                config["Jwt:Audience"]!,
                int.Parse(config["Jwt:ExpirationMinutes"] ?? "60")
            );
        });

        return services;
    }
}
