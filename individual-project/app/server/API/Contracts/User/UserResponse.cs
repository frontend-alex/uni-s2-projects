
namespace API.Contracts.User;

public class UserResponse {
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public bool EmailVerified { get; set; }
    public bool Onboarding { get; set; }
    public string? ProfilePicture { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}