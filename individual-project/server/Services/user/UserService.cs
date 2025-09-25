using MongoDB.Bson;
using server.Contracts.DTOs;
using server.Errors;
using server.Mappers;
using server.Repositories;
using server.Shared.Utils.Auth;

namespace server.Services.user;

public class UserService {
    private readonly IUserRepository _userRepo;

    public UserService(IUserRepository userRepo) {
        _userRepo = userRepo;
    }

    #region User Querying
    /// <summary>
    /// Finds a user by any field using a flexible query approach
    /// </summary>
    /// <param name="fieldName">The field name to search by (e.g., "email", "username", "id")</param>
    /// <param name="value">The value to search for</param>
    /// <returns>User DTO if found, null otherwise</returns>
    public async Task<UserDTO?> FindUserByQuery(string fieldName, object value) {
        var user = await _userRepo.FindByQuery(fieldName, value);
        return user != null ? UserMapper.ToUserDto(user) : null;
    }

    /// <summary>
    /// Gets a user by ID
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>User DTO if found, null otherwise</returns>
    public async Task<UserDTO?> GetUserById(string id) {
        return await FindUserByQuery("id", id);
    }

    /// <summary>
    /// Gets a user by email
    /// </summary>
    /// <param name="email">User email</param>
    /// <returns>User DTO if found, null otherwise</returns>
    public async Task<UserDTO?> GetUserByEmail(string email) {
        return await FindUserByQuery("email", email);
    }

    /// <summary>
    /// Gets a user by username
    /// </summary>
    /// <param name="username">Username</param>
    /// <returns>User DTO if found, null otherwise</returns>
    public async Task<UserDTO?> GetUserByUsername(string username) {
        return await FindUserByQuery("username", username);
    }
    #endregion

    #region User Management
    /// <summary>
    /// Creates a new user (internal use for registration)
    /// </summary>
    /// <param name="createUserDto">User creation data</param>
    /// <returns>Created user as DTO</returns>
    public async Task<UserDTO> CreateUser(CreateUserDTO createUserDto) {
        if (await _userRepo.ExistsByEmail(createUserDto.Email))
            throw ErrorFactory.CreateError("EMAIL_ALREADY_TAKEN");

        if (await _userRepo.ExistsByUsername(createUserDto.Username))
            throw ErrorFactory.CreateError("USERNAME_ALREADY_TAKEN");

        string hashedPassword = PasswordUtils.HashPassword(createUserDto.Password);
        var user = UserMapper.ToUser(createUserDto, hashedPassword);
        var createdUser = await _userRepo.Create(user);

        return UserMapper.ToUserDto(createdUser);
    }

    /// <summary>
    /// Updates a user
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="updateUserDto">Update data</param>
    /// <returns>Updated user DTO</returns>
    public async Task<UserDTO> UpdateUser(string id, UpdateUserDTO updateUserDto) {
        if (updateUserDto == null)
            throw ErrorFactory.CreateError("MISSING_TOKEN");

        var user = await _userRepo.FindByQuery("id", id);
        if (user == null)
            throw ErrorFactory.CreateError("USER_NOT_FOUND");

        if (!string.IsNullOrEmpty(updateUserDto.Email) && updateUserDto.Email != user.Email) {
            if (await _userRepo.ExistsByEmail(updateUserDto.Email))
                throw ErrorFactory.CreateError("EMAIL_ALREADY_TAKEN");
        }

        if (!string.IsNullOrEmpty(updateUserDto.Username) && updateUserDto.Username != user.Username) {
            if (await _userRepo.ExistsByUsername(updateUserDto.Username))
                throw ErrorFactory.CreateError("USERNAME_ALREADY_TAKEN");
        }

        var updatedUser = UserMapper.UpdateUser(user, updateUserDto);
        var savedUser = await _userRepo.Update(updatedUser);

        return UserMapper.ToUserDto(savedUser);
    }

    /// <summary>
    /// Deletes a user
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>True if deleted successfully</returns>
    public async Task<bool> DeleteUser(string id) {
        return await _userRepo.Delete(id);
    }
    #endregion
}
