using Core.DTOs;
using Core.Models;

namespace Core.Mappers;

public static class DocumentMapper {
    public static DocumentDto ToDocumentDto(Document document) {
        string creatorName = document.Creator != null
            ? $"{document.Creator.FirstName} {document.Creator.LastName}"
            : string.Empty;

        return new DocumentDto {
            Id = document.Id,
            CreatedAt = document.CreatedAt,
            UpdatedAt = document.UpdatedAt,
            WorkspaceId = document.WorkspaceId,
            Title = document.Title,
            Kind = document.Kind,
            YDocId = document.YDocId,
            Content = document.Content,
            CreatedBy = document.CreatedBy,
            CreatorName = creatorName,
            IsArchived = document.IsArchived
        };
    }
}


