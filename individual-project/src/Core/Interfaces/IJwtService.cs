using System.Security.Claims;
using Core.Models;

namespace Core.Interfaces;

public interface IJwtService {
    string GenerateToken(User user);
    ClaimsPrincipal? ValidateToken(string token);
    bool IsTokenValid(string token);
}
