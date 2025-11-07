namespace API.Controllers.User;

using API.Models;
using Core.DTOs;
using API.Mappers;
using API.Contracts.User;
using Core.Services.User;
using API.Controllers.Base;
using Microsoft.AspNetCore.Mvc;


public class UserController : BaseController {
    private readonly UserService _userService;

    public UserController(UserService userService) {
        _userService = userService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetProfile() {
        int userIdResult = GetCurrentUserId();

        UserDto userDto = await _userService.GetByIdUser(userIdResult);

        UserResponse user = UserMapper.ToGetUserResponse(userDto);

        return Ok(new ApiResponse<UserResponse> {
            Success = true,
            Message = "User profile retrieved successfully.",
            Data = user
        });
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateUser([FromBody] Dictionary<string, object> updates) {
        int userId = GetCurrentUserId();

        await _userService.UpdateUser(userId, updates);

        return Ok(new ApiResponse<EmptyResponse> {
            Success = true,
            Message = "User updated successfully.",
            Data = null
        });
    }
}