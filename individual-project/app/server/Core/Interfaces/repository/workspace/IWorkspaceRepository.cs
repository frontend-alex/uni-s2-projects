namespace Core.Interfaces.repository.workspace;

using Core.Models;

public interface IWorkspaceRepository {
    Task<Workspace?> GetByIdAsync(int id);
    Task<Workspace> CreateAsync(Workspace workspace);
    Task<Workspace> UpdateAsync(Workspace workspace);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<Workspace>> GetByUserIdAsync(int userId);
    Task<bool> ExistsAsync(int id);
}
