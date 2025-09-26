using PeerLearn.App.Services;
using PeerLearn.Core.DTOs;
using Microsoft.AspNetCore.Mvc;
using PeerLearn.API.Shared.Utils.JWT;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using PeerLearn.API.Attributes;

namespace PeerLearn.API.Controllers.auth;

/// <summary>
/// Authentication controller for handling login, registration, and password operations
/// </summary>
[AllowAnonymous]
public class AuthController : BaseApiController
{
    private readonly AuthService _authService;
    private readonly UserService _userService;

    public AuthController(AuthService authService, UserService userService, ILogger<AuthController> logger) : base(logger)
    {
        _authService = authService;
        _userService = userService;
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    /// <param name="createUserDto">User registration data</param>
    /// <returns>The created user</returns>
    /// <response code="201">User registered successfully</response>
    /// <response code="400">Invalid request body</response>
    /// <response code="409">User already exists</response>
    /// <response code="500">Internal server error</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(ResponseDTO<UserDTO>), 201)]
    [ValidateModel]
    public async Task<IActionResult> Register([FromBody] CreateUserDTO createUserDto)
    {
        try
        {
            await _userService.CreateUser(createUserDto);
            return Ok(new ResponseDTO<object>(true, "User registered successfully", null));
        }
        catch
        {
            throw;
        }
    }

    /// <summary>
    /// Login user with email and password
    /// </summary>
    /// <param name="loginDto">Login credentials</param>
    /// <returns>User data if login successful</returns>
    /// <response code="200">Login successful</response>
    /// <response code="401">Invalid credentials</response>
    /// <response code="500">Internal server error</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ResponseDTO<string>), 200)]
    [ValidateModel]
    public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
    {
        try
        {
            var user = await _authService.Login(loginDto.Email, loginDto.Password);

            var claims = new List<Claim>
            {
                new Claim("sub", user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("role", user.Role.ToString())
            };

            var token = JWTUtils.GenerateToken(claims, HttpContext.RequestServices.GetRequiredService<IConfiguration>(), TimeSpan.FromDays(7));

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("authCookie", token, cookieOptions);

            return Ok(new ResponseDTO<object>(true, "Login successful", null));
        }
        catch
        {
            throw;
        }
    }

    /// <summary>
    /// Change user password
    /// </summary>
    /// <param name="changePasswordDto">Password change data</param>
    /// <returns>Success message</returns>
    /// <response code="200">Password changed successfully</response>
    /// <response code="400">Invalid current password</response>
    /// <response code="404">User not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPost("change-password")]
    [ProducesResponseType(typeof(ResponseDTO<object>), 200)]
    [ValidateModel]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO changePasswordDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            await _authService.ChangePassword(userId, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
            return Ok(new ResponseDTO<object>(true, "Password changed successfully", null));
        }
        catch
        {
            throw;
        }
    }

    /// <summary>
    /// Reset user password (admin function)
    /// </summary>
    /// <param name="resetPasswordDto">Password reset data</param>
    /// <returns>Success message</returns>
    /// <response code="200">Password reset successfully</response>
    /// <response code="404">User not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPost("reset-password")]
    [ProducesResponseType(typeof(ResponseDTO<object>), 200)]
    [ValidateModel]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO resetPasswordDto)
    {
        try
        {
            await _authService.ResetPassword(resetPasswordDto.UserId, resetPasswordDto.NewPassword);
            return Ok(new ResponseDTO<object>(true, "Password reset successfully", null));
        }
        catch
        {
            throw;
        }
    }

    /// <summary>
    /// Forgot password - initiate password reset process
    /// </summary>
    /// <param name="forgotPasswordDto">Email for password reset</param>
    /// <returns>Success message</returns>
    /// <response code="200">Password reset email sent</response>
    /// <response code="404">User not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(ResponseDTO<object>), 200)]
    [ValidateModel]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO forgotPasswordDto)
    {
        try
        {
            await _authService.ForgotPassword(forgotPasswordDto.Email);
            return Ok(new ResponseDTO<object>(true, "Password reset email sent", null));
        }
        catch
        {
            throw;
        }
    }

    /// <summary>
    /// Logout user by clearing the auth cookie
    /// </summary>
    /// <returns>Success message</returns>
    /// <response code="200">Logout successful</response>
    /// <response code="500">Internal server error</response>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(typeof(ResponseDTO<object>), 200)]
    public IActionResult Logout()
    {
        try
        {
            // Clear the auth cookie
            Response.Cookies.Delete("authCookie");
            return Ok(new ResponseDTO<object>(true, "Logout successful", null));
        }
        catch
        {
            throw;
        }
    }
}
