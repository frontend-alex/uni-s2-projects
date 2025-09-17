using server.Errors;

namespace MyApp.Errors;

public static class ErrorCatalog
{
    public static readonly IReadOnlyDictionary<string, ErrorMessage> AUTH_ERRORS =
        new Dictionary<string, ErrorMessage>
    {
        ["UNAUTHORIZED"] = new("Unauthorized access.", 401, "AUTH_001",
            "You must be logged in to perform this action."),
        ["FORBIDDEN_ACCESS"] = new("Forbidden access.", 403, "AUTH_002",
            "You do not have permission to access this resource."),
        ["INVALID_CREDENTIALS"] = new("Invalid email or password.", 401, "AUTH_003",
            "The login information you provided is incorrect."),
        ["INVALID_CURRENT_PASSWORD"] = new("Current password is incorrect.", 400, "AUTH_004",
            "The current password you entered is incorrect."),
        ["SAME_PASSWORD"] = new("New password cannot be the same as the current password.", 400, "AUTH_005",
            "Please choose a different password."),
        ["EMAIL_ALREADY_TAKEN"] = new("Email is already in use.", 400, "AUTH_016",
            "This email is already taken. Please use another."),
        ["ACCOUNT_ALREADY_CONNECTED_WITH_PROVIDER"] = new("Account already registered using a third-party provider.", 400, "AUTH_018",
            "This email is already linked to a social login. Please sign in using that provider instead."),
        ["EMAIL_NOT_VERIFIED"] = new("Email has not been verified.", 403, "AUTH_006",
            "Please verify your email before continuing."),
        ["EMAIL_NOT_PROVIDED"] = new("Email is required.", 400, "AUTH_007",
            "Please provide your email address."),
        ["PASSWORD_MISSING"] = new("Password is required.", 400, "AUTH_008",
            "Please enter your password."),
        ["INVALID_PASSWORD_FORMAT"] = new("Password does not meet requirements.", 400, "AUTH_019",
            "Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters."),
        ["EMAIL_ALREADY_VERIFIED"] = new("Email is already verified.", 400, "AUTH_009",
            "Your email is already verified."),
        ["REGISTRATION_FAILED"] = new("Failed to register user.", 500, "AUTH_010",
            "We couldn’t complete your registration. Please try again."),
        ["LOGIN_FAILED"] = new("Login failed due to invalid credentials or other issues.", 401, "AUTH_011",
            "Login failed. Please check your email and password and try again."),
        ["USER_ALREADY_EXISTS"] = new("User with this email or username already exists.", 400, "AUTH_012",
            "An account with this email or username already exists."),
        ["USERNAME_ALREADY_TAKEN"] = new("Username is already in use.", 400, "AUTH_013",
            "This username is already taken. Please choose another."),
        ["PASSWORD_RESET_FAILED"] = new("Failed to reset password.", 500, "AUTH_014",
            "We couldn’t reset your password. Please try again later."),
        ["ACCOUNT_LOCKED"] = new("Account is locked due to multiple failed login attempts.", 403, "AUTH_015",
            "Your account has been locked. Please try again later or contact support."),
        ["EMAIL_NOT_REGISTERED"] = new("Email is not registered.", 404, "AUTH_017",
            "We couldn’t find an account with this email address.")
    };

    public static readonly IReadOnlyDictionary<string, ErrorMessage> JWT_ERRORS =
        new Dictionary<string, ErrorMessage>
    {
        ["MISSING_TOKEN"] = new("Authorization token is missing.", 401, "JWT_000",
            "Please provide a valid authorization token."),
        ["INVALID_TOKEN"] = new("Invalid or expired token.", 401, "JWT_001",
            "Your session has expired. Please log in again."),
        ["INVALID_REFRESH_TOKEN"] = new("Invalid or expired refresh token.", 401, "JWT_002",
            "Your session has expired. Please log in again."),
        ["REFRESH_FAILED"] = new("Token refresh failed.", 403, "JWT_003",
            "We couldn't refresh your session. Please log in again."),
        ["INVALID_ENCRYPTED_TOKEN"] = new("Invalid encrypted token.", 400, "JWT_004",
            "Authentication failed. Please try logging in again.")
    };

    public static readonly IReadOnlyDictionary<string, ErrorMessage> OTP_ERRORS =
        new Dictionary<string, ErrorMessage>
    {
        ["OTP_EXPIRED"] = new("OTP has expired.", 400, "OTP_001",
            "Your OTP has expired. Please request a new one."),
        ["INVALID_OTP"] = new("Invalid OTP code.", 400, "OTP_002",
            "The OTP code you entered is invalid."),
        ["OTP_NOT_FOUND"] = new("OTP not found.", 404, "OTP_003",
            "No OTP was found for your request. Please try again.")
    };

    public static readonly IReadOnlyDictionary<string, ErrorMessage> STRIPE_ERRORS =
        new Dictionary<string, ErrorMessage>
    {
        ["PAYMENT_FAILED"] = new("Payment processing failed.", 402, "STRIPE_001",
            "Your payment could not be processed. Please try again."),
        ["INVOICE_CREATION_FAILED"] = new("Invoice creation failed.", 500, "STRIPE_002",
            "We couldn't create your invoice. Please try again."),
        ["SUBSCRIPTION_CREATION_FAILED"] = new("Subscription creation failed.", 500, "STRIPE_003",
            "Failed to create your subscription. Please try again."),
        ["INVALID_PLAN_ID"] = new("Invalid Stripe plan ID.", 400, "STRIPE_004",
            "The selected plan is not valid. Please choose another."),
        ["CUSTOMER_CREATION_FAILED"] = new("Stripe customer creation failed.", 500, "STRIPE_005",
            "We couldn’t create your customer profile. Please try again."),
        ["SUBSCRIPTION_UPGRADE_REQUIRED"] = new("Upgrade required for this feature.", 403, "STRIPE_006",
            "Please upgrade your plan to access this feature.")
    };

    public static readonly IReadOnlyDictionary<string, ErrorMessage> GOOGLE_ERRORS =
        new Dictionary<string, ErrorMessage>
    {
        ["GOOGLE_AUTH_FAILED"] = new("Google authentication failed.", 401, "GOOGLE_001",
            "We couldn’t sign you in with Google. Try again or use another method.")
    };

    public static readonly IReadOnlyDictionary<string, ErrorMessage> USER_ERRORS =
        new Dictionary<string, ErrorMessage>
    {
        ["USER_NOT_FOUND"] = new("User not found.", 404, "USER_001",
            "We couldn’t find a user with that information."),
        ["NO_UPDATES_PROVIDED"] = new("No update fields provided.", 400, "USER_002",
            "Please provide at least one field to update.")
    };

    public static readonly IReadOnlyDictionary<string, ErrorMessage> EMAIL_ERRORS =
        new Dictionary<string, ErrorMessage>
    {
        ["EMAIL_SENDING_FAILED"] = new("Failed to send email.", 500, "EMAIL_001",
            "We couldn’t send the email. Please try again later.")
    };

    public static readonly IReadOnlyDictionary<string, ErrorMessage> DATABASE_ERRORS =
        new Dictionary<string, ErrorMessage>
    {
        ["DATABASE_ERROR"] = new("A database error occurred.", 500, "DB_001",
            "There was a problem accessing the database. Try again later.")
    };

    public static readonly IReadOnlyDictionary<string, ErrorMessage> NOTIFICATION_ERRORS =
        new Dictionary<string, ErrorMessage>
    {
        ["NOTIFICATION_CREATION_FAILED"] = new("Failed to create notification.", 500, "NOTIF_001",
            "We couldn’t create the notification. Please try again.")
    };

    // Merge into one master object
    public static readonly IReadOnlyDictionary<string, ErrorMessage> ERROR_MESSAGES =
        new[] {
            AUTH_ERRORS, JWT_ERRORS, OTP_ERRORS, STRIPE_ERRORS, GOOGLE_ERRORS,
            USER_ERRORS, EMAIL_ERRORS, DATABASE_ERRORS, NOTIFICATION_ERRORS
        }
        .SelectMany(d => d)
        .ToDictionary(kv => kv.Key, kv => kv.Value, StringComparer.OrdinalIgnoreCase);
}
