using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace API.Hubs;

/// <summary>
/// SignalR Hub for real-time communication with clients.
/// Handles user connections and broadcasts messages.
/// </summary>
public class AppHub : Hub
{
    private readonly ILogger<AppHub> _logger;

    public AppHub(ILogger<AppHub> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Called when a client connects to the hub.
    /// Logs the connection with user information.
    /// </summary>
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        // Note: Email is not in JWT token, only NameIdentifier (UserId) is included
        // If you need email, you'd have to add it to the JWT token generation

        if (userId != null)
        {
            _logger.LogInformation(
                "User connected to SignalR Hub - UserId: {UserId}, ConnectionId: {ConnectionId}",
                userId,
                Context.ConnectionId
            );

            // Add user to a group based on their user ID for targeted messaging
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");

            // You can also broadcast to all clients that a user connected (optional)
            // await Clients.All.SendAsync("UserConnected", new { userId, userEmail });
        }
        else
        {
            _logger.LogWarning(
                "Anonymous user connected to SignalR Hub - ConnectionId: {ConnectionId}",
                Context.ConnectionId
            );
        }

        await base.OnConnectedAsync();
    }

    /// <summary>
    /// Called when a client disconnects from the hub.
    /// Logs the disconnection.
    /// </summary>
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId != null)
        {
            _logger.LogInformation(
                "User disconnected from SignalR Hub - UserId: {UserId}, ConnectionId: {ConnectionId}",
                userId,
                Context.ConnectionId
            );

            // Remove user from group
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
        }
        else
        {
            _logger.LogWarning(
                "Anonymous user disconnected from SignalR Hub - ConnectionId: {ConnectionId}",
                Context.ConnectionId
            );
        }

        if (exception != null)
        {
            _logger.LogError(
                exception,
                "Error occurred during disconnect - ConnectionId: {ConnectionId}",
                Context.ConnectionId
            );
        }

        await base.OnDisconnectedAsync(exception);
    }
}

