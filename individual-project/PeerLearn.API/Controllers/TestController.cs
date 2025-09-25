using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using PeerLearn.Core.DTOs;
using PeerLearn.API.Attributes;

namespace PeerLearn.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class TestController : ControllerBase
{
    /// <summary>
    /// Test validation with a simple endpoint
    /// </summary>
    [HttpPost("validate-login")]
    [ValidateModel]
    public IActionResult TestLoginValidation([FromBody] LoginDTO loginDto)
    {
        return Ok(new { message = "Validation passed!", data = loginDto });
    }

    /// <summary>
    /// Test validation with user creation
    /// </summary>
    [HttpPost("validate-user")]
    [ValidateModel]
    public IActionResult TestUserValidation([FromBody] CreateUserDTO userDto)
    {
        return Ok(new { message = "Validation passed!", data = userDto });
    }
}
