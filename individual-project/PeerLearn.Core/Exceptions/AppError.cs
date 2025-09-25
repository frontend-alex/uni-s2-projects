using System.Text.Json.Serialization;

namespace PeerLearn.Core.Exceptions;

public sealed class AppError : Exception
{
    public int StatusCode { get; }
    public string ErrorCode { get; }
    public string? UserMessage { get; }
    [JsonIgnore] 
    public IReadOnlyDictionary<string, object?>? Extra { get; }

    public AppError(
        string message,
        int statusCode,
        string errorCode,
        string? userMessage = null,
        IReadOnlyDictionary<string, object?>? extra = null) : base(message)
    {
        StatusCode = statusCode;
        ErrorCode = errorCode;
        UserMessage = userMessage;
        Extra = extra;

        base.HResult = statusCode;
    }
}

public static class ErrorFactory
{
    public static AppError CreateError(
        string type,
        ErrorOverrides? overrides = null)
    {
        var fallback = new ErrorMessage(
            Message: "Unknown server error",
            StatusCode: 500,
            ErrorCode: "UNKNOWN",
            UserMessage: null
        );

        var baseMsg = ErrorCatalog.ERROR_MESSAGES.TryGetValue(type, out var found)
            ? found
            : fallback;
            

        return new AppError(
            message: baseMsg.Message,
            statusCode: baseMsg.StatusCode,
            errorCode: baseMsg.ErrorCode,
            userMessage: overrides?.UserMessage ?? baseMsg.UserMessage,
            extra: overrides?.Extra
        );
    }
}

public sealed class ErrorOverrides
{
    public string? UserMessage { get; init; }
    public Dictionary<string, object?>? Extra { get; init; }
}

public sealed record ErrorMessage(
    string Message,
    int StatusCode,
    string ErrorCode,
    string? UserMessage
);
