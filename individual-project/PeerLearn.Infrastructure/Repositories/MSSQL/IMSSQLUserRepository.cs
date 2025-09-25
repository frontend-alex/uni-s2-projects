using PeerLearn.Infrastructure.Data.Models;

namespace PeerLearn.Infrastructure.Repositories;

public interface IMSSQLUserRepository
{
    Task<MSSQLUser> Create(MSSQLUser user);
    Task<MSSQLUser> Update(MSSQLUser user);
    Task<bool> Delete(int id);
    Task<MSSQLUser?> GetById(int id);
    Task<IEnumerable<MSSQLUser>> GetAll();
    Task<bool> ExistsByEmail(string email);
    Task<bool> ExistsByUsername(string username);
    Task<MSSQLUser?> FindByEmail(string email);
    Task<MSSQLUser?> FindByUsername(string username);
    Task<IEnumerable<MSSQLUser>> FindByRole(PeerLearn.Core.Enums.Role role);
}
