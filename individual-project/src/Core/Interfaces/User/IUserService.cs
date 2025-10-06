namespace Core.Interfaces.User;

using Core.Models;
public interface IUserService {
    Task<User?> GetByIdUser(int id);
    Task<string> UpdateUser(int id, Dictionary<string, object> updates);
    Task<string> DeleteUser(int id);
}
