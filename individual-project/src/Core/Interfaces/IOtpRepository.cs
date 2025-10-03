using Core.Models;

namespace Core.Interfaces;

public interface IOtpRepository {
    Task CreateOtpAsync(Otp otp);
    Task<Otp?> GetOtpByEmailAsync(string email);
    Task DeleteOtpByEmailAsync(string email);
}

