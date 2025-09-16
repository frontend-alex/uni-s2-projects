using MongoDB.Bson;
using server.Contracts.DTOs;
using server.Models;

namespace server.Repositories;

public interface IUserRepo
{
    /// <summary>
    /// Creates a new user in the database
    /// </summary>
    /// <param name="user">The user to create</param>
    /// <returns>The created user with generated ID</returns>
    Task<User> CreateAsync(User user);

    /// <summary>
    /// Gets a user by their ID
    /// </summary>
    /// <param name="id">The user's ObjectId</param>
    /// <returns>The user if found, null otherwise</returns>
    Task<User?> GetByIdAsync(ObjectId id);

    /// <summary>
    /// Gets a user by their email address
    /// </summary>
    /// <param name="email">The user's email</param>
    /// <returns>The user if found, null otherwise</returns>
    Task<User?> GetByEmailAsync(string email);

    /// <summary>
    /// Gets a user by their username
    /// </summary>
    /// <param name="username">The user's username</param>
    /// <returns>The user if found, null otherwise</returns>
    Task<User?> GetByUsernameAsync(string username);

    /// <summary>
    /// Updates an existing user
    /// </summary>
    /// <param name="user">The user to update</param>
    /// <returns>The updated user</returns>
    Task<User> UpdateAsync(User user);

    /// <summary>
    /// Deletes a user by their ID
    /// </summary>
    /// <param name="id">The user's ObjectId</param>
    /// <returns>True if deleted successfully, false otherwise</returns>
    Task<bool> DeleteAsync(ObjectId id);

    /// <summary>
    /// Gets all users with pagination
    /// </summary>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Number of items per page</param>
    /// <returns>List of users</returns>
    Task<IEnumerable<User>> GetAllAsync(int pageNumber = 1, int pageSize = 10);

    /// <summary>
    /// Checks if a user exists by email
    /// </summary>
    /// <param name="email">The email to check</param>
    /// <returns>True if user exists, false otherwise</returns>
    Task<bool> ExistsByEmailAsync(string email);

    /// <summary>
    /// Checks if a user exists by username
    /// </summary>
    /// <param name="username">The username to check</param>
    /// <returns>True if user exists, false otherwise</returns>
    Task<bool> ExistsByUsernameAsync(string username);
}
