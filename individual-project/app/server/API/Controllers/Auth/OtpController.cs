using API.Models.Auth;
using Core.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Auth;

[ApiController]
[Route("api/[controller]")]
public class OtpController : ControllerBase {
    private readonly OtpService _otpService;

    public OtpController(OtpService otpService) {
        _otpService = otpService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request) {
        DateTime expirationTime = await _otpService.SendOtpAsync(request.Email);
        return Ok(new OtpResponse {
            Success = true,
            Message = "OTP sent successfully",
            ExpiresAt = expirationTime
        });
    }

    [HttpPut("verify")]
    public async Task<IActionResult> VerifyOtp([FromBody] OtpVerifyRequest request) {
        await _otpService.VerifyOtpAsync(request.Email, request.Code);
        return Ok(new OtpResponse {
            Success = true,
            Message = "OTP verified successfully"
        });
    }
}
