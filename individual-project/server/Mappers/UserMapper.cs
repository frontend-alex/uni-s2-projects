using MongoDB.Bson;
using server.Contracts.DTOs;
using server.Contracts.Enums;
using server.Models;

namespace server.Mappers;

public static class UserMapper {
    /// <summary>
    /// Maps a CreateUserDTO to a User model for database creation
    /// </summary>
    /// <param name="createUserDto">The DTO containing user creation data</param>
    /// <param name="hashedPassword">The hashed password for the user</param>
    /// <returns>A new User model ready for database insertion</returns>
    public static User ToUser(CreateUserDTO createUserDto, string hashedPassword) {
        var now = DateTime.UtcNow;

        return new User {
            Id = ObjectId.GenerateNewId(),
            Username = createUserDto.Username,
            Email = createUserDto.Email,
            Password = hashedPassword,
            ProfilePicture = "https://www.gravatar.com/avatar/",
            Role = Role.Student,
            Xp = 0,
            EmailVerified = false,
            HasPassword = true,
            Provider = Provider.Local,
            LastLoginAt = now,
            OnBoardingCompleted = false,
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    /// <summary>
    /// Maps a User model to a UserDTO for API responses
    /// </summary>
    /// <param name="user">The User model from the database</param>
    /// <returns>A UserDTO for API responses</returns>
    public static UserDTO ToUserDto(User user) {
        return new UserDTO {
            Id = user.Id,
            ProfilePicture = user.ProfilePicture,
            EmailVerified = user.EmailVerified,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            Xp = user.Xp,
            HasPassword = user.HasPassword,
            Provider = user.Provider,
            LastLoginAt = user.LastLoginAt,
            OnBoardingCompleted = user.OnBoardingCompleted,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }

    /// <summary>
    /// Maps an UpdateUserDTO to update an existing User model
    /// </summary>
    /// <param name="user">The existing User model to update</param>
    /// <param name="updateUserDto">The DTO containing updated user data</param>
    /// <param name="hashedPassword">Optional hashed password if password is being updated</param>
    /// <returns>The updated User model</returns>
    public static User UpdateUser(User user, UpdateUserDTO updateUserDto, string? hashedPassword = null) {
        if (!string.IsNullOrEmpty(updateUserDto.Username))
            user.Username = updateUserDto.Username;

        if (!string.IsNullOrEmpty(updateUserDto.Email))
            user.Email = updateUserDto.Email;

        if (updateUserDto.Xp.HasValue)
            user.Xp = updateUserDto.Xp.Value;

        if (updateUserDto.OnBoardingCompleted.HasValue)
            user.OnBoardingCompleted = updateUserDto.OnBoardingCompleted.Value;

        if (!string.IsNullOrEmpty(updateUserDto.ProfilePicture))
            user.ProfilePicture = updateUserDto.ProfilePicture;

        if (updateUserDto.HasPassword.HasValue)
            user.HasPassword = updateUserDto.HasPassword.Value;

        if (updateUserDto.Role.HasValue)
            user.Role = updateUserDto.Role.Value;

        if (!string.IsNullOrEmpty(hashedPassword))
            user.Password = hashedPassword;

        user.UpdatedAt = DateTime.UtcNow;

        return user;
    }
}
