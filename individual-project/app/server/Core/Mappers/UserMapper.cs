namespace Core.Mappers;

using Core.DTOs;
using Core.Models;

public class UserMapper {
    public static UserDto ToUserDto(User user) {
        return new UserDto {
            Id = user.Id,
            Username = user.Username,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            EmailVerified = user.EmailVerified,
            Onboarding = user.Onboarding,
            ProfilePicture = user.ProfilePicture,
            Xp = user.Xp,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}