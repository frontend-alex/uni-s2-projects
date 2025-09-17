namespace server.Shared.Utils.Auth;

/// <summary>
/// Service for handling password hashing and verification
/// </summary>
public static class PasswordUtils {
    /// <summary>
    /// Hashes a plain text password
    /// </summary>
    /// <param name="password">Plain text password</param>
    /// <returns>Hashed password</returns>
    public static string HashPassword(string password) {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    /// <summary>
    /// Verifies a plain text password against a hashed password
    /// </summary>
    /// <param name="password">Plain text password</param>
    /// <param name="hashedPassword">Hashed password to verify against</param>
    /// <returns>True if password is valid, false otherwise</returns>
    public static bool VerifyPassword(string password, string hashedPassword) {
        return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }
}
