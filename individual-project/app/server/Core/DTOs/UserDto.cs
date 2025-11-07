namespace Core.DTOs;

public class UserDto : BaseDto {
    public string Username { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public bool EmailVerified { get; set; }
    public bool Onboarding { get; set; }
    public string? ProfilePicture { get; set; }
    public int Xp { get; set; } = 0;
}
