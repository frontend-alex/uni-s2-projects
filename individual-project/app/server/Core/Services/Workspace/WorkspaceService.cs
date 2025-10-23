namespace Core.Services.Workspace;

using Core.Models;
using Core.Enums;
using Core.Exceptions;
using Core.DTOs.Workspace;
using Infrastructure.Repositories.Workspace;
using Infrastructure.Repositories;


public class WorkspaceService {
    private readonly IWorkspaceRepository _workspaceRepository;
    private readonly IUserWorkspaceRepository _userWorkspaceRepository;
    private readonly IUserRepository _userRepository;

    public WorkspaceService(
        IWorkspaceRepository workspaceRepository,
        IUserWorkspaceRepository userWorkspaceRepository,
        IUserRepository userRepository) {
        _workspaceRepository = workspaceRepository;
        _userWorkspaceRepository = userWorkspaceRepository;
        _userRepository = userRepository;
    }

    public async Task<WorkspaceDto> CreateWorkspaceAsync(int creatorId, string name, WorkspaceVisibility visibility) {
        var creator = await _userRepository.GetByIdAsync(creatorId);
        if (creator == null) {
            throw AppException.CreateError("USER_NOT_FOUND");
        }

        // Validate input
        if (string.IsNullOrWhiteSpace(name)) {
            throw AppException.CreateError("WORKSPACE_NAME_REQUIRED");
        }

        if (name.Length > 128) {
            throw AppException.CreateError("WORKSPACE_NAME_TOO_LONG");
        }

        // Create workspace with hardcoded description
        Workspace workspace = new Workspace {
            Name = name.Trim(),
            Description = "A collaborative workspace for learning and studying together.",
            Visibility = visibility,
            CreatedBy = creatorId
        };

        Workspace createdWorkspace = await _workspaceRepository.CreateAsync(workspace);

        // Add creator as owner
        var userWorkspace = new UserWorkspace {
            UserId = creatorId,
            WorkspaceId = createdWorkspace.Id,
            Role = UserWorkspaceRole.Owner,
            JoinedAt = DateTime.UtcNow
        };

        await _userWorkspaceRepository.CreateAsync(userWorkspace);

        // Update user's onboarding status to true
        creator.Onboarding = true;
        await _userRepository.UpdateAsync(creator);

        // Return DTO
        return new WorkspaceDto {
            Id = createdWorkspace.Id,
            Name = createdWorkspace.Name,
            Description = createdWorkspace.Description,
            Visibility = createdWorkspace.Visibility,
            CreatedBy = createdWorkspace.CreatedBy,
            CreatedAt = createdWorkspace.CreatedAt,
            UpdatedAt = createdWorkspace.UpdatedAt,
            CreatorName = $"{creator.FirstName} {creator.LastName}".Trim(),
            MemberCount = 1,
            DocumentCount = 0,
            UserRole = UserWorkspaceRole.Owner
        };
    }

    public async Task<WorkspaceDto?> GetWorkspaceAsync(int workspaceId, int userId) {
        // Check if user has access to workspace
        bool hasAccess = await _userWorkspaceRepository.UserHasAccessAsync(userId, workspaceId);

        if (!hasAccess) {
            throw AppException.CreateError("WORKSPACE_ACCESS_DENIED");
        }

        var workspace = await _workspaceRepository.GetByIdAsync(workspaceId);
        
        if (workspace == null) {
            throw AppException.CreateError("WORKSPACE_ACCESS_DENIED");
        }

        // Find the current user's role in this workspace
        var userWorkspace = workspace.UserWorkspaces?.FirstOrDefault(uw => uw.UserId == userId);
        var userRole = userWorkspace?.Role ?? UserWorkspaceRole.Member;

        return new WorkspaceDto {
            Id = workspace.Id,
            Name = workspace.Name,
            Description = workspace.Description,
            Visibility = workspace.Visibility,
            CreatedBy = workspace.CreatedBy,
            CreatedAt = workspace.CreatedAt,
            UpdatedAt = workspace.UpdatedAt,
            CreatorName = $"{workspace.Creator?.FirstName} {workspace.Creator?.LastName}".Trim(),
            MemberCount = workspace.UserWorkspaces?.Count ?? 0,
            DocumentCount = workspace.Documents?.Count ?? 0,
            UserRole = userRole
        };
    }

    public async Task<IEnumerable<WorkspaceDto>> GetUserWorkspacesAsync(int userId) {
        
        var workspaces = await _workspaceRepository.GetByUserIdAsync(userId);
        
        return workspaces.Select(w => {
            // Find the current user's role in this workspace
            var userWorkspace = w.UserWorkspaces?.FirstOrDefault(uw => uw.UserId == userId);
            var userRole = userWorkspace?.Role ?? UserWorkspaceRole.Member;

            return new WorkspaceDto {
                Id = w.Id,
                Name = w.Name,
                Description = w.Description,
                Visibility = w.Visibility,
                CreatedBy = w.CreatedBy,
                CreatedAt = w.CreatedAt,
                UpdatedAt = w.UpdatedAt,
                CreatorName = $"{w.Creator?.FirstName} {w.Creator?.LastName}".Trim(),
                MemberCount = w.UserWorkspaces?.Count ?? 0,
                DocumentCount = w.Documents?.Count ?? 0,
                UserRole = userRole
            };
        });
    }

    public async Task<bool> DeleteWorkspaceAsync(int workspaceId, int userId) {
        // Check if user is owner
        var isOwner = await _userWorkspaceRepository.UserIsOwnerAsync(userId, workspaceId);
        if (!isOwner) {
            throw AppException.CreateError("USER_WORKSPACE_INSUFFICIENT_PERMISSIONS");
        }

        return await _workspaceRepository.DeleteAsync(workspaceId);
    }

    public async Task<WorkspaceDto> UpdateWorkspaceAsync(int workspaceId, int userId, string? name, string? description, WorkspaceVisibility? visibility) {
        // Check if user has access and is owner or cohost
        var hasAccess = await _userWorkspaceRepository.UserHasAccessAsync(userId, workspaceId);
        if (!hasAccess) {
            throw AppException.CreateError("WORKSPACE_ACCESS_DENIED");
        }

        var workspace = await _workspaceRepository.GetByIdAsync(workspaceId);

        if (workspace == null) {
            throw AppException.CreateError("WORKSPACE_NOT_FOUND");
        }

        // Update fields if provided
        if (!string.IsNullOrWhiteSpace(name)) {
            if (name.Length > 128) {
                throw AppException.CreateError("WORKSPACE_NAME_TOO_LONG");
            }
            workspace.Name = name.Trim();
        }

        if (description != null) {
            if (description.Length > 1000) {
                throw AppException.CreateError("WORKSPACE_DESCRIPTION_TOO_LONG");
            }
            workspace.Description = description.Trim();
        }

        if (visibility.HasValue) {
            workspace.Visibility = visibility.Value;
        }

        var updatedWorkspace = await _workspaceRepository.UpdateAsync(workspace);

        // Find the current user's role in this workspace
        var userWorkspace = updatedWorkspace.UserWorkspaces?.FirstOrDefault(uw => uw.UserId == userId);
        var userRole = userWorkspace?.Role ?? UserWorkspaceRole.Member;

        return new WorkspaceDto {
            Id = updatedWorkspace.Id,
            Name = updatedWorkspace.Name,
            Description = updatedWorkspace.Description,
            Visibility = updatedWorkspace.Visibility,
            CreatedBy = updatedWorkspace.CreatedBy,
            CreatedAt = updatedWorkspace.CreatedAt,
            UpdatedAt = updatedWorkspace.UpdatedAt,
            CreatorName = $"{updatedWorkspace.Creator?.FirstName} {updatedWorkspace.Creator?.LastName}".Trim(),
            MemberCount = updatedWorkspace.UserWorkspaces?.Count ?? 0,
            DocumentCount = updatedWorkspace.Documents?.Count ?? 0,
            UserRole = userRole
        };
    }
}
