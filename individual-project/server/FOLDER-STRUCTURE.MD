# PeerLearn Server — Folder Structure

## API Layer
### `Controllers/`
Handle incoming HTTP requests and return responses. Connects the API to the application layer.  
*Example:* `RoomsController.cs` for creating/joining study rooms.

### `DTOs/`
Data Transfer Objects. Models used for API input and output, preventing domain entities from leaking outside.

### `Hubs/`
SignalR hubs for real-time features like collaborative notes, chat, and presence updates.

### `Middlewares/`
Custom ASP.NET Core middleware (e.g., exception handling, request logging, correlation IDs).

### `Filters/`
ASP.NET filters that add cross-cutting behaviors such as model validation.

### `Constants/`
API-level constants such as route paths and version identifiers.

### `Mapping/`
AutoMapper profiles to map between DTOs and domain models.

## Application Layer
### `Services/`
Business logic for use cases. Each service combines repositories, validation, and domain rules.  
*Example:* `RoomService.cs` → logic for creating rooms and inviting users.

### `Repositories/`
Interfaces (contracts) for data access. Implementations live in `Infrastructure/Repositories`.

## Domain Layer
### `Domain/Entities/`
Core domain models like `User`, `Room`, `Note`, `Flashcard`. Pure C#, no framework dependencies.

### `Domain/ValueObjects/`
Immutable domain concepts such as `Email` or `Badge`.

### `Domain/Enums/`
Enumerations used in the domain (e.g., `Role`, `BadgeType`).

### `Domain/Exceptions/`
Custom exceptions that represent domain rule violations.

## Infrastructure Layer
### `Infrastructure/Persistence/`
MongoDB setup and collection configuration.

### `Infrastructure/Repositories/`
Repository implementations that persist and query domain entities using MongoDB.

### `Infrastructure/Security/`
Security helpers like JWT token generators and password hashing.

### `Infrastructure/External/`
Integrations with third-party APIs and services (e.g., AI flashcard generation).

### `Infrastructure/Options/`
Strongly typed configuration classes (e.g., `JwtOptions`, `DatabaseOptions`).

### `Infrastructure/Logging/`
Logging configuration and extensions (e.g., Serilog).

### `Infrastructure/Caching/`
Optional caching providers and helpers.


## Shared Layer
### `Shared/Results/`
Standard result wrapper classes (`Result<T>`, `Error`) for consistent success/error handling.

### `Shared/Utils/`
General utility classes (e.g., `SlugGenerator`, `Guard`).

### `Shared/Constants/`
Cross-cutting constants used across all layers (e.g., claim types).


## Tests
### `tests/PeerLearn.UnitTests/`
Unit tests for services and domain logic.

### `tests/PeerLearn.IntegrationTests/`
Integration tests for API endpoints and MongoDB operations.


## Rule of Thumb
- **Controllers** = Entry points.  
- **Services** = Business rules.  
- **Repositories** = MongoDB access.  
- **Domain** = The heart of the system (entities, rules).  
- **Infrastructure** = Plumbing (DB, security, external integrations).  
- **Shared** = Utilities everyone can use.  
