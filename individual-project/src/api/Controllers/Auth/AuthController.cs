using Core.DTO;
using Core.DTO.Auth;
using App.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase {
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
            
            Response.Cookies.Append("auth-token", token, new CookieOptions {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });
            

            Console.WriteLine("Token set in cookie: " + token);
            
            return Ok(new ResponseDto<object> {
            Success = true,
            Message = "User has successfully logged in.",
            Data = null
        });
    }
}
