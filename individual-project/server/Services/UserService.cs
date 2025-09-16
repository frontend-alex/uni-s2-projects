using MongoDB.Bson;
using server.Contracts.DTOs;
using server.Errors;
using server.Mappers;
using server.Repositories;

namespace server.Services;

public class UserService
{
    private readonly IUserRepo _userRepo;
    
    public UserService(IUserRepo userRepo) {
        _userRepo = userRepo;
    }

    /// <summary>
    /// Creates a new user
    /// </summary>
    /// <param name="createUserDto">User creation data</param>
    /// <returns>Created user as DTO</returns>
    public async Task<UserDTO> CreateUserAsync(CreateUserDTO createUserDto) {
        // Check if user already exists
        if (await _userRepo.ExistsByEmailAsync(createUserDto.Email))
            throw ErrorFactory.CreateError("EMAIL_ALREADY_TAKEN");

        if (await _userRepo.ExistsByUsernameAsync(createUserDto.Username))
            throw ErrorFactory.CreateError("USERNAME_ALREADY_TAKEN");
        
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password);

        // Map DTO to User model
        var user = UserMapper.ToUser(createUserDto, hashedPassword);

        // Save to database
        var createdUser = await _userRepo.CreateAsync(user);

        // Return as DTO
        return UserMapper.ToUserDto(createdUser);
    }

    /// <summary>
    /// Gets a user by ID
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>User DTO if found, null otherwise</returns>
    public async Task<UserDTO?> GetUserByIdAsync(ObjectId id) {
        var user = await _userRepo.GetByIdAsync(id);
        return user != null ? UserMapper.ToUserDto(user) : null;
    }

    /// <summary>
    /// Gets a user by ID and throws error if not found
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>User DTO</returns>
    public async Task<UserDTO> GetUserByIdRequiredAsync(ObjectId id) {
        var user = await _userRepo.GetByIdAsync(id);
        if (user == null)
            throw ErrorFactory.CreateError("USER_NOT_FOUND");
        
        return UserMapper.ToUserDto(user);
    }

    /// <summary>
    /// Gets a user by email
    /// </summary>
    /// <param name="email">User email</param>
    /// <returns>User DTO if found, null otherwise</returns>
    public async Task<UserDTO?> GetUserByEmailAsync(string email)
    {
        var user = await _userRepo.GetByEmailAsync(email);
        return user != null ? UserMapper.ToUserDto(user) : null;
    }

    /// <summary>
    /// Gets a user by username
    /// </summary>
    /// <param name="username">Username</param>
    /// <returns>User DTO if found, null otherwise</returns>
    public async Task<UserDTO?> GetUserByUsernameAsync(string username)
    {
        var user = await _userRepo.GetByUsernameAsync(username);
        return user != null ? UserMapper.ToUserDto(user) : null;
    }

    /// <summary>
    /// Updates a user
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="updateUserDto">Update data</param>
    /// <returns>Updated user DTO</returns>
    public async Task<UserDTO> UpdateUserAsync(ObjectId id, UpdateUserDTO updateUserDto)
    {
        var user = await _userRepo.GetByIdAsync(id);
        
        if (user == null)
            throw ErrorFactory.CreateError("USER_NOT_FOUND");

        if (!string.IsNullOrEmpty(updateUserDto.Email) && updateUserDto.Email != user.Email){
            if (await _userRepo.ExistsByEmailAsync(updateUserDto.Email))
                throw ErrorFactory.CreateError("EMAIL_ALREADY_TAKEN");
        }

        if (!string.IsNullOrEmpty(updateUserDto.Username) && updateUserDto.Username != user.Username) {
            if (await _userRepo.ExistsByUsernameAsync(updateUserDto.Username))
                throw ErrorFactory.CreateError("USERNAME_ALREADY_TAKEN");
        }

        var updatedUser = UserMapper.UpdateUser(user, updateUserDto);

        var savedUser = await _userRepo.UpdateAsync(updatedUser);

        // Return as DTO
        return UserMapper.ToUserDto(savedUser);
    }

    /// <summary>
    /// Deletes a user
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>True if deleted successfully</returns>
    public async Task<bool> DeleteUserAsync(ObjectId id) {
        return await _userRepo.DeleteAsync(id);
    }

    /// <summary>
    /// Gets all users with pagination
    /// </summary>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <returns>List of user DTOs</returns>
    public async Task<IEnumerable<UserDTO>> GetAllUsersAsync(int pageNumber = 1, int pageSize = 10) {
        var users = await _userRepo.GetAllAsync(pageNumber, pageSize);
        return users.Select(UserMapper.ToUserDto);
    }

    /// <summary>
    /// Verifies user credentials for login
    /// </summary>
    /// <param name="email">User email</param>
    /// <param name="password">Plain text password</param>
    /// <param name="passwordHasher">Function to hash and verify password</param>
    /// <returns>User DTO if credentials are valid, null otherwise</returns>
    public async Task<UserDTO?> VerifyCredentialsAsync(string email, string password, Func<string, string, bool> passwordHasher) {
        var user = await _userRepo.GetByEmailAsync(email);
        if (user == null)
            return null;

        if (!passwordHasher(password, user.Password))
            return null;

        // Update last login time
        user.LastLoginAt = DateTime.UtcNow;
        await _userRepo.UpdateAsync(user);

        return UserMapper.ToUserDto(user);
    }
}
