namespace Core.DTOs.Workspace;

using Core.Enums;

public class WorkspaceDto {
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public WorkspaceVisibility Visibility { get; set; }
    public int CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string CreatorName { get; set; } = string.Empty;
    public int MemberCount { get; set; }
    public int DocumentCount { get; set; }
    public UserWorkspaceRole UserRole { get; set; }
}
