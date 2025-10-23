namespace API.Models.Auth;

using System.ComponentModel.DataAnnotations;

public class LoginRequest {
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest {
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;
}

public class OtpRequest {
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}

public class OtpVerificationRequest {
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(6, MinimumLength = 6)]
    public string Otp { get; set; } = string.Empty;
}

public class SendOtpRequest {
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}

public class OtpVerifyRequest {
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(6, MinimumLength = 6)]
    public string Code { get; set; } = string.Empty;
}

public class OtpResponse {
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime? ExpiresAt { get; set; }
}
