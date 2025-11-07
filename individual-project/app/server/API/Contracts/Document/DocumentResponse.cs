
namespace API.Contracts.Document;

using Core.Enums;

public class DocumentResponse {
    public int Id { get; set; }
    public int WorkspaceId { get; set; }
    public string? Title { get; set; }
    public DocumentKind Kind { get; set; }
    public string YDocId { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? ColorHex { get; set; }
    public int CreatedBy { get; set; }
    public string CreatorName { get; set; } = string.Empty;
    public bool IsArchived { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}


