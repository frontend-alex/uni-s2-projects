using API.DTOs;
using API.DTOs.Auth;
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
        var (success, message, expiresAt) = await _otpService.SendOtpAsync(request.Email);
        return Ok(new OtpResponse {
            Success = success,
            Message = message,
            ExpiresAt = expiresAt
        });
    }

    [HttpPut("verify")]
    public async Task<IActionResult> VerifyOtp([FromBody] OtpVerifyRequest request) {
        var (success, message) = await _otpService.VerifyOtpAsync(request.Email, request.Code);
        return Ok(new OtpResponse {
            Success = success,
            Message = message
        });
    }
}
