using server.Errors;
using server.Shared.Utils.JWT;

namespace server.Middlewares;

public sealed class JwtHandlerMiddleware(RequestDelegate next) {

    private readonly RequestDelegate _next = next;

    public async Task Invoke(HttpContext context) {
        var token = context.Request.Cookies["authCookie"];

        if (token == null)
            throw ErrorFactory.CreateError("INVALID_TOKEN");

        var principal = JWTUtils.ValidateToken(token, context.RequestServices.GetRequiredService<IConfiguration>());

        if (principal == null)
            throw ErrorFactory.CreateError("INVALID_TOKEN");

        context.User = principal;

        await _next(context);

    }
}