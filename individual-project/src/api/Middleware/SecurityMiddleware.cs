namespace API.Middleware;

public static class SecurityMiddleware {
    public static IApplicationBuilder UseSecurityMiddleware(this IApplicationBuilder app) {
        app.UseCors("AllowFrontend");
        app.UseMiddleware<JwtMiddleware>();
        return app;
    }
}
