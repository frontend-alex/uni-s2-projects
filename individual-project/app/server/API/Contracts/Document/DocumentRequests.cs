namespace API.Contracts.Document;

using System.ComponentModel.DataAnnotations;
using Core.Enums;

public class CreateDocumentRequest {
    [Required]
    public int WorkspaceId { get; set; }

    [Required]
    [StringLength(256)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public DocumentKind Kind { get; set; }

    public WorkspaceVisibility? Visibility { get; set; }

    [RegularExpression("^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$", ErrorMessage = "Color must be a valid hex value (e.g., #RRGGBB)")]
    public string? ColorHex { get; set; }
}

public class UpdateDocumentRequest {
    [StringLength(256)]
    public string? Title { get; set; }

    public DocumentKind Kind { get; set; } 

    public string? Content { get; set; }

    public bool? IsArchived { get; set; }

    public WorkspaceVisibility? Visibility { get; set; }

    [RegularExpression("^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$", ErrorMessage = "Color must be a valid hex value (e.g., #RRGGBB)")]
    public string? ColorHex { get; set; }
}


