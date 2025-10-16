namespace Core.Services.Workspace;

using Core.Models;
using Core.Enums;
using Core.Interfaces.Services.Workspace;
using Core.Interfaces.Repositories.Workspace;
using Core.Interfaces.Repositories.User;
using Core.Exceptions;

public class WorkspaceService : IWorkspaceService {
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

    public async Task<Workspace> CreateWorkspaceAsync(int creatorId, string name, WorkspaceVisibility visibility) {
        // Validate creator exists
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

        return createdWorkspace;
    }

    public async Task<Workspace?> GetWorkspaceAsync(int workspaceId, int userId) {
        // Check if user has access to workspace
        var hasAccess = await _userWorkspaceRepository.UserHasAccessAsync(userId, workspaceId);
        if (!hasAccess) {
            throw AppException.CreateError("WORKSPACE_ACCESS_DENIED");
        }

        return await _workspaceRepository.GetByIdAsync(workspaceId);
    }

    public async Task<IEnumerable<Workspace>> GetUserWorkspacesAsync(int userId) {
        return await _workspaceRepository.GetByUserIdAsync(userId);
    }

    public async Task<bool> DeleteWorkspaceAsync(int workspaceId, int userId) {
        // Check if user is owner
        var isOwner = await _userWorkspaceRepository.UserIsOwnerAsync(userId, workspaceId);
        if (!isOwner) {
            throw AppException.CreateError("USER_WORKSPACE_INSUFFICIENT_PERMISSIONS");
        }

        return await _workspaceRepository.DeleteAsync(workspaceId);
    }

    public async Task<Workspace> UpdateWorkspaceAsync(int workspaceId, int userId, string? name, string? description, WorkspaceVisibility? visibility) {
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

        return await _workspaceRepository.UpdateAsync(workspace);
    }
}
