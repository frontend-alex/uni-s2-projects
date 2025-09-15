using Microsoft.AspNetCore.Mvc;

namespace server.Controllers;

/// <summary>
/// Base API controller with common configuration for all API controllers
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    // Common functionality can be added here
    // All controllers should inherit from this base class
}
