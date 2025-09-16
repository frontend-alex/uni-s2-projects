namespace server.Controllers.user;

using MongoDB.Bson;
using server.Services;
using server.Controllers;
using server.Contracts.DTOs;
using Microsoft.AspNetCore.Mvc;

/// <summary>
/// User controller for managing user/s
/// </summary>
public class UserController : BaseApiController {

    private readonly UserService _userService;

    public UserController(UserService userService) {
        _userService = userService;
    }

    /// <summary>
    /// Create a new user
    /// </summary>
    /// <param name="createUserDto">The user to create</param>
    /// <returns>The created user</returns>
    /// <response code="201">User created successfully</response>
    /// <response code="400">Invalid request body</response>
    /// <response code="409">User already exists</response>
    /// <response code="500">Internal server error</response>
    [HttpPost]
    [ProducesResponseType(typeof(UserDTO), 201)]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDTO createUserDto) {
        try {
            await _userService.CreateUserAsync(createUserDto);
            return Ok(new {
                success = true,
                message = "User created successfully",
                data = createUserDto
            });
        } catch{
            // The service will throw the error
            throw;
        }
    }

    /// <summary>
    /// Get a user by id
    /// </summary>
    /// <param name="id">The id of the user</param>
    /// <returns>The user</returns>
    /// <response code="200">User found</response>
    /// <response code="404">User not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(UserDTO), 200)]
    public async Task<IActionResult> GetUserById(ObjectId id){
        try{
            var user = await _userService.GetUserByIdAsync(id);
            return Ok( new {
                success = true,
                message = "User found",
                data = user
            });
        } catch {
            throw;
        }
    }
}
