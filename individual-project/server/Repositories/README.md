# Repository Pattern Implementation

This directory contains the repository pattern implementation for the PeerLearn application, supporting both MongoDB and MSSQL databases.

## Architecture Overview

The repository pattern provides a clean abstraction layer between the business logic and data access layers, allowing the application to switch between different database implementations without changing the upper layers.

### Key Components

1. **Generic Repository Interface** (`IUserRepository.cs`)
   - Defines the contract for user data operations
   - Database-agnostic interface
   - Used by services and controllers

2. **Database-Specific Implementations**
   - `Mongo/` - MongoDB implementation using MongoDB.Driver
   - `MSSQL/` - MSSQL implementation using Entity Framework Core

3. **Repository Adapters** (`Adapters/`)
   - `MongoUserRepositoryAdapter.cs` - Wraps MongoDB implementation
   - `MSSQLUserRepositoryAdapter.cs` - Wraps MSSQL implementation
   - Both implement the generic `IUserRepository` interface

## Database Configuration

The application can be configured to use either database through the `appsettings.json` file:

```json
{
  "Database": {
    "Type": "MSSQL"  // or "MongoDB"
  }
}
```

### Switching Databases

To switch between databases, simply change the `Database.Type` value in your configuration:

- **MSSQL**: Set `"Type": "MSSQL"`
- **MongoDB**: Set `"Type": "MongoDB"`

The application will automatically register the appropriate repository implementation.

## Usage in Services

Services use the generic `IUserRepository` interface, making them database-agnostic:

```csharp
public class UserService
{
    private readonly IUserRepository _userRepo;

    public UserService(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    // All methods work with any database implementation
    public async Task<UserDTO?> GetUserById(string id)
    {
        var user = await _userRepo.GetById(id);
        return user != null ? UserMapper.ToUserDto(user) : null;
    }
}
```

## Data Model Compatibility

The repository adapters handle the conversion between different data models:

- **MongoDB Model**: Uses `ObjectId` for IDs, MongoDB-specific attributes
- **MSSQL Model**: Uses `int` for IDs, Entity Framework attributes
- **Generic Interface**: Uses `string` for IDs to maintain compatibility

## Benefits

1. **Database Agnostic**: Business logic doesn't depend on specific database implementations
2. **Easy Switching**: Change database by updating configuration
3. **Testability**: Easy to mock repository interfaces for unit testing
4. **Maintainability**: Clear separation of concerns
5. **Flexibility**: Can use different databases for different features

## Adding New Entities

To add a new entity (e.g., `Product`):

1. Create the entity model for each database
2. Create database-specific repository interfaces and implementations
3. Create a generic repository interface
4. Create repository adapters
5. Register the adapters in `Program.cs`

## Migration Strategy

The current implementation includes both MongoDB and MSSQL support, allowing for:

- **Gradual Migration**: Move features one by one from MongoDB to MSSQL
- **Hybrid Approach**: Use different databases for different features
- **A/B Testing**: Test different database implementations
- **Fallback**: Switch back to MongoDB if needed

## Health Checks

The application includes health checks for both databases:

- **MongoDB**: Tests connection with ping command
- **MSSQL**: Tests connection with Entity Framework

Access the health check at: `GET /health`
