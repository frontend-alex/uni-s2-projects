using MongoDB.Driver;
using Microsoft.Extensions.Options;
using PeerLearn.Infrastructure.Data;
using MongoDB.Bson.Serialization.Conventions;

namespace PeerLearn.API.Infrastructure.Security;

public static class MongoExtensions {
    public static IServiceCollection AddMongo(this IServiceCollection services, IConfiguration config) {
        services.Configure<MongoDbOptions>(config.GetSection(MongoDbOptions.SectionName));

        // Global conventions such as camelCase, ignore extra, nulls as defaults, 
        // DateTime as UTC so my dumbass doesn't have to think about it
        var pack = new ConventionPack {
            new CamelCaseElementNameConvention(),
            new IgnoreExtraElementsConvention(true),
            new IgnoreIfNullConvention(true),
            new EnumRepresentationConvention(MongoDB.Bson.BsonType.String)
        };
        ConventionRegistry.Register("app-conventions", pack, _ => true);

        services.AddSingleton<IMongoClient>(sp => {
            var opt = sp.GetRequiredService<IOptions<MongoDbOptions>>().Value;
            var settings = MongoClientSettings.FromConnectionString(opt.ConnectionString);
            settings.RetryWrites = opt.RetryWrites;
            settings.MaxConnectionPoolSize = (int)opt.MaxConnectionPoolSize;

            // Always use modern server selection timeouts
            settings.ServerSelectionTimeout = TimeSpan.FromSeconds(5);
            return new MongoClient(settings);
        });

        services.AddSingleton(sp => {
            var opt = sp.GetRequiredService<IOptions<MongoDbOptions>>().Value;
            var client = sp.GetRequiredService<IMongoClient>();
            return client.GetDatabase(opt.DatabaseName);
        });
        return services;
    }
}
