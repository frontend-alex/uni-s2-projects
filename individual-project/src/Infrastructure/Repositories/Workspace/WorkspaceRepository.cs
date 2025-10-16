namespace Infrastructure.Repositories.Workspace;

using Core.Models;
using Core.Interfaces.Repositories.Workspace;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence.SQL;


public class WorkspaceRepository : IWorkspaceRepository {
    private readonly ApplicationDbContext _context;

    public WorkspaceRepository(ApplicationDbContext context) {
        _context = context;
    }

    public async Task<Workspace?> GetByIdAsync(int id) {
        return await _context.Workspaces
            .Include(w => w.Creator)
            .Include(w => w.UserWorkspaces)
            .Include(w => w.Documents)
            .FirstOrDefaultAsync(w => w.Id == id);
    }

    public async Task<Workspace> CreateAsync(Workspace workspace) {
        _context.Workspaces.Add(workspace);
        await _context.SaveChangesAsync();
        return workspace;
    }

    public async Task<Workspace> UpdateAsync(Workspace workspace) {
        _context.Workspaces.Update(workspace);
        await _context.SaveChangesAsync();
        return workspace;
    }

    public async Task<bool> DeleteAsync(int id) {
        var workspace = await _context.Workspaces.FindAsync(id);
        if (workspace == null) return false;

        _context.Workspaces.Remove(workspace);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Workspace>> GetByUserIdAsync(int userId) {
        return await _context.Workspaces
            .Include(w => w.Creator)
            .Include(w => w.UserWorkspaces)
            .Include(w => w.Documents)
            .Where(w => w.UserWorkspaces.Any(uw => uw.UserId == userId))
            .ToListAsync();
    }

    public async Task<bool> ExistsAsync(int id) {
        return await _context.Workspaces
            .AnyAsync(w => w.Id == id);
    }
}


