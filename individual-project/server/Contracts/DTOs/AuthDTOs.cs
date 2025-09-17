using MongoDB.Bson;

namespace server.Contracts.DTOs;

public sealed class LoginDTO
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public sealed class ChangePasswordDTO
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public sealed class ResetPasswordDTO
{
    public ObjectId UserId { get; set; } = ObjectId.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public sealed class ForgotPasswordDTO
{
    public string Email { get; set; } = string.Empty;
}
