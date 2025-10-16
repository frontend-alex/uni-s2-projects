using Core.Constants;

namespace Core.Exceptions;

public class AppException : Exception {
    public int StatusCode { get; }
    public string ErrorCode { get; }
    public string UserFriendlyMessage { get; }
    public Dictionary<string, object> Extra { get; }

    public AppException(string message, int statusCode, string errorCode, string userFriendlyMessage, Dictionary<string, object>? extra = null)
        : base(message) {
        StatusCode = statusCode;
        ErrorCode = errorCode;
        UserFriendlyMessage = userFriendlyMessage;
        Extra = extra ?? [];
    }

    public static AppException CreateError(string errorType, Dictionary<string, object>? extra = null) {
        if (!ErrorMessages.Messages.TryGetValue(errorType, out var errorInfo)) {
            errorInfo = ErrorMessages.Messages["SERVER_ERROR"];
        }

        return new AppException(
            errorInfo.Message,
            errorInfo.StatusCode,
            errorInfo.ErrorCode,
            errorInfo.UserFriendlyMessage,
            extra
        );
    }
}

