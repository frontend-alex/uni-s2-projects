namespace server.Contracts.DTOs;

using MongoDB.Bson;
using server.Contracts.Enums;

public sealed class UserDTO() {
    public ObjectId Id { get; set; }
    public string ProfilePicture { get; set; }
    public bool EmailVerified { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public Role Role { get; set; }
    public int Xp { get; set; }
    public bool HasPassword { get; set; }
    public Provider Provider { get; set; }
    public DateTime LastLoginAt { get; set; }
    public bool OnBoardingCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}


public sealed class CreateUserDTO() {
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}

public sealed class UpdateUserDTO() {
    public string? Username { get; set; }
    public string? Email { get; set; }
    public int? Xp { get; set; }
    public bool? OnBoardingCompleted { get; set; }
    public string? Password { get; set; }
    public string? ProfilePicture { get; set; }
    public bool? HasPassword { get; set; }
    public Role? Role { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

}