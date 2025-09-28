namespace Core.Constants;

public static class ErrorMessages
{
    public static readonly Dictionary<string, ErrorInfo> Messages = new()
    {
        // Authentication errors
        ["UNAUTHORIZED_ACCESS"] = new()
        {
            Message = "User authentication required.",
            StatusCode = 401,
            ErrorCode = "AUTH_001",
            UserFriendlyMessage = "You must be logged in to access this resource."
        },
        ["FORBIDDEN_ACCESS"] = new()
        {
            Message = "You do not have permission to access this resource.",
            StatusCode = 403,
            ErrorCode = "AUTH_002",
            UserFriendlyMessage = "Access denied. You do not have admin privileges."
        },
        ["INVALID_CREDENTIALS"] = new()
        {
            Message = "Invalid email or password. Please try again.",
            StatusCode = 401,
            ErrorCode = "AUTH_003",
            UserFriendlyMessage = "Your email or password is incorrect. Try again or reset your password."
        },
        ["EMAIL_EXISTS"] = new()
        {
            Message = "This email is already registered.",
            StatusCode = 409,
            ErrorCode = "USER_001",
            UserFriendlyMessage = "An account with this email already exists. Please log in or use a different email."
        },
        ["USERNAME_EXISTS"] = new()
        {
            Message = "This username is already taken.",
            StatusCode = 409,
            ErrorCode = "USER_003",
            UserFriendlyMessage = "This username is already taken. Please choose a different username."
        },
        ["USER_NOT_FOUND"] = new()
        {
            Message = "User account not found. Please verify your email or register.",
            StatusCode = 404,
            ErrorCode = "USER_002",
            UserFriendlyMessage = "We couldn't find your account. Please check your email or sign up."
        },
        ["SERVER_ERROR"] = new()
        {
            Message = "An internal server error occurred.",
            StatusCode = 500,
            ErrorCode = "SERVER_001",
            UserFriendlyMessage = "Something went wrong. Please try again later."
        }
    };
}

public class ErrorInfo
{
    public required string Message { get; set; }
    public required int StatusCode { get; set; }
    public required string ErrorCode { get; set; }
    public required string UserFriendlyMessage { get; set; }
}
