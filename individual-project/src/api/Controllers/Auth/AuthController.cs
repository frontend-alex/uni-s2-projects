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
        await _authService.RegisterAsync(request);

        return Ok(new ResponseDto<object> {
            Success = true,
            Message = "User has successfully registered.",
            Data = null
        });
    }
}
