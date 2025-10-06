namespace API.Controllers.User;

using Core.Models;
using Core.Interfaces.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using API.DTOs;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase {

    private readonly IUserService _userService;

    public UserController(IUserService userService) {
        _userService = userService;
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetProfile() {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId)) {
            return Unauthorized(new {
                success = false,
                message = "Invalid or missing user ID in token."
            });
        }

        User? user = await _userService.GetByIdUser(userId);

        return Ok(new ResponseDto<object> {
            Success = true,
            Message = "User profile retrieved successfully.",
            Data = new { user }
        });
    }
}