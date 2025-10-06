
namespace Core.Models;

public class User : BaseEntity {
    public string Username { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool EmailVerified { get; set; } = false;
    public bool Onboarding { get; set; } = false;
    public string? ProfilePicture { get; set; }
    public int Xp { get; set; }
}