namespace API.Contracts.Auth;

public class RegisterResponse {
    public string Email { get; set; } = string.Empty;
}

public class OtpResponse {
    public DateTime? ExpiresAt { get; set; }
}