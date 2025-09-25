using System.Text.Json;
using PeerLearn.Core.Exceptions;

namespace PeerLearn.API.Middlewares;

public sealed class ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger) {
    private readonly RequestDelegate _next = next;
    private readonly ILogger<ErrorHandlerMiddleware> _logger = logger;

    public async Task Invoke(HttpContext context) {
        try {
            await _next(context);
        }
        catch (Exception ex) {
            await HandleAsync(context, ex);
        }
    }

    private async Task HandleAsync(HttpContext ctx, Exception ex) {
        var ae = ex as AppError; // safe cast, ae is null if ex is not AppError
        bool isAppError = ae != null;

        int statusCode = ae?.StatusCode ?? 500;
        string errorCode = ae?.ErrorCode ?? "UNKNOWN";
        string message = ae?.Message ?? "Internal server error";
        string userMessage = ae?.UserMessage ?? "Something went wrong";

        _logger.LogError(ex, "Failed to handle request: {Error} - {Message}", ex.GetType().Name, ex.Message);

        ctx.Response.ContentType = "application/json";
        ctx.Response.StatusCode = statusCode;

        var basePayload = new Dictionary<string, object?> {
            ["success"] = false,
            ["message"] = message,
            ["errorCode"] = errorCode,
            ["statusCode"] = statusCode,
            ["userMessage"] = userMessage
        };

        if (isAppError && ae!.Extra is not null) {
            foreach (var kv in ae.Extra)
                basePayload[kv.Key] = kv.Value;
        }

        var json = JsonSerializer.Serialize(basePayload, new JsonSerializerOptions {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        });

        await ctx.Response.WriteAsync(json);
    }
}
