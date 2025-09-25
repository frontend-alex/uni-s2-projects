namespace PeerLearn.API.Controllers.user;

using PeerLearn.API.Controllers;
using PeerLearn.Core.DTOs;
using Microsoft.AspNetCore.Mvc;
using PeerLearn.App.Services;
using Microsoft.AspNetCore.Authorization;

/// <summary>
/// User controller for managing user/s
/// </summary>
[Authorize]
public class UserController : BaseApiController {

    private readonly UserService _userService;

    public UserController(UserService userService) {
        _userService = userService;
    }   


    /// <summary>
    /// Get the current user
    /// </summary>
    /// <returns>The current user</returns>
    /// <response code="200">User found</response>
    /// <response code="404">User not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("me")]
    [ProducesResponseType(typeof(ResponseDTO<UserDTO>), 200)]
    public async Task<IActionResult> GetCurrentUser() {
        try {
            var userId = GetCurrentUserId();
            var user = await _userService.FindUserByQuery("id", userId);

            return Ok(new ResponseDTO<UserDTO>(true, "User found", user));
        }
        catch {
            throw;
        }
    }


    
    /// <summary>
    /// Update the current user
    /// </summary>
    /// <param name="updateUserDto">The user data to update</param>
    /// <returns>The success and the message</returns>
    /// <response code="200">User updated successfully</response>
    /// <response code="404">User not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPut("me")]
    [ProducesResponseType(typeof(ResponseDTO<UpdateUserDTO>), 200)]
    public async Task<IActionResult> UpdateCurrentUser([FromBody] UpdateUserDTO updateUserDto) {
        try {
            var userId = GetCurrentUserId();

            var updatedUser = await _userService.UpdateUser(userId, updateUserDto);
            return Ok(new ResponseDTO<UserDTO>(true, "User updated successfully", updatedUser));
        }
        catch {
            throw;
        }
    }

    /// <summary>
    /// Delete the current user
    /// </summary>
    /// <returns>Success message</returns>
    /// <response code="200">User deleted successfully</response>
    /// <response code="404">User not found</response>
    /// <response code="500">Internal server error</response>
    [HttpDelete("me")]
    [ProducesResponseType(typeof(ResponseDTO<object>), 200)]
    public async Task<IActionResult> DeleteCurrentUser() {
        try {
            var userId = GetCurrentUserId();
            var deleted = await _userService.DeleteUser(userId);
            if (!deleted)
                return NotFound(new ResponseDTO<object>(false, "User not found", null));
                
            return Ok(new ResponseDTO<object>(true, "User deleted successfully", null));
        }
        catch {
            throw;
        }
    }

    /// <summary>
    /// Find a user by any field using flexible query
    /// </summary>
    /// <param name="fieldName">The field name to search by (e.g., "email", "username", "id")</param>
    /// <param name="value">The value to search for</param>
    /// <returns>The user if found</returns>
    /// <response code="200">User found</response>
    /// <response code="404">User not found</response>
    /// <response code="400">Invalid field name or value</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("find")]
    [ProducesResponseType(typeof(ResponseDTO<UserDTO>), 200)]
    public async Task<IActionResult> FindUserByQuery([FromQuery] string fieldName, [FromQuery] string value) {
        try {
            if (string.IsNullOrEmpty(fieldName) || string.IsNullOrEmpty(value)) {
                return BadRequest(new ResponseDTO<object>(false, "Field name and value are required", null));
            }

            var user = await _userService.FindUserByQuery(fieldName, value);
            if (user == null) {
                return NotFound(new ResponseDTO<object>(false, "User not found", null));
            }

            return Ok(new ResponseDTO<UserDTO>(true, "User found", user));
        }
        catch {
            throw;
        }
    }
}
