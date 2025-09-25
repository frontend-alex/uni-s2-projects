using MongoDB.Bson;
using server.Models;
using server.Repositories;

namespace server.Repositories.Adapters;

/// <summary>
/// Adapter that wraps the MongoDB UserRepo to implement the generic IUserRepository interface
/// </summary>
public class MongoUserRepositoryAdapter : IUserRepository
{
    private readonly IUserRepo _mongoUserRepo;

    public MongoUserRepositoryAdapter(IUserRepo mongoUserRepo)
    {
        _mongoUserRepo = mongoUserRepo;
    }

    public async Task<User> Create(User user)
    {
        return await _mongoUserRepo.Create(user);
    }

    public async Task<User> Update(User user)
    {
        return await _mongoUserRepo.Update(user);
    }

    public async Task<bool> Delete(string id)
    {
        if (ObjectId.TryParse(id, out var objectId))
        {
            return await _mongoUserRepo.Delete(objectId);
        }
        return false;
    }

    public async Task<User?> GetById(string id)
    {
        if (ObjectId.TryParse(id, out var objectId))
        {
            return await _mongoUserRepo.FindByQuery("id", objectId);
        }
        return null;
    }
    public async Task<bool> ExistsByEmail(string email)
    {
        return await _mongoUserRepo.ExistsByEmail(email);
    }

    public async Task<bool> ExistsByUsername(string username)
    {
        return await _mongoUserRepo.ExistsByUsername(username);
    }

    public async Task<User?> FindByEmail(string email)
    {
        return await _mongoUserRepo.FindByQuery("email", email);
    }

    public async Task<User?> FindByUsername(string username)
    {
        return await _mongoUserRepo.FindByQuery("username", username);
    }

    public async Task<User?> FindByQuery(string fieldName, object value)
    {
        return await _mongoUserRepo.FindByQuery(fieldName, value);
    }
}
