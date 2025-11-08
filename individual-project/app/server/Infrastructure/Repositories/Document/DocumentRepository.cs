using Core.Models;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence.SQL;
using Core.Interfaces.repository.Document;

namespace Infrastructure.Repositories;

public class DocumentRepository : IDocumentRepository {
    private readonly ApplicationDbContext _context;

    public DocumentRepository(ApplicationDbContext context) {
        _context = context;
    }

    public async Task<Document?> GetByIdAsync(int id) {
        return await _context.Documents
            .Include(d => d.Workspace)
            .Include(d => d.Creator)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<Document?> GetByYDocIdAsync(string yDocId) {
        return await _context.Documents
            .Include(d => d.Workspace)
            .Include(d => d.Creator)
            .FirstOrDefaultAsync(d => d.YDocId == yDocId);
    }

    public async Task<IEnumerable<Document>> GetByWorkspaceIdAsync(int workspaceId) {
        return await _context.Documents
            .Include(d => d.Workspace)
            .Include(d => d.Creator)
            .Where(d => d.WorkspaceId == workspaceId)
            .ToListAsync();
    }

    public async Task<Document> CreateAsync(Document document) {
        _context.Documents.Add(document);
        await _context.SaveChangesAsync();
        return document;
    }

    public async Task<Document> UpdateAsync(Document document) {
        _context.Documents.Update(document);
        await _context.SaveChangesAsync();
        return document;
    }

    public async Task<bool> DeleteAsync(int id) {
        var document = await _context.Documents.FindAsync(id);
        if (document == null) return false;

        _context.Documents.Remove(document);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id) {
        return await _context.Documents.AnyAsync(d => d.Id == id);
    }
}


