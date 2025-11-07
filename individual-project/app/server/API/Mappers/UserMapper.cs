namespace API.Mappers;

using API.Contracts.User;
using Core.DTOs;

public class UserMapper {
    public static UserResponse ToGetUserResponse(UserDto userDto) {
        return new UserResponse {
            Id = userDto.Id,
            Username = userDto.Username,
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            Email = userDto.Email,
            EmailVerified = userDto.EmailVerified,
            Onboarding = userDto.Onboarding,
            ProfilePicture = userDto.ProfilePicture,
            CreatedAt = userDto.CreatedAt,
            UpdatedAt = userDto.UpdatedAt
        };
    }
}