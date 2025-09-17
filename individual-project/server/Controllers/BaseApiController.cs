using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using server.Errors;
using System.Security.Claims;

namespace server.Controllers;

/// <summary>
/// Base API controller with common configuration for all API controllers
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
public abstract class BaseApiController : ControllerBase {
    /// <summary>
    /// Gets the current user ID from JWT claims
    /// </summary>
    /// <returns>The current user's ObjectId</returns>
    /// <exception cref="ErrorFactory.CreateError(string, ErrorOverrides?)">Thrown when user ID cannot be found in claims</exception>
    protected ObjectId GetCurrentUserId() {
        var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value)) 
            throw ErrorFactory.CreateError("MISSING_TOKEN");
        

        if (!ObjectId.TryParse(userIdClaim.Value, out var userId)) 
            throw ErrorFactory.CreateError("INVALID_ENCRYPTED_TOKEN");
        

        return userId;
    }
}
