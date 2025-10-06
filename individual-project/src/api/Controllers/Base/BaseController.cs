using API.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase {
    protected int GetCurrentUserId() {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId)) {
            throw new UnauthorizedAccessException("Invalid or missing user ID in token.");
        }

        return userId;
    }

    protected IActionResult HandleUserIdError() {
        return Unauthorized(new ResponseDto<object> {
            Success = false,
            Message = "Invalid or missing user ID in token.",
            Data = null
        });
    }
}
