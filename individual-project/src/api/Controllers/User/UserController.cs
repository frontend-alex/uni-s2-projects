namespace API.Controllers.User;

using API.DTOs;
using Core.Models;
using Core.Interfaces.User;
using Microsoft.AspNetCore.Mvc;

public class UserController : BaseController {

    private readonly IUserService _userService;

    public UserController(IUserService userService) {
        _userService = userService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetProfile() {
        int userIdResult = GetCurrentUserId();

        User? user = await _userService.GetByIdUser(userIdResult);

        return Ok(new ResponseDto<object> {
            Success = true,
            Message = "User profile retrieved successfully.",
            Data = new { user }
        });
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateUser([FromBody] Dictionary<string, object> updates) {
        int userId = GetCurrentUserId();

        await _userService.UpdateUser(userId, updates);

        return Ok(new ResponseDto<object> {
            Success = true,
            Message = "User updated successfully.",
            Data = null
        });
    }
}