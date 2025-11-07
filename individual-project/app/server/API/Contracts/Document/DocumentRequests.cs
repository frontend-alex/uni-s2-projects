namespace API.Contracts.Document;

using System.ComponentModel.DataAnnotations;
using Core.Enums;

public class CreateDocumentRequest {
    [Required]
    public int WorkspaceId { get; set; }

    [RegularExpression("^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$", ErrorMessage = "Color must be a valid hex value (e.g., #RRGGBB)")]
    public string? ColorHex { get; set; }
}

public class UpdateDocumentRequest {
    [StringLength(256)]
    public string? Title { get; set; }

    public string? Content { get; set; }

    public bool? IsArchived { get; set; }

    [RegularExpression("^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$", ErrorMessage = "Color must be a valid hex value (e.g., #RRGGBB)")]
    public string? ColorHex { get; set; }
}


