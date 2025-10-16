namespace API.DTOs.User;

public class UserDto {
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool EmailVerified { get; set; } = false;
    public string? ProfilePicture { get; set; }
    public bool Onboarding { get; set; } = false;
    public int Xp { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

}


public class UpdateUserDto {
    public string? Username { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Avatar { get; set; }
    public bool? Onboarding { get; set; }
    public string? PasswordHash { get; set; }
    public int? Xp { get; set; }
    public DateTime UpdatedAt { get; set; }
}

