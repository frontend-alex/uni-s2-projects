using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using App.Contracts.Security;
using App.Services.Security;

namespace API.Setup.Security;

public static class SecurityExtensions {
    public static IServiceCollection AddSecurityServices(this IServiceCollection services, IConfiguration configuration) {

        services.AddCors(options => {
            options.AddPolicy("AllowFrontend", policy => {
                policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173")
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        // Add JWT Authentication
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => {
                options.TokenValidationParameters = new TokenValidationParameters {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["Jwt:SecretKey"]!)),
                    ValidateIssuer = true,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = configuration["Jwt:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

        // Add JWT Service
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