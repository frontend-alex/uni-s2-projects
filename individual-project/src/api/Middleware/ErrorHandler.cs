using System.Text.Json;
using Core.Exceptions;
using Core.Constants;
using Microsoft.AspNetCore.Http;

namespace API.Middleware;

public class ErrorHandler {
    private readonly RequestDelegate _next;

    public ErrorHandler(RequestDelegate next) {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context) {
        try {
            await _next(context);
        }
        catch (Exception ex) {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception) {
        var traceId = context.TraceIdentifier;

        var errorResponse = exception switch {
            AppException appException => new {
                success = false,
                message = appException.Message,
                errorCode = appException.ErrorCode,
                statusCode = appException.StatusCode,
                userFriendlyMessage = appException.UserFriendlyMessage,
                extra = appException.Extra,
                traceId,
                timestamp = DateTime.UtcNow
            },
            _ => new {
                success = false,
                message = "An internal server error occurred.",
                errorCode = "SERVER_ERROR",
                statusCode = 500,
                userFriendlyMessage = "Something went wrong. Please try again later.",
                extra = new Dictionary<string, object>(),
                traceId,
                timestamp = DateTime.UtcNow
            }
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = errorResponse.statusCode;

        var jsonResponse = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        });

        await context.Response.WriteAsync(jsonResponse);
    }
}
