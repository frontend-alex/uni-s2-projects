using Microsoft.AspNetCore.Mvc;
using PeerLearn.Core.Exceptions;
using System.Security.Claims;

namespace PeerLearn.API.Controllers;

/// <summary>
/// Base API controller with common configuration for all API controllers
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
public abstract class BaseApiController : ControllerBase {
    /// <summary>
    /// Gets the current user ID from JWT claims
    /// </summary>
    /// <returns>The current user's ID as string</returns>
    /// <exception cref="ErrorFactory.CreateError(string, ErrorOverrides?)">Thrown when user ID cannot be found in claims</exception>
    protected string GetCurrentUserId() {
        var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value)) 
            throw ErrorFactory.CreateError("MISSING_TOKEN");
        
        return userIdClaim.Value;
    }
}
