# MSSQL Repository

This directory contains the MSSQL repository implementation for the PeerLearn application.

## Structure

- `IUserRepo.cs` - Interface defining the contract for user repository operations
- `UserRepo.cs` - Implementation of the user repository using Entity Framework Core with SQL Server

## Features

- Full CRUD operations for User entity
- Email and username uniqueness validation
- Role-based user queries
- Entity Framework Core integration
- SQL Server database support

## Usage

The MSSQL repository is registered in the DI container and can be injected into controllers or services:

```csharp
public class MyController : ControllerBase
{
    private readonly IUserRepo _userRepo;

    public MyController(IUserRepo userRepo)
    {
        _userRepo = userRepo;
    }
}
```

## Database Setup

1. Ensure SQL Server is running (LocalDB is used by default)
2. Run the database creation script: `scripts/create-database.sql`
3. The application will automatically create the database schema on first run

## Connection String

The connection string is configured in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=PeerLearnDb;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=true"
  }
}
```

## API Endpoints

The MSSQL User controller provides the following endpoints:

- `GET /api/MSSQLUser` - Get all users
- `GET /api/MSSQLUser/{id}` - Get user by ID
- `GET /api/MSSQLUser/email/{email}` - Get user by email
- `GET /api/MSSQLUser/username/{username}` - Get user by username
- `POST /api/MSSQLUser` - Create new user
- `PUT /api/MSSQLUser/{id}` - Update user
- `DELETE /api/MSSQLUser/{id}` - Delete user
