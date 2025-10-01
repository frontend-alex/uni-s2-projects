using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Base;

public abstract class BaseController : ControllerBase {
    protected string? GetUserId() {
        return HttpContext.Items["UserId"]?.ToString();
    }

    protected int? GetUserIdAsInt() {
        string? userIdString = GetUserId();
        Console.WriteLine($"userIdString: {userIdString}");
        if (int.TryParse(userIdString, out var userId)) {
            return userId;
        }
        return null;
    }
}