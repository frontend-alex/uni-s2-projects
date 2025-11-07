
namespace API.Contracts.Workspace;

using Core.Enums;

public class WorkspaceResponse {
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int CreatedBy { get; set; }
    public int MemberCount { get; set; }
    public int DocumentCount { get; set; }
    public string CreatorName { get; set; } = string.Empty;
    public UserWorkspaceRole UserRole { get; set; }
    public WorkspaceVisibility Visibility { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? ColorHex { get; set; }
    public IEnumerable<API.Contracts.Document.DocumentResponse> Documents { get; set; } = new List<API.Contracts.Document.DocumentResponse>();
}