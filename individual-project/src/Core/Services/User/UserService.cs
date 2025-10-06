namespace Core.Services.User;

using Core.Exceptions;
using Core.Interfaces.User;
using Core.Models;

public class UserService : IUserService {
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository) {
        _userRepository = userRepository;
    }

    public async Task<User?> GetByIdUser(int id) {

        User? user = await _userRepository.GetByIdAsync(id);

        if (user == null) {
            throw AppException.CreateError("USER_NOT_FOUND");
        }

        return user;
    }

    public async Task UpdateUser(int id, Dictionary<string, object> updates) {
        User? user = await _userRepository.GetByIdAsync(id);

        if (user == null) {
            throw AppException.CreateError("USER_NOT_FOUND");
        }

        // Apply updates to user object
        foreach (var update in updates) {
            var property = typeof(User).GetProperty(update.Key);
            if (property != null && property.CanWrite) {
                property.SetValue(user, update.Value);
            }
        }

        await _userRepository.UpdateAsync(user);
    }

    public async Task DeleteUser(int id) {
        User? user = await _userRepository.GetByIdAsync(id);

        if (user == null) {
            throw AppException.CreateError("USER_NOT_FOUND");
        }

        bool deleted = await _userRepository.DeleteAsync(id);

        if (!deleted) {
            throw AppException.CreateError("USER_DELETE_FAILED");
        }
    }
}
