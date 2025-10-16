using Core.Enums;

namespace Core.Models;

public class WorkspaceInvitation : BaseEntity {
    public int WorkspaceId { get; set; }
    public string InvitedEmail { get; set; } = string.Empty;
    public int InvitedBy { get; set; }
    public string Token { get; set; } = string.Empty;
    public WorkspaceInvitationStatus Status { get; set; } = WorkspaceInvitationStatus.Pending;
    public DateTime? ExpiresAt { get; set; }
    
    // Navigation properties
    public Workspace? Workspace { get; set; }
    public User? Inviter { get; set; }
}
