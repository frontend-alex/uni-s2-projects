using API.Models;
using Core.Exceptions;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers.Base;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase {
    protected int GetCurrentUserId() {
        string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId)) {
            throw AppException.CreateError("USER_NOT_FOUND");
        }

        return userId;
    }

    protected IActionResult HandleUserIdError() {
        return Unauthorized(new ApiResponse<EmptyResponse> {
            Success = false,
            Message = "Invalid or missing user ID in token.",
            Data = null
        });
    }
}
