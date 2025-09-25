using MongoDB.Bson;
using PeerLearn.Core.Entities;

namespace PeerLearn.Infrastructure.Repositories;

public interface IMongoUserRepository
{
    Task<User> Create(User user);
    Task<User> Update(User user);
    Task<bool> Delete(ObjectId id);
    Task<User?> GetById(ObjectId id);
    Task<IEnumerable<User>> GetAll();
    Task<bool> ExistsByEmail(string email);
    Task<bool> ExistsByUsername(string username);
    Task<User?> FindByEmail(string email);
    Task<User?> FindByUsername(string username);
    Task<User?> FindByQuery(string fieldName, object value);
}
