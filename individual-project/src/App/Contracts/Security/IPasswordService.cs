namespace App.Contracts.Security;

public interface IPasswordService {
    string HashPassword(string password);
    bool VerifyPassword(string password, string hashedPassword);
}
