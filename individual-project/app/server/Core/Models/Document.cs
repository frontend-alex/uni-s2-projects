using Core.Enums;

namespace Core.Models;

public class Document : BaseEntity {
    public int WorkspaceId { get; set; }
    public string? Title { get; set; }
    public DocumentKind Kind { get; set; } = DocumentKind.Note;
    public string YDocId { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? ColorHex { get; set; }
    public int CreatedBy { get; set; }
    public bool IsArchived { get; set; } = false;
    public WorkspaceVisibility Visibility { get; set; } = WorkspaceVisibility.Public; // Default to Public
    
    // Navigation properties
    public Workspace? Workspace { get; set; }
    public User? Creator { get; set; }
}
