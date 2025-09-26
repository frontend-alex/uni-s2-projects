using PeerLearn.API.Shared.Utils.JWT;

namespace PeerLearn.API.Middlewares;

public sealed class JwtHandlerMiddleware(RequestDelegate next) {

    private readonly RequestDelegate _next = next;
    public async Task Invoke(HttpContext context) {
        var token = context.Request.Cookies["authCookie"];

        if (token != null) {
            var principal = JWTUtils.ValidateToken(token, context.RequestServices.GetRequiredService<IConfiguration>());

            if (principal != null) {
                context.User = principal;
                Console.WriteLine($"JWT validation successful for user: {principal.Identity?.Name}");
            } else {
                Console.WriteLine("JWT validation failed");
            }
        } else {
            Console.WriteLine("No JWT token found in cookies");
        }

        await _next(context);
    }
}
