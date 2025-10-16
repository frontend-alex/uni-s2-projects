using Core.Models;
using Core.Interfaces.Repositories.User;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence.SQL;

namespace Infrastructure.Repositories;

// User repository implementation
public class UserRepository : IUserRepository {
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context) {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id) {
        return await _context.Users.FindAsync(id);
    }

    public async Task<User?> GetByEmailAsync(string email) {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetByUsernameAsync(string username) {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<IEnumerable<User>> GetAllAsync() {
        return await _context.Users.ToListAsync();
    }

    public async Task<User> CreateAsync(User user) {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpdateAsync(User user) {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<bool> DeleteAsync(int id) {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsByEmailAsync(string email) {
        return await _context.Users
            .AnyAsync(u => u.Email == email);
    }

    public async Task<bool> ExistsByUsernameAsync(string username) {
        return await _context.Users
            .AnyAsync(u => u.Username == username);
    }
}
