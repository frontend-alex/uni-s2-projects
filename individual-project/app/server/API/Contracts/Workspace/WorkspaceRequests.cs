namespace API.Contracts.Workspace;

using System.ComponentModel.DataAnnotations;
using Core.Enums;

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
