namespace API.DTOs.Workspace;

using Core.Enums;
using System.ComponentModel.DataAnnotations;


public class CreateWorkspaceRequest {
    [Required(ErrorMessage = "Workspace name is required")]
    [StringLength(128, MinimumLength = 1, ErrorMessage = "Workspace name must be between 1 and 128 characters")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Workspace visibility is required")]
    public WorkspaceVisibility Visibility { get; set; } = WorkspaceVisibility.Private;
}

public class UpdateWorkspaceRequest {
    [StringLength(128, MinimumLength = 1, ErrorMessage = "Workspace name must be between 1 and 128 characters")]
    public string? Name { get; set; }

    [StringLength(1000, ErrorMessage = "Workspace description must be 1000 characters or less")]
    public string? Description { get; set; }

    public WorkspaceVisibility? Visibility { get; set; }
}

public class WorkspaceResponse {
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
}
