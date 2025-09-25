using Microsoft.EntityFrameworkCore;
using PeerLearn.Infrastructure.Data;
using PeerLearn.Infrastructure.Data.Models;

namespace PeerLearn.Infrastructure.Repositories;

public class MSSQLUserRepository : IMSSQLUserRepository
{
    private readonly ApplicationDbContext _context;

    public MSSQLUserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<MSSQLUser> Create(MSSQLUser user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<MSSQLUser> Update(MSSQLUser user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<bool> Delete(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return false;

        _context.Users.Remove(user);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<MSSQLUser?> GetById(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<IEnumerable<MSSQLUser>> GetAll()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<bool> ExistsByEmail(string email)
    {
        return await _context.Users.AnyAsync(u => u.Email == email);
    }

    public async Task<bool> ExistsByUsername(string username)
    {
        return await _context.Users.AnyAsync(u => u.Username == username);
    }

    public async Task<MSSQLUser?> FindByEmail(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<MSSQLUser?> FindByUsername(string username)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<IEnumerable<MSSQLUser>> FindByRole(PeerLearn.Core.Enums.Role role)
    {
        return await _context.Users.Where(u => u.Role == role).ToListAsync();
    }
}
