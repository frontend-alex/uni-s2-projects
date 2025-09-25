namespace PeerLearn.Core.Exceptions;

public static class ErrorCatalog
{
    public static readonly Dictionary<string, ErrorMessage> ERROR_MESSAGES = new()
    {
        ["MISSING_TOKEN"] = new("Missing or invalid authentication token", 401, "MISSING_TOKEN", "Please log in to continue"),
        ["INVALID_ENCRYPTED_TOKEN"] = new("Invalid token format", 401, "INVALID_TOKEN", "Please log in again"),
        ["USER_NOT_FOUND"] = new("User not found", 404, "USER_NOT_FOUND", "User does not exist"),
        ["EMAIL_ALREADY_TAKEN"] = new("Email already exists", 409, "EMAIL_TAKEN", "This email is already registered"),
        ["USERNAME_ALREADY_TAKEN"] = new("Username already exists", 409, "USERNAME_TAKEN", "This username is already taken"),
        ["INVALID_CREDENTIALS"] = new("Invalid login credentials", 401, "INVALID_CREDENTIALS", "Email or password is incorrect"),
        ["ACCOUNT_LOCKED"] = new("Account is locked", 423, "ACCOUNT_LOCKED", "Your account has been temporarily locked"),
        ["EMAIL_NOT_VERIFIED"] = new("Email not verified", 403, "EMAIL_NOT_VERIFIED", "Please verify your email address"),
        ["PASSWORD_TOO_WEAK"] = new("Password does not meet requirements", 400, "PASSWORD_WEAK", "Password must be at least 8 characters with uppercase, lowercase, and number"),
        ["INVALID_EMAIL_FORMAT"] = new("Invalid email format", 400, "INVALID_EMAIL", "Please enter a valid email address"),
        ["UNAUTHORIZED_ACCESS"] = new("Access denied", 403, "UNAUTHORIZED", "You don't have permission to access this resource"),
        ["RESOURCE_NOT_FOUND"] = new("Resource not found", 404, "NOT_FOUND", "The requested resource was not found"),
        ["VALIDATION_ERROR"] = new("Validation failed", 400, "VALIDATION_ERROR", "Please check your input and try again"),
        ["INTERNAL_SERVER_ERROR"] = new("Internal server error", 500, "SERVER_ERROR", "An unexpected error occurred"),
        ["DATABASE_ERROR"] = new("Database operation failed", 500, "DATABASE_ERROR", "A database error occurred"),
        ["EXTERNAL_SERVICE_ERROR"] = new("External service unavailable", 503, "SERVICE_UNAVAILABLE", "External service is temporarily unavailable")
    };
}
