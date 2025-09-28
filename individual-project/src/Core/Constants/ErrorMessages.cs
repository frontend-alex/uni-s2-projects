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
            Message = "Invalid email or password.",
            StatusCode = 401,
            ErrorCode = "AUTH_003",
            UserFriendlyMessage = "Your email or password is incorrect. Try again or reset your password."
        },

        // User errors
        ["EMAIL_EXISTS"] = new()
        {
            Message = "This email is already registered.",
            StatusCode = 409,
            ErrorCode = "USER_001",
            UserFriendlyMessage = "An account with this email already exists. Please log in or use a different email."
        },
        ["USER_NOT_FOUND"] = new()
        {
            Message = "User account not found.",
            StatusCode = 404,
            ErrorCode = "USER_002",
            UserFriendlyMessage = "We couldn't find your account. Please check your email or sign up."
        },
        ["USERNAME_EXISTS"] = new()
        {
            Message = "This username is already taken.",
            StatusCode = 409,
            ErrorCode = "USER_003",
            UserFriendlyMessage = "That username is already taken. Please choose a different one."
        },
        ["USER_ALREADY_VERIFIED"] = new()
        {
            Message = "User email is already verified.",
            StatusCode = 409,
            ErrorCode = "USER_004",
            UserFriendlyMessage = "Your email has already been verified. You can log in directly."
        },
        ["USER_LOCKED"] = new()
        {
            Message = "User account is locked due to multiple failed login attempts.",
            StatusCode = 423, // Locked
            ErrorCode = "USER_005",
            UserFriendlyMessage = "Your account is temporarily locked. Please reset your password or try later."
        },
        ["PASSWORD_WEAK"] = new()
        {
            Message = "Password does not meet security requirements.",
            StatusCode = 400,
            ErrorCode = "USER_006",
            UserFriendlyMessage = "Your password is too weak. Please choose a stronger password with letters, numbers, and symbols."
        },
        ["PASSWORD_MISMATCH"] = new()
        {
            Message = "Passwords do not match.",
            StatusCode = 400,
            ErrorCode = "USER_007",
            UserFriendlyMessage = "Your password and confirmation password must match."
        },

        // OTP errors
        ["OTP_NOT_FOUND"] = new()
        {
            Message = "OTP not found for this email.",
            StatusCode = 404,
            ErrorCode = "OTP_001",
            UserFriendlyMessage = "No OTP was found for this email. Please request a new OTP."
        },
        ["OTP_EXPIRED"] = new()
        {
            Message = "OTP has expired.",
            StatusCode = 400,
            ErrorCode = "OTP_002",
            UserFriendlyMessage = "Your OTP has expired. Please request a new one."
        },
        ["INVALID_OTP"] = new()
        {
            Message = "Invalid OTP code.",
            StatusCode = 400,
            ErrorCode = "OTP_003",
            UserFriendlyMessage = "The OTP you entered is incorrect. Please try again."
        },
        ["OTP_TOO_MANY_ATTEMPTS"] = new()
        {
            Message = "Too many invalid OTP attempts.",
            StatusCode = 429, // Too Many Requests
            ErrorCode = "OTP_004",
            UserFriendlyMessage = "You’ve entered the wrong OTP too many times. Please request a new one."
        },
        ["OTP_ALREADY_USED"] = new()
        {
            Message = "OTP has already been consumed.",
            StatusCode = 400,
            ErrorCode = "OTP_005",
            UserFriendlyMessage = "This OTP was already used. Please request a new one."
        },

        // JWT / Token errors
        ["TOKEN_MISSING"] = new()
        {
            Message = "Authorization token is missing.",
            StatusCode = 401,
            ErrorCode = "JWT_001",
            UserFriendlyMessage = "You must provide a valid token to access this resource."
        },
        ["TOKEN_INVALID"] = new()
        {
            Message = "Authorization token is invalid.",
            StatusCode = 401,
            ErrorCode = "JWT_002",
            UserFriendlyMessage = "Your login token is invalid. Please log in again."
        },
        ["TOKEN_EXPIRED"] = new()
        {
            Message = "Authorization token has expired.",
            StatusCode = 401,
            ErrorCode = "JWT_003",
            UserFriendlyMessage = "Your session has expired. Please log in again."
        },
        ["TOKEN_REVOKED"] = new()
        {
            Message = "Authorization token has been revoked.",
            StatusCode = 401,
            ErrorCode = "JWT_004",
            UserFriendlyMessage = "This token is no longer valid. Please log in again."
        },
        ["REFRESH_TOKEN_INVALID"] = new()
        {
            Message = "Refresh token is invalid.",
            StatusCode = 401,
            ErrorCode = "JWT_005",
            UserFriendlyMessage = "Your refresh token is invalid. Please log in again."
        },
        ["REFRESH_TOKEN_EXPIRED"] = new()
        {
            Message = "Refresh token has expired.",
            StatusCode = 401,
            ErrorCode = "JWT_006",
            UserFriendlyMessage = "Your refresh session has expired. Please log in again."
        },

        // Resource / generic errors
        ["RESOURCE_NOT_FOUND"] = new()
        {
            Message = "Requested resource was not found.",
            StatusCode = 404,
            ErrorCode = "GENERIC_001",
            UserFriendlyMessage = "The resource you’re looking for doesn’t exist."
        },
        ["INVALID_INPUT"] = new()
        {
            Message = "One or more inputs are invalid.",
            StatusCode = 400,
            ErrorCode = "GENERIC_002",
            UserFriendlyMessage = "Some of the data you entered is invalid. Please check and try again."
        },
        ["CONFLICT"] = new()
        {
            Message = "The request could not be completed due to a conflict.",
            StatusCode = 409,
            ErrorCode = "GENERIC_003",
            UserFriendlyMessage = "There’s a conflict with the current state of the resource."
        },
        ["RATE_LIMIT_EXCEEDED"] = new()
        {
            Message = "Rate limit exceeded.",
            StatusCode = 429,
            ErrorCode = "GENERIC_004",
            UserFriendlyMessage = "You’re sending too many requests. Please slow down and try again later."
        },
        ["SERVER_ERROR"] = new()
        {
            Message = "An internal server error occurred.",
            StatusCode = 500,
            ErrorCode = "SERVER_001",
            UserFriendlyMessage = "Something went wrong. Please try again later."
        },
        ["SERVICE_UNAVAILABLE"] = new()
        {
            Message = "The service is temporarily unavailable.",
            StatusCode = 503,
            ErrorCode = "SERVER_002",
            UserFriendlyMessage = "The system is under maintenance or overloaded. Please try again later."
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
