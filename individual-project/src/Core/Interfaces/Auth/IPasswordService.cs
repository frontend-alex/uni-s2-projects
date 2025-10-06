namespace Core.Interfaces.Auth;

public interface IPasswordService {
    string HashPassword(string password);
    bool VerifyPassword(string password, string hashedPassword);
}

