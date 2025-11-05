## Backend Documentation (API, Core, Infrastructure)

### Solution Layout

- API — HTTP presentation layer (controllers, middleware, setup)
- Core — Domain layer (models, DTOs, services, interfaces, exceptions)
- Infrastructure — Data + cross-cutting services (EF Core, repositories, JWT, password)

### API Layer

- Entry point: `app/server/API/Program.cs`
  - Registers controllers, JSON options (camelCase, indented)
  - Adds security services (CORS + JWT), DbContext, DI for repos/services
  - Adds Swagger in development
  - Ensures database creation on startup

- Controllers
  - Auth: `POST /api/Auth/register`, `POST /api/Auth/login`, `POST /api/Auth/logout`
  - User: `GET /api/User/me`, `PUT /api/User/update`
  - Workspace: `POST /api/Workspace`, `GET /api/Workspace/{id}`, `GET /api/Workspace`, `PUT /api/Workspace/{id}`, `DELETE /api/Workspace/{id}`

- Middleware
  - `ErrorHandler` catches exceptions and emits normalized error responses

- Swagger
  - Added via `AddSwaggerServices` and enabled in development

### Security

- CORS policy `AllowFrontend` configured for localhost dev origins (5173/3000 variants)
- JWT Bearer authentication
  - TokenValidationParameters bound from configuration (`Jwt:SecretKey`, `Jwt:Issuer`, `Jwt:Audience`)
  - Reads JWT from Authorization header or `access_token` cookie via `OnMessageReceived`

### Core Layer

- Models
  - `User`, `Workspace`, `UserWorkspace`, `WorkspaceInvitation`, `Document`, `Otp`, `BaseEntity`

- DTOs
  - `WorkspaceDto` returned by workspace service methods

- Services
  - `AuthService` — register/login, password hashing, JWT issuance
  - `UserService` — user retrieval/update/delete
  - `WorkspaceService` — create/update/delete and listing with role checks

- Interfaces
  - Repositories: `IUserRepository`, `IWorkspaceRepository`, `IUserWorkspaceRepository`, `IOtpRepository`
  - Services: `IJwtService`, `IPasswordService`

- Exceptions
  - `AppException` with error codes and optional extras for consistent error handling

### Infrastructure Layer

- EF Core Context
  - `ApplicationDbContext` with DbSets and fluent configuration for all entities
  - Keys, max lengths, enum conversions, relationships, indexes

- Repositories (EF implementations)
  - `UserRepository`, `WorkspaceRepository`, `UserWorkspaceRepository`, `OtpRepository`

- Services
  - `JwtService` — issues JWT tokens with configured signing key/issuer/audience/expiry
  - `PasswordService` — hashing/verification

### Request Examples

- Register
  - Request: `POST /api/Auth/register` with `{ username, firstName, lastName, email, password }`
  - Response: `{ success, message, data: { email } }`

- Login
  - Request: `POST /api/Auth/login` with `{ email, password }`
  - Response: `{ success, message, data: null }` and sets `access_token` cookie

- Create Workspace
  - Request: `POST /api/Workspace` with `{ name, visibility }` (auth required)
  - Response: `{ success, message, data: WorkspaceDto }`

### Error Contract and Codes

- All exceptions flow to `ErrorHandler`, returning standardized error JSON
- Domain errors come via `AppException.CreateError("CODE", extra?)`

### Configuration

- Env or appsettings.json
  - Database connection under `CONNECTION_STRING` env or `ConnectionStrings:DefaultConnection`
  - JWT under `Jwt:*`


