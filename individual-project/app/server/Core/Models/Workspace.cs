using Core.Enums;

namespace Core.Models;

public class Workspace : BaseEntity {
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int CreatedBy { get; set; }
    public WorkspaceVisibility Visibility { get; set; }
    
    // Navigation properties
    public User? Creator { get; set; }
    public ICollection<UserWorkspace> UserWorkspaces { get; set; } = new List<UserWorkspace>();
    public ICollection<WorkspaceInvitation> Invitations { get; set; } = new List<WorkspaceInvitation>();
    public ICollection<Document> Documents { get; set; } = new List<Document>();
}