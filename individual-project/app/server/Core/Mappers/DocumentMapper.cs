using Core.DTOs;
using Core.Models;
using Core.Enums;

namespace Core.Mappers;

public static class DocumentMapper {
    public static DocumentDto ToDocumentDto(Document document) {
        string creatorName = document.Creator != null
            ? $"{document.Creator.FirstName} {document.Creator.LastName}"
            : string.Empty;

        WorkspaceVisibility visibility = document.Visibility switch {
            WorkspaceVisibility.Private => WorkspaceVisibility.Private,
            WorkspaceVisibility.Public => WorkspaceVisibility.Public,
            _ => WorkspaceVisibility.Public // Default to Public
        };

        return new DocumentDto {
            Id = document.Id,
            CreatedAt = document.CreatedAt,
            UpdatedAt = document.UpdatedAt,
            WorkspaceId = document.WorkspaceId,
            Title = document.Title,
            Kind = document.Kind,
            YDocId = document.YDocId,
            Content = document.Content,
            ColorHex = document.ColorHex,
            CreatedBy = document.CreatedBy,
            CreatorName = creatorName,
            IsArchived = document.IsArchived,
            Visibility = visibility
        };
    }
}


