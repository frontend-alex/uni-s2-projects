using API.Controllers.Base;
using Core.DTO;
using Core.DTO.Auth;
using App.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Auth;

[ApiController]
[Route("api/[controller]")]
public class OtpController : BaseController {
    private readonly OtpService _otpService;

    public OtpController(OtpService otpService) {
        _otpService = otpService;
    }

    [HttpPost("send-otp")]
    public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request) {
        var result = await _otpService.SendOtpAsync(request);
        return Ok(new ResponseDto<OtpResponse> {
            Success = true, 
            Message = result.Message,
            Data = result
        });
    }

    [HttpPost("verify")]
    public async Task<IActionResult> VerifyOtp([FromBody] OtpVerifyRequest request) {
        var result = await _otpService.VerifyOtpAsync(request);
        return Ok(new ResponseDto<OtpResponse> {
            Success = true,
            Message = result.Message,
            Data = result
        });
    }
}   