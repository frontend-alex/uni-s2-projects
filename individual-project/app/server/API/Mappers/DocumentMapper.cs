namespace API.Mappers;

using API.Contracts.Document;
using Core.DTOs;

public class DocumentMapper {
    public static DocumentResponse ToDocumentResponse(DocumentDto documentDto) {
        return new DocumentResponse {
            Id = documentDto.Id,
            WorkspaceId = documentDto.WorkspaceId,
            Title = documentDto.Title,
            Kind = documentDto.Kind,
            YDocId = documentDto.YDocId,
            Content = documentDto.Content,
            CreatedBy = documentDto.CreatedBy,
            CreatorName = documentDto.CreatorName,
            IsArchived = documentDto.IsArchived,
            CreatedAt = documentDto.CreatedAt,
            UpdatedAt = documentDto.UpdatedAt
        };
    }
}


