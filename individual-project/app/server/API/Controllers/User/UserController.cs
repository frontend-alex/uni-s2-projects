namespace API.Controllers.User;

using API.Models;
using Core.Models;
using Core.Services.User;
using Microsoft.AspNetCore.Mvc;
using API.Controllers.Base;

public class UserController : BaseController {
    private readonly UserService _userService;

    public UserController(UserService userService) {
        _userService = userService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetProfile() {
        int userIdResult = GetCurrentUserId();

        User? user = await _userService.GetByIdUser(userIdResult);

        return Ok(new ApiResponse<object> {
            Success = true,
            Message = "User profile retrieved successfully.",
            Data = new { user }
        });
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateUser([FromBody] Dictionary<string, object> updates) {
        int userId = GetCurrentUserId();

        await _userService.UpdateUser(userId, updates);

        return Ok(new ApiResponse<object> {
            Success = true,
            Message = "User updated successfully.",
            Data = null
        });
    }
}