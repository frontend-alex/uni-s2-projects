namespace Core.Interfaces.Services.User;

using Core.Models;

public interface IUserService {
    Task<User?> GetByIdUser(int id);
    Task UpdateUser(int id, Dictionary<string, object> updates);
    Task DeleteUser(int id);
}
