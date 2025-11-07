using Core.DTOs;
using Core.Enums;
using Core.Models;

namespace Core.Mappers;

public static class WorkspaceMapper {
    public static WorkspaceDto ToWorkspaceDto(Workspace workspace, int userId) {
        int memberCount = workspace.UserWorkspaces.Count;
        int documentCount = workspace.Documents.Count;
        string creatorName = workspace.Creator != null
            ? $"{workspace.Creator.FirstName} {workspace.Creator.LastName}"
            : string.Empty;

        UserWorkspaceRole userRole = workspace.UserWorkspaces
                 .FirstOrDefault(uw => uw.UserId == userId)?.Role
                 ?? UserWorkspaceRole.Member;


        WorkspaceVisibility visibility = workspace.Visibility switch {
            WorkspaceVisibility.Private => WorkspaceVisibility.Private,
            WorkspaceVisibility.Public => WorkspaceVisibility.Public,
            _ => WorkspaceVisibility.Private
        };

        // Map documents to DTOs
        var documentDtos = workspace.Documents.Select(d => DocumentMapper.ToDocumentDto(d));

        return new WorkspaceDto {
            Id = workspace.Id,
            Name = workspace.Name,
            Description = workspace.Description,
            Visibility = visibility,
            CreatedBy = workspace.CreatedBy,
            CreatedAt = workspace.CreatedAt,
            UpdatedAt = workspace.UpdatedAt,
            CreatorName = creatorName,
            MemberCount = memberCount,
            DocumentCount = documentCount,
            UserRole = userRole,
            Documents = documentDtos
        };
    }
}
