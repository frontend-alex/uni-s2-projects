using server.Models.MSSQL;

namespace server.Repositories.MSSQL;

public interface IUserRepo
{
    /// <summary>
    /// Creates a new user in the database
    /// </summary>
    /// <param name="user">The user to create</param>
    /// <returns>The created user with generated ID</returns>
    Task<User> Create(User user);

    /// <summary>
    /// Updates an existing user
    /// </summary>
    /// <param name="user">The user to update</param>
    /// <returns>The updated user</returns>
    Task<User> Update(User user);

    /// <summary>
    /// Deletes a user by their ID
    /// </summary>
    /// <param name="id">The user's ID</param>
    /// <returns>True if deleted successfully, false otherwise</returns>
    Task<bool> Delete(int id);

    /// <summary>
    /// Gets a user by their ID
    /// </summary>
    /// <param name="id">The user's ID</param>
    /// <returns>The user if found, null otherwise</returns>
    Task<User?> GetById(int id);

    /// <summary>
    /// Gets all users
    /// </summary>
    /// <returns>List of all users</returns>
    Task<IEnumerable<User>> GetAll();

    /// <summary>
    /// Checks if a user exists by email
    /// </summary>
    /// <param name="email">The email to check</param>
    /// <returns>True if user exists, false otherwise</returns>
    Task<bool> ExistsByEmail(string email);

    /// <summary>
    /// Checks if a user exists by username
    /// </summary>
    /// <param name="username">The username to check</param>
    /// <returns>True if user exists, false otherwise</returns>
    Task<bool> ExistsByUsername(string username);

    /// <summary>
    /// Finds a user by email
    /// </summary>
    /// <param name="email">The email to search for</param>
    /// <returns>The user if found, null otherwise</returns>
    Task<User?> FindByEmail(string email);

    /// <summary>
    /// Finds a user by username
    /// </summary>
    /// <param name="username">The username to search for</param>
    /// <returns>The user if found, null otherwise</returns>
    Task<User?> FindByUsername(string username);

    /// <summary>
    /// Finds users by role
    /// </summary>
    /// <param name="role">The role to search for</param>
    /// <returns>List of users with the specified role</returns>
    Task<IEnumerable<User>> FindByRole(server.Contracts.Enums.Role role);
}
