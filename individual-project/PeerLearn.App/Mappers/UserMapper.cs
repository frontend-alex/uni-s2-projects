using MongoDB.Bson;
using PeerLearn.Core.DTOs;
using PeerLearn.Core.Entities;
using PeerLearn.Core.Enums;

namespace PeerLearn.App.Mappers;

public static class UserMapper
{
    public static UserDTO ToUserDto(User user)
    {
        return new UserDTO
        {
            Id = user.Id,
            Username = user.Username,
            ProfilePicture = user.ProfilePicture,
            Email = user.Email,
            Role = user.Role,
            Xp = user.Xp,
            EmailVerified = user.EmailVerified,
            HasPassword = user.HasPassword,
            Provider = user.Provider,
            LastLoginAt = user.LastLoginAt,
            OnBoardingCompleted = user.OnBoardingCompleted,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }

    public static User ToUser(CreateUserDTO createUserDto, string hashedPassword)
    {
        return new User
        {
            Id = ObjectId.GenerateNewId(),
            Username = createUserDto.Username,
            ProfilePicture = "https://via.placeholder.com/150",
            Email = createUserDto.Email,
            Role = Role.Student,
            Xp = 0,
            Password = hashedPassword,
            EmailVerified = false,
            HasPassword = true,
            Provider = Provider.Local,
            LastLoginAt = DateTime.UtcNow,
            OnBoardingCompleted = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public static User UpdateUser(User user, UpdateUserDTO updateUserDto)
    {
        if (!string.IsNullOrEmpty(updateUserDto.Username))
            user.Username = updateUserDto.Username;
        
        if (!string.IsNullOrEmpty(updateUserDto.Email))
            user.Email = updateUserDto.Email;
        
        if (updateUserDto.Xp.HasValue)
            user.Xp = updateUserDto.Xp.Value;
        
        if (updateUserDto.OnBoardingCompleted.HasValue)
            user.OnBoardingCompleted = updateUserDto.OnBoardingCompleted.Value;
        
        if (!string.IsNullOrEmpty(updateUserDto.Password))
            user.Password = updateUserDto.Password;
        
        if (!string.IsNullOrEmpty(updateUserDto.ProfilePicture))
            user.ProfilePicture = updateUserDto.ProfilePicture;
        
        if (updateUserDto.HasPassword.HasValue)
            user.HasPassword = updateUserDto.HasPassword.Value;
        
        if (updateUserDto.Role.HasValue)
            user.Role = updateUserDto.Role.Value;
        
        user.UpdatedAt = DateTime.UtcNow;
        
        return user;
    }
}
