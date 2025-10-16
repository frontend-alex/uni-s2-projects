namespace Core.Interfaces.Repositories.Workspace;

using Core.Models;

public interface IUserWorkspaceRepository {
    Task<UserWorkspace> CreateAsync(UserWorkspace userWorkspace);
    Task<bool> DeleteAsync(int userId, int workspaceId);
    Task<UserWorkspace?> GetAsync(int userId, int workspaceId);
    Task<IEnumerable<UserWorkspace>> GetByWorkspaceIdAsync(int workspaceId);
    Task<IEnumerable<UserWorkspace>> GetByUserIdAsync(int userId);
    Task<bool> UserHasAccessAsync(int userId, int workspaceId);
    Task<bool> UserIsOwnerAsync(int userId, int workspaceId);
}


