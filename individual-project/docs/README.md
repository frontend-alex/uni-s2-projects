# Database Schema Documentation

## Sprint 2 Schema (sprint-2.sql)

This SQL file defines the core database schema for the collaborative workspace platform. It creates four main tables: **Workspaces** (stores workspace metadata like name, description, and visibility), **UserWorkspaces** (junction table managing user-workspace relationships with roles like owner/cohost/member), **WorkspaceInvitations** (handles invitation system with tokens and status tracking), and **Documents** (stores collaborative documents with different types like notes, whiteboards, and worksheets). The schema implements a many-to-many relationship between users and workspaces through the UserWorkspaces table, ensuring proper role-based access control and maintaining data integrity with constraints like exactly one owner per workspace. Each table includes proper foreign key relationships, audit fields (CreatedAt/UpdatedAt), and check constraints to enforce business rules and data validation.
