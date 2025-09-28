namespace Core.DTO.Auth;

using System.ComponentModel.DataAnnotations;

public class OtpVerifyRequest {
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(6)]
    public string Code { get; set; } = string.Empty;
}

public class SendOtpRequest {
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}

public class OtpResponse {
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime? ExpiresAt { get; set; }
}