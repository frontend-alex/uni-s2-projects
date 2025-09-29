using System.Security.Claims;
using Core.Entities;

namespace App.Contracts.Security;

public interface IJwtService {
    string GenerateToken(User user);
    ClaimsPrincipal? ValidateToken(string token);
    bool IsTokenValid(string token);
}
