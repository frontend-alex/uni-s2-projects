namespace App.Contracts.Persistence;

public interface IOtpRepository {
    Task CreateOtpAsync(Otp otp);
    Task<Otp?> GetOtpByEmailAsync(string email);
    Task DeleteOtpByEmailAsync(string email);
}