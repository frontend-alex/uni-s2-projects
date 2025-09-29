using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace API.Setup.Security;

public static class SecurityExtensions {
    public static IServiceCollection AddSecurityServices(this IServiceCollection services) {

        services.AddCors(options => {
            options.AddPolicy("AllowFrontend", policy => {
                policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173")
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        return services;
    }

}