using System.Text;
using server.Errors;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace server.Shared.Utils.JWT;

public static class JWTUtils {

    /// <summary>
    /// GenerateToken is a method that generates a JWT token.
    /// </summary>
    /// <param name="claims">The claims to include in the token.</param>
    /// <param name="config">The configuration to use.</param>
    /// <param name="tokenLifespan">The lifespan of the token. Default is 1 hour.</param>
    /// <returns>The generated token as a string.</returns>
    public static string GenerateToken(IEnumerable<Claim> claims, IConfiguration config, TimeSpan? tokenLifespan = null) {
        var issuer = config["PeerLearnJwt:Issuer"];
        var audience = config["PeerLearnJwt:Audience"];
        var keyRaw = config["PeerLearnJwt:Key"];

        if (string.IsNullOrWhiteSpace(keyRaw))
            throw ErrorFactory.CreateError("MISSING_JWT_KEY");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyRaw));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.Add(tokenLifespan ?? TimeSpan.FromHours(1)),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }


    /// <summary>
    /// ValidateToken is a method that validates a JWT token.
    /// </summary>
    /// <param name="token">The token to validate.</param>
    /// <param name="config">The configuration to use.</param>
    /// <param name="validateLifetime">Whether to validate the token's lifetime. Default is true.</param>
    public static ClaimsPrincipal? ValidateToken(string token, IConfiguration config, bool validateLifetime = true) {
        var issuer = config["PeerLearnJwt:Issuer"];
        var audience = config["PeerLearnJwt:Audience"];
        var keyRaw = config["PeerLearnJwt:Key"];

        if (string.IsNullOrWhiteSpace(keyRaw)) return null;

        var handler = new JwtSecurityTokenHandler();
        var parameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = validateLifetime,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyRaw)),
            ClockSkew = TimeSpan.FromMinutes(1)
        };

        try {
            var principal = handler.ValidateToken(token, parameters, out _);
            return principal;
        }
        catch {
            return null;
        }
    }
}