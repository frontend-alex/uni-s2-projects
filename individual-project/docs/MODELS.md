## Domain Models and DTOs

This document catalogs the key domain entities and data transfer objects, highlighting fields, relationships, and constraints as configured in EF Core.

### Common

- BaseEntity (assumed)
  - `Id: int`
  - `CreatedAt: DateTime`
  - `UpdatedAt: DateTime`

### User

- Properties
  - `Id`, `Username (<=64)`, `FirstName (<=64)`, `LastName (<=64)`
  - `Email (<=320, unique)`, `PasswordHash`
  - `EmailVerified (default false)`, `Onboarding (default false)`
  - `ProfilePicture (<=2048)`, `Xp (default 0)`
  - Audit timestamps

### Otp

- Properties
  - `Id`, `Email (<=320, indexed)`, `Code (<=6)`, `ExpirationTime`

### Workspace

- Properties
  - `Id`, `Name (<=128)`, `Description (<=1000)`
  - `Visibility (enum)`, `CreatedBy`
  - Audit timestamps
- Relationships
  - `Creator` (User, FK `CreatedBy`, restrict delete)
  - `UserWorkspaces` (many)
  - `Invitations` (many)
  - `Documents` (many)

### UserWorkspace

- Composite key `(UserId, WorkspaceId)`
- Properties
  - `UserId`, `WorkspaceId`, `Role (enum)`, `JoinedAt`
- Relationships
  - User (FK, cascade on delete)
  - Workspace (FK, cascade on delete)
- Index
  - `(WorkspaceId, UserId)` named `IX_UserWorkspaces_Workspace_User`

### WorkspaceInvitation

- Properties
  - `Id`, `WorkspaceId`, `InvitedBy`, `InvitedEmail (<=320)`, `Token (<=255, unique)`
  - `Status (enum)`, `CreatedAt`
- Relationships
  - `Workspace` (FK, cascade)
  - `Inviter` (User, FK `InvitedBy`, restrict delete)

### Document

- Properties
  - `Id`, `WorkspaceId`, `CreatedBy`, `Title (<=256)`
  - `Kind (enum)`, `YDocId (<=128, unique)`, `IsArchived (default false)`
  - Audit timestamps
- Relationships
  - `Workspace` (FK, cascade)
  - `Creator` (User, restrict)

### DTOs

- WorkspaceDto
  - `Id`, `Name`, `Description`, `Visibility`, `CreatedBy`
  - `CreatedAt`, `UpdatedAt`
  - `CreatorName`: combined first/last
  - `MemberCount`, `DocumentCount`
  - `UserRole`: role of requesting user for the workspace


