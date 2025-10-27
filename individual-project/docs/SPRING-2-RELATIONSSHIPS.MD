# Sprint 2 - Database Relationships

## Overview

This document explains the core relationships in our database, focusing on how Users, Workspaces, and Documents are connected through junction tables.

## Entity Relationship Diagram

```
User ←→ UserWorkspace ←→ Workspace
                       ↓
                    Document
```

## Core Tables

### User
- **Purpose**: Stores user account information
- **Key Fields**: Id, Email, Username, PasswordHash, Xp
- **Relationships**: Can be in multiple workspaces (through UserWorkspace)

### Workspace
- **Purpose**: Collaborative spaces for users
- **Key Fields**: Id, Name, CreatedBy, Visibility
- **Relationships**: 
  - Has one Creator (User)
  - Has many UserWorkspaces (members)
  - Has many Documents
  - Has many Invitations

### UserWorkspace (Junction Table)
- **Purpose**: Tracks which users are members of which workspaces and their roles
- **Composite Primary Key**: `UserId` + `WorkspaceId`
- **Key Fields**:
  - `UserId`: Foreign key to User
  - `WorkspaceId`: Foreign key to Workspace
  - `Role`: OWNER (0), COHOST (1), MEMBER (2)
  - `JoinedAt`: Timestamp when user joined
  - `LastActiveAt`: Last activity timestamp

## Role Hierarchy

### OWNER (0)
- Creator of the workspace
- Full administrative control
- Can delete workspace
- Can manage all aspects

### COHOST (1)
- Secondary administrators
- Can manage members (invite, remove)
- Can manage documents
- Cannot delete workspace

### MEMBER (2)
- Standard participant
- Can create and edit documents
- Limited administrative permissions
- Default role when joining

## Relationship Examples

### Example 1: User Joins Workspace
```
User: John Doe (Id: 5)
Workspace: "Study Group" (Id: 3)

UserWorkspace:
├─ UserId: 5
├─ WorkspaceId: 3
├─ Role: MEMBER
└─ JoinedAt: 2025-01-15
```

### Example 2: Workspace with Multiple Members
```
Workspace: "Team Project" (Id: 1)
├─ Creator: Alice (Id: 1) - OWNER
├─ Member: Bob (Id: 2) - COHOST
└─ Member: Charlie (Id: 3) - MEMBER
```

## Cascade Behaviors

### Deleting a Workspace
- Cascades to delete all UserWorkspaces
- Cascades to delete all Documents
- User accounts remain intact

### Deleting a User
- Cascades to delete all UserWorkspaces
- User's membership removed from all workspaces
- Workspaces remain intact

## Use Cases

### Check if User is in Workspace
```sql
SELECT * FROM UserWorkspaces 
WHERE UserId = @userId AND WorkspaceId = @workspaceId;
```

### Get All Workspaces for a User
```sql
SELECT w.* FROM Workspaces w
INNER JOIN UserWorkspaces uw ON w.Id = uw.WorkspaceId
WHERE uw.UserId = @userId;
```

### Get All Members of a Workspace
```sql
SELECT u.*, uw.Role, uw.JoinedAt
FROM Users u
INNER JOIN UserWorkspaces uw ON u.Id = uw.UserId
WHERE uw.WorkspaceId = @workspaceId;
```

## Related Entities

### WorkspaceInvitation
- Manages pending invitations to join workspaces
- Tracks: Who invited, invited email, status, token
- Related to: Workspace (many-to-one)

### Document
- Files/content within a workspace
- Tracks: Type (note, whiteboard, etc.), creator, YDocId
- Related to: Workspace (many-to-one)

## Design Decisions

### Why Junction Table?
- Many-to-many relationship between Users and Workspaces
- Need to store additional metadata (role, joined date)
- Flexible role-based access control

### Composite Key Benefits
- Prevents duplicate memberships
- Database-level integrity
- Efficient indexing

### Cascade on Delete
- Prevents orphaned records
- Maintains data consistency
- Simplifies cleanup operations

