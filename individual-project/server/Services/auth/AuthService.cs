using MongoDB.Bson;
using server.Contracts.DTOs;
using server.Errors;
using server.Mappers;
using server.Models;
using server.Repositories;
using server.Shared.Utils.Auth;

namespace server.Services.auth;

/// <summary>
/// Service for handling authentication operations
/// </summary>
public class AuthService {
    private readonly IUserRepo _userRepo;

    public AuthService(IUserRepo userRepo) {
        _userRepo = userRepo;
    }

    /// <summary>
    /// Verifies user credentials for login
    /// </summary>
    /// <param name="email">User email</param>
    /// <param name="password">Plain text password</param>
    /// <returns>User DTO if credentials are valid, null otherwise</returns>
    public async Task<UserDTO?> Login(string email, string password) {
        User? user = await _userRepo.FindByQuery("email", email);
        
        if (user == null)
            throw ErrorFactory.CreateError("USER_NOT_FOUND");

        if (!PasswordUtils.VerifyPassword(password, user.Password))
            throw ErrorFactory.CreateError("INVALID_CREDENTIALS");

        user.LastLoginAt = DateTime.UtcNow;
        await _userRepo.Update(user);

        return UserMapper.ToUserDto(user);
    }

    /// <summary>
    /// Changes a user's password
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="currentPassword">Current password</param>
    /// <param name="newPassword">New password</param>
    /// <returns>True if password changed successfully</returns>
    public async Task<bool> ChangePassword(ObjectId userId, string currentPassword, string newPassword) {
        User? user = await _userRepo.FindByQuery("id", userId);

        if (user == null)
            throw ErrorFactory.CreateError("USER_NOT_FOUND");

        if (!PasswordUtils.VerifyPassword(currentPassword, user.Password))
            throw ErrorFactory.CreateError("INVALID_CURRENT_PASSWORD");

        user.Password = PasswordUtils.HashPassword(newPassword);
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepo.Update(user);

        return true;
    }

    /// <summary>
    /// Resets a user's password (admin function)
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="newPassword">New password</param>
    /// <returns>True if password reset successfully</returns>
    public async Task<bool> ResetPassword(ObjectId userId, string newPassword) {
        User? user = await _userRepo.FindByQuery("id", userId);

        if (user == null)
            throw ErrorFactory.CreateError("USER_NOT_FOUND");

        user.Password = PasswordUtils.HashPassword(newPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepo.Update(user);

        return true;
    }

    /// <summary>
    /// Initiates forgot password process
    /// </summary>
    /// <param name="email">User email</param>
    /// <returns>True if process initiated successfully</returns>
    public async Task<bool> ForgotPassword(string email) {
        User? user = await _userRepo.FindByQuery("email", email);
        if (user == null)
            throw ErrorFactory.CreateError("USER_NOT_FOUND");

        // TODO: Implement forgot password logic
        // - Generate reset token
        // - Send email with reset link
        // - Store token in database with expiration

        return true;
    }
}