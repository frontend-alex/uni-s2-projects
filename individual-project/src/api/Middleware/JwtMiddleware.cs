using Core.Exceptions;
using System.Security.Claims;
using App.Contracts.Security;

namespace API.Middleware;

public class JwtMiddleware {
    private readonly RequestDelegate _next;

    public JwtMiddleware(RequestDelegate next) {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IJwtService jwtService) {
        // Skip authentication for auth endpoints
        var path = context.Request.Path.Value?.ToLower();

        if (path != null && (path.Contains("/auth/login") || path.Contains("/auth/register"))) {
            await _next(context);
            return;
        }

        var token = context.Request.Cookies["access_token"];

        if (string.IsNullOrEmpty(token)) {
            throw AppException.CreateError("TOKEN_MISSING");
        }

        try {
            var principal = jwtService.ValidateToken(token);
            
            if (principal == null) {
                throw AppException.CreateError("TOKEN_INVALID");
            }

            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) {
                throw AppException.CreateError("TOKEN_INVALID");
            }


            context.Items["nameid"] = userId;

            await _next(context);
        }
        catch {
            throw AppException.CreateError("TOKEN_INVALID");
        }
    }
}
