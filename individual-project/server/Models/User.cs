namespace server.Models;

using MongoDB.Bson;
using server.Contracts.Enums;
using MongoDB.Bson.Serialization.Attributes;

public sealed class User {
    [BsonId] public required ObjectId Id { get; set; }
    [BsonElement("username")] public required string Username { get; set; }
    [BsonElement("profilePicture")] public required string ProfilePicture { get; set; }
    [BsonElement("email")] public required string Email { get; set; }
    [BsonElement("role")] public required Role Role { get; set; }
    [BsonElement("xp")] public required int Xp { get; set; }
    [BsonElement("password")] public required string Password { get; set; }
    [BsonElement("emailVerified")] public required bool EmailVerified { get; set; }
    [BsonElement("hasPassword")] public required bool HasPassword { get; set; }
    [BsonElement("provider")] public required Provider Provider { get; set; }
    [BsonElement("lastLoginAt")] public required DateTime LastLoginAt { get; set; }
    [BsonElement("onBoardingCompleted")] public required bool OnBoardingCompleted { get; set; }
    [BsonElement("createdAt")] public required DateTime CreatedAt { get; set; }
    [BsonElement("updatedAt")] public required DateTime UpdatedAt { get; set; }
}

