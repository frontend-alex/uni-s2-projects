namespace Core.DTOs;

using Core.Enums;

public class DocumentDto : BaseDto {
    public int WorkspaceId { get; set; }
    public string? Title { get; set; }
    public DocumentKind Kind { get; set; }
    public string YDocId { get; set; } = string.Empty;
    public string? Content { get; set; }
    public int CreatedBy { get; set; }
    public string CreatorName { get; set; } = string.Empty;
    public bool IsArchived { get; set; }
}


