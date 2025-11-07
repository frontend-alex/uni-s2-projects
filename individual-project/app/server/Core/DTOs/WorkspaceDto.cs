namespace Core.DTOs;

using Core.Enums;

public class WorkspaceDto : BaseDto {
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int CreatedBy { get; set; }
    public int MemberCount { get; set; }
    public int DocumentCount { get; set; }
    public string CreatorName { get; set; } = string.Empty;
    public UserWorkspaceRole UserRole { get; set; }
    public WorkspaceVisibility Visibility { get; set; }
    public IEnumerable<DocumentDto> Documents { get; set; } = new List<DocumentDto>();
}
