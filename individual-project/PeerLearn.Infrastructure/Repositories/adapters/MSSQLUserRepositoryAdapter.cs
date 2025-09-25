using PeerLearn.Core.Entities;
using PeerLearn.Core.Interfaces;
using PeerLearn.Infrastructure.Data.Models;
using PeerLearn.Infrastructure.Repositories;

namespace PeerLearn.Infrastructure.Repositories.Adapters;

/// <summary>
/// Adapter that wraps the MSSQL UserRepo to implement the generic IUserRepository interface
/// </summary>
public class MSSQLUserRepositoryAdapter : IUserRepository
{
    private readonly IMSSQLUserRepository _mssqlUserRepo;

    public MSSQLUserRepositoryAdapter(IMSSQLUserRepository mssqlUserRepo)
    {
        _mssqlUserRepo = mssqlUserRepo;
    }

    public async Task<User> Create(User user)
    {
        // Convert MongoDB User to MSSQL User
        var mssqlUser = ConvertToMSSQLUser(user);
        var createdMssqlUser = await _mssqlUserRepo.Create(mssqlUser);
        return ConvertToMongoUser(createdMssqlUser);
    }

    public async Task<User> Update(User user)
    {
        // Convert MongoDB User to MSSQL User
        var mssqlUser = ConvertToMSSQLUser(user);
        var updatedMssqlUser = await _mssqlUserRepo.Update(mssqlUser);
        return ConvertToMongoUser(updatedMssqlUser);
    }

    public async Task<bool> Delete(string id)
    {
        if (int.TryParse(id, out var intId))
        {
            return await _mssqlUserRepo.Delete(intId);
        }
        return false;
    }

    public async Task<User?> GetById(string id)
    {
        if (int.TryParse(id, out var intId))
        {
            var mssqlUser = await _mssqlUserRepo.GetById(intId);
            return mssqlUser != null ? ConvertToMongoUser(mssqlUser) : null;
        }
        return null;
    }

    public async Task<IEnumerable<User>> GetAll()
    {
        var mssqlUsers = await _mssqlUserRepo.GetAll();
        return mssqlUsers.Select(ConvertToMongoUser);
    }

    public async Task<bool> ExistsByEmail(string email)
    {
        return await _mssqlUserRepo.ExistsByEmail(email);
    }

    public async Task<bool> ExistsByUsername(string username)
    {
        return await _mssqlUserRepo.ExistsByUsername(username);
    }

    public async Task<User?> FindByEmail(string email)
    {
        var mssqlUser = await _mssqlUserRepo.FindByEmail(email);
        return mssqlUser != null ? ConvertToMongoUser(mssqlUser) : null;
    }

    public async Task<User?> FindByUsername(string username)
    {
        var mssqlUser = await _mssqlUserRepo.FindByUsername(username);
        return mssqlUser != null ? ConvertToMongoUser(mssqlUser) : null;
    }

    public async Task<User?> FindByQuery(string fieldName, object value)
    {
        // Handle different field names and value types
        switch (fieldName.ToLower())
        {
            case "id":
                if (int.TryParse(value.ToString(), out var intId))
                {
                    var mssqlUser = await _mssqlUserRepo.GetById(intId);
                    return mssqlUser != null ? ConvertToMongoUser(mssqlUser) : null;
                }
                break;
            case "email":
                return await FindByEmail(value.ToString()!);
            case "username":
                return await FindByUsername(value.ToString()!);
            case "role":
                var mssqlUsers = await _mssqlUserRepo.FindByRole((PeerLearn.Core.Enums.Role)value);
                return mssqlUsers.FirstOrDefault() != null ? ConvertToMongoUser(mssqlUsers.First()) : null;
        }
        return null;
    }

    private static User ConvertToMongoUser(MSSQLUser mssqlUser)
    {
        return new User
        {
            Id = MongoDB.Bson.ObjectId.GenerateNewId(),
            Username = mssqlUser.Username,
            ProfilePicture = mssqlUser.ProfilePicture,
            Email = mssqlUser.Email,
            Role = mssqlUser.Role,
            Xp = mssqlUser.Xp,
            Password = mssqlUser.Password,
            EmailVerified = mssqlUser.EmailVerified,
            HasPassword = mssqlUser.HasPassword,
            Provider = mssqlUser.Provider,
            LastLoginAt = mssqlUser.LastLoginAt,
            OnBoardingCompleted = mssqlUser.OnBoardingCompleted,
            CreatedAt = mssqlUser.CreatedAt,
            UpdatedAt = mssqlUser.UpdatedAt
        };
    }

    private static MSSQLUser ConvertToMSSQLUser(User mongoUser)
    {
        return new MSSQLUser
        {
            Id = 0, // Will be set by database
            Username = mongoUser.Username,
            ProfilePicture = mongoUser.ProfilePicture,
            Email = mongoUser.Email,
            Role = mongoUser.Role,
            Xp = mongoUser.Xp,
            Password = mongoUser.Password,
            EmailVerified = mongoUser.EmailVerified,
            HasPassword = mongoUser.HasPassword,
            Provider = mongoUser.Provider,
            LastLoginAt = mongoUser.LastLoginAt,
            OnBoardingCompleted = mongoUser.OnBoardingCompleted,
            CreatedAt = mongoUser.CreatedAt,
            UpdatedAt = mongoUser.UpdatedAt
        };
    }
}
