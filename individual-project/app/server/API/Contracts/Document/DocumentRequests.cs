namespace API.Contracts.Document;

using System.ComponentModel.DataAnnotations;
using Core.Enums;

public class CreateDocumentRequest {
    [Required]
    public int WorkspaceId { get; set; }
}

public class UpdateDocumentRequest {
    [StringLength(256)]
    public string? Title { get; set; }

    public string? Content { get; set; }

    public bool? IsArchived { get; set; }
}


