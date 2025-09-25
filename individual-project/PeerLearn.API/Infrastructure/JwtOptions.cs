namespace PeerLearn.API.Infrastructure;

/// <summary>
/// JwtOptions is a class that contains the options for the Jwt authentication.
/// </summary>
public sealed class JwtOptions
{
    public const string SectionName = "PeerLearnJwt";
    public string Issuer { get; init; } = default!;
    public string Audience { get; init; } = default!;
    public string Key { get; init; } = default!;
}
