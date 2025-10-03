namespace API.DTOs.Auth;

using System.ComponentModel.DataAnnotations;

public class LoginRequest {
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

