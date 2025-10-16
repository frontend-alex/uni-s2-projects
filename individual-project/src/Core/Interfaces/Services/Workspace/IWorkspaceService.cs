namespace Core.Interfaces.Services.Workspace;

using Core.Models;
using Core.Enums;

public interface IWorkspaceService {
    Task<Workspace> CreateWorkspaceAsync(int creatorId, string name, WorkspaceVisibility visibility);
    Task<Workspace?> GetWorkspaceAsync(int workspaceId, int userId);
    Task<IEnumerable<Workspace>> GetUserWorkspacesAsync(int userId);
    Task<bool> DeleteWorkspaceAsync(int workspaceId, int userId);
    Task<Workspace> UpdateWorkspaceAsync(int workspaceId, int userId, string? name, string? description, WorkspaceVisibility? visibility);
}
