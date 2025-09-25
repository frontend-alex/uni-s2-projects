namespace PeerLearn.API.Infrastructure;

public sealed class MongoDbOptions {
    public const string SectionName = "PeerLearnDb";
    public string ConnectionString { get; init; } = default!;
    public string DatabaseName { get; init; } = default!;
    public bool RetryWrites { get; init; } = true;
    public int MaxConnectionPoolSize { get; init; } = 100;
}