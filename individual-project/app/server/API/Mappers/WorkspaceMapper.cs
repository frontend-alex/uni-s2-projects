namespace API.Mappers;

using API.Contracts.Workspace;
using Core.DTOs;

public class WorkspaceMapper {
    public static WorkspaceResponse ToWorkspaceResponse(WorkspaceDto workspaceDto) {
        // Map document DTOs to document responses
        var documentResponses = workspaceDto.Documents.Select(d => DocumentMapper.ToDocumentResponse(d));

        return new WorkspaceResponse {
            Id = workspaceDto.Id,
            Name = workspaceDto.Name,
            Description = workspaceDto.Description,
            CreatedBy = workspaceDto.CreatedBy,
            MemberCount = workspaceDto.MemberCount,
            DocumentCount = workspaceDto.DocumentCount,
            CreatorName = workspaceDto.CreatorName,
            UserRole = workspaceDto.UserRole,
            Visibility = workspaceDto.Visibility,
            CreatedAt = workspaceDto.CreatedAt,
            UpdatedAt = workspaceDto.UpdatedAt,
            Documents = documentResponses
        };
    }
}