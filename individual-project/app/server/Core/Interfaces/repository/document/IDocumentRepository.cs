namespace Core.Interfaces.repository.Document;

using Core.Models;

public interface IDocumentRepository {
    Task<Document?> GetByIdAsync(int id);
    Task<Document?> GetByYDocIdAsync(string yDocId);
    Task<IEnumerable<Document>> GetByWorkspaceIdAsync(int workspaceId);
    Task<Document> CreateAsync(Document document);
    Task<Document> UpdateAsync(Document document);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}


