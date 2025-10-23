namespace Infrastructure.Repositories;

using Core.Models;

public interface IOtpRepository {
    Task CreateOtpAsync(Otp otp);
    Task<Otp?> GetOtpByEmailAsync(string email);
    Task DeleteOtpByEmailAsync(string email);
}
