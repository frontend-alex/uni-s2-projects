using Core.Enums;

namespace Core.Models;

public class Document : BaseEntity {
    public int WorkspaceId { get; set; }
    public string? Title { get; set; }
    public DocumentKind Kind { get; set; } = DocumentKind.Note;
    public string YDocId { get; set; } = string.Empty;
    public int CreatedBy { get; set; }
    public bool IsArchived { get; set; } = false;
    
    // Navigation properties
    public Workspace? Workspace { get; set; }
    public User? Creator { get; set; }
}
