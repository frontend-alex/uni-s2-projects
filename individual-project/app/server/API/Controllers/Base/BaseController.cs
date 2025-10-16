using API.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Core.Exceptions;

namespace API.Controllers.Base;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase {
    protected int GetCurrentUserId() {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId)) {
            throw AppException.CreateError("USER_NOT_FOUND");
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
