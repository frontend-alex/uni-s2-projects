namespace Core.Interfaces.Services;

using System.Security.Claims;
using Core.Models;

public interface IJwtService {
    string GenerateToken(User user);
    ClaimsPrincipal? ValidateToken(string token);
    bool IsTokenValid(string token);
}