using Core.DTO;
using Core.DTO.Auth;
using App.Services.Auth;
using Microsoft.AspNetCore.Mvc;
using API.Controllers.Base;

namespace API.Controllers.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : BaseController {
    private readonly AuthService _authService;

    public AuthController(AuthService authService) {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request) {
        try {
            string email = await _authService.RegisterAsync(request);

            return Ok(new ResponseDto<object> {
                Success = true,
                Message = "User has successfully registered.",
                Data = new { email }
            });
        }
        catch (Core.Exceptions.AppException ex) when (ex.ErrorCode == "USER_001A") {
            return BadRequest(new ErrorResponseDto {
                Message = ex.Message,
                Success = false,
                StatusCode = ex.StatusCode,
                ErrorCode = ex.ErrorCode,
                UserFriendlyMessage = ex.UserFriendlyMessage,
                Extra = new Dictionary<string, object> { { "email", request.Email }, { "otpRedirect", true } }
            });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request) {
            string token = await _authService.LoginAsync(request);

            // Set JWT token as HTTP-only cookie
            Response.Cookies.Append("access_token", token, new CookieOptions {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddHours(1) 
            });
            
            return Ok(new ResponseDto<object> {
                Success = true,
                Message = "User has successfully logged in.",
                Data = null
            });
    }
}
