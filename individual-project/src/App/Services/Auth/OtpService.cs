using Core.DTO.Auth;
using Core.Exceptions;
using Core.Utils.Email;
using App.Contracts.Persistence;

namespace App.Services.Auth;

public class OtpService {
    private readonly IOtpRepository _otpRepository;
    private readonly IUserRepository _userRepository;
    private readonly TimeSpan _otpValidityDuration = TimeSpan.FromMinutes(5);

    public OtpService(IOtpRepository otpRepository, IUserRepository userRepository) {
        _otpRepository = otpRepository;
        _userRepository = userRepository;
    }

    public async Task<OtpResponse> SendOtpAsync(SendOtpRequest request) {

        if (await _userRepository.GetByEmailAsync(request.Email) == null) {
            throw AppException.CreateError("USER_NOT_FOUND");
        }

        var otpCode = OtpUtils.GenerateOtpCode();
        var expirationTime = DateTime.UtcNow.Add(_otpValidityDuration);

        // Delete any existing OTP for this email
        await _otpRepository.DeleteOtpByEmailAsync(request.Email);

        // Create new OTP
        var otp = new Otp {
            Email = request.Email,
            Code = otpCode,
            ExpirationTime = expirationTime
        };

        await _otpRepository.CreateOtpAsync(otp);

        // var subject = "Your OTP Code";
        // var body = $"Your OTP code is: {otpCode}\n\nThis code will expire in 5 minutes.";

        return new OtpResponse {
            Success = true,
            Message = "OTP sent successfully",
            ExpiresAt = expirationTime
        };
    }

    public async Task<OtpResponse> VerifyOtpAsync(OtpVerifyRequest request) {

        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user is null)
            throw AppException.CreateError("USER_NOT_FOUND");

        if (user.EmailVerified)
            throw AppException.CreateError("USER_ALREADY_VERIFIED");

        var otp = await _otpRepository.GetOtpByEmailAsync(request.Email);

        if (otp is null)
            throw AppException.CreateError("OTP_NOT_FOUND");

        if (otp.ExpirationTime < DateTime.UtcNow) {
            await _otpRepository.DeleteOtpByEmailAsync(request.Email);
            throw AppException.CreateError("OTP_EXPIRED");
        }

        if (otp.Code != request.Code)
            throw AppException.CreateError("INVALID_OTP");

        await _otpRepository.DeleteOtpByEmailAsync(request.Email);

        user.EmailVerified = true;
        await _userRepository.UpdateAsync(user);

        return new OtpResponse {
            Success = true,
            Message = "OTP verified successfully"
        };
    }
}