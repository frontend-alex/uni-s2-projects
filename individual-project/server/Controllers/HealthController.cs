using Microsoft.AspNetCore.Mvc;

namespace server.Controllers;

/// <summary>
/// Health check controller for monitoring API status
/// </summary>
public class HealthController : BaseApiController {
    /// <summary>
    /// Get the health status of the API
    /// </summary>
    /// <returns>Returns the current health status and timestamp</returns>
    /// <response code="200">Returns the health status</response>
    [HttpGet]
    [ProducesResponseType(typeof(object), 200)]
    public IActionResult Get() {
        return Ok(new { 
            status = "healthy", 
            timestamp = DateTime.UtcNow 
        });
    }
}