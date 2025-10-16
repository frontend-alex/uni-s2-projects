using API.DTOs;
using API.DTOs.Auth;
using Core.Services.Auth;
using Microsoft.AspNetCore.Authorization;
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
        string email = await _authService.RegisterAsync(request.Username, request.FirstName, request.LastName, request.Email, request.Password);

        return Ok(new ResponseDto<object> {
            Success = true,
            Message = "User has successfully registered.",
            Data = new { email }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request) {
        string token = await _authService.LoginAsync(request.Email, request.Password);

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

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout() {
        Response.Cookies.Delete("access_token");

        return Ok(new ResponseDto<object> {
            Success = true,
            Message = "Logged out successfully.",
            Data = null
        });
    }
}
