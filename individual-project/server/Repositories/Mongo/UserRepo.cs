using MongoDB.Bson;
using MongoDB.Driver;
using server.Models;

namespace server.Repositories;

public class UserRepo : IUserRepo {
    private readonly IMongoCollection<User> _users;

    public UserRepo(IMongoDatabase database) {
        _users = database.GetCollection<User>("users");
    }

    public async Task<User> Create(User user) {
        await _users.InsertOneAsync(user);
        return user;
    }


    public async Task<User> Update(User user) {
        await _users.ReplaceOneAsync(u => u.Id == user.Id, user);
        return user;
    }

    public async Task<bool> Delete(ObjectId id) {
        var result = await _users.DeleteOneAsync(u => u.Id == id);
        return result.DeletedCount > 0;
    }

    public async Task<bool> ExistsByEmail(string email) {
        var count = await _users.CountDocumentsAsync(u => u.Email == email);
        return count > 0;
    }

    public async Task<bool> ExistsByUsername(string username) {
        var count = await _users.CountDocumentsAsync(u => u.Username == username);
        return count > 0;
    }

    public async Task<User?> FindByQuery(string fieldName, object value) {
        FilterDefinition<User> filter;

        switch (fieldName.ToLower()) {
            case "id":
                if (value is string strId && ObjectId.TryParse(strId, out var objectId)) {
                    filter = Builders<User>.Filter.Eq(u => u.Id, objectId);
                }
                else if (value is ObjectId id) {
                    filter = Builders<User>.Filter.Eq(u => u.Id, id);
                }
                else {
                    return null;
                }
                break;

            case "email":
                filter = Builders<User>.Filter.Eq(u => u.Email, value.ToString());
                break;

            case "username":
                filter = Builders<User>.Filter.Eq(u => u.Username, value.ToString());
                break;

            case "profilepicture":
                filter = Builders<User>.Filter.Eq(u => u.ProfilePicture, value.ToString());
                break;

            case "role":
                if (Enum.TryParse<server.Contracts.Enums.Role>(value.ToString(), true, out var role)) {
                    filter = Builders<User>.Filter.Eq(u => u.Role, role);
                }
                else {
                    return null;
                }
                break;

            case "xp":
                if (int.TryParse(value.ToString(), out var xp)) {
                    filter = Builders<User>.Filter.Eq(u => u.Xp, xp);
                }
                else {
                    return null; 
                }
                break;

            case "emailverified":
                if (bool.TryParse(value.ToString(), out var emailVerified)) {
                    filter = Builders<User>.Filter.Eq(u => u.EmailVerified, emailVerified);
                }
                else {
                    return null;
                }
                break;

            case "haspassword":
                if (bool.TryParse(value.ToString(), out var hasPassword)) {
                    filter = Builders<User>.Filter.Eq(u => u.HasPassword, hasPassword);
                }
                else {
                    return null; 
                }
                break;

            case "provider":
                if (Enum.TryParse<Contracts.Enums.Provider>(value.ToString(), true, out var provider)) {
                    filter = Builders<User>.Filter.Eq(u => u.Provider, provider);
                }
                else {
                    return null; 
                }
                break;

            case "onboardingcompleted":
                if (bool.TryParse(value.ToString(), out var onBoardingCompleted)) {
                    filter = Builders<User>.Filter.Eq(u => u.OnBoardingCompleted, onBoardingCompleted);
                }
                else {
                    return null;
                }
                break;

            case "lastloginat":
            case "createdat":
            case "updatedat":
                if (DateTime.TryParse(value.ToString(), out var dateTime)) {
                    filter = Builders<User>.Filter.Eq(fieldName, dateTime);
                }
                else {
                    return null; 
                }
                break;

            default:
                filter = Builders<User>.Filter.Eq(fieldName, value);
                break;
        }

        return await _users.Find(filter).FirstOrDefaultAsync();
    }
}
