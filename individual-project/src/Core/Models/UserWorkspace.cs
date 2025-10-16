using Core.Enums;

namespace Core.Models;

public class UserWorkspace {
    public int UserId { get; set; }
    public int WorkspaceId { get; set; }
    public UserWorkspaceRole Role { get; set; } = UserWorkspaceRole.Member;
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastActiveAt { get; set; }
    
    // Navigation properties
    public User? User { get; set; }
    public Workspace? Workspace { get; set; }
}


