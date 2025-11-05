## PeerLearn – Architecture and Codebase Overview

This document explains the system architecture, project layout, layers of abstraction, key models/entities, and how the client and backend communicate.

### Repository Structure

- app/
  - client/ — React + TypeScript + Vite frontend application
  - server/ — .NET backend (Clean architecture-ish split: API, Core, Infrastructure)
- docs/ — documentation and reference SQL/data
- start.ps1 / start.cmd — Windows launcher for client and server

### High-Level Architecture

- Client (React, Vite, React Router, TanStack Query)
  - UI components, guards, providers for theme and auth
  - Calls REST API under `http://localhost:5106/api` (configurable)
- API (ASP.NET Core minimal hosting)
  - Controllers (Auth, User, Workspace)
  - Middleware for error handling
  - Swagger/OpenAPI for local API docs
  - Security setup: CORS, JWT auth (reads Bearer header or HttpOnly cookie)
- Core (Domain)
  - Domain models, enums, DTOs, domain services
  - Interfaces for repositories and services
- Infrastructure
  - EF Core `ApplicationDbContext` and SQL mappings
  - Repository implementations
  - Cross-cutting services (JWT, password hashing)

### Data Flow (Request Lifecycle)

1. Client issues HTTP request to API (e.g., login, create workspace).
2. API Controller validates input and invokes a Core Service.
3. Core Service performs domain logic, uses repository interfaces.
4. Infrastructure repositories read/write via EF Core `ApplicationDbContext`.
5. Service returns domain/DTO; Controller wraps into `ApiResponse` and returns.

### Layers and Responsibilities

- API layer (Presentation)
  - Endpoints, HTTP concerns, response formatting, auth attributes
  - ErrorHandler middleware returns normalized error payloads
  - Swagger for dev-time discoverability
- Core layer (Domain)
  - Domain entities and invariants
  - DTO projections
  - Domain services orchestrating repositories
  - Custom exceptions and error codes
- Infrastructure layer (Data + Cross-cutting)
  - EF Core DbContext and entity configuration
  - Repository implementations
  - Security services (JWT), password hashing

### Backend Composition

- API composition (`app/server/API/Program.cs`)
  - Registers controllers, JSON options, CORS, authentication/authorization
  - Registers DbContext with SQL Server connection string from `CONNECTION_STRING` env or appsettings
  - DI registrations for repositories/services
  - Adds Swagger in Development
  - Ensures database exists on startup

- Security
  - CORS policy `AllowFrontend` for common localhost dev origins
  - JWT bearer authentication with configurable issuer/audience/secret
  - JWT can be supplied by Authorization header or `access_token` HttpOnly cookie

- Error Handling
  - Global middleware catches exceptions and converts to a consistent JSON error schema with `traceId` and `timestamp`

### Frontend Composition

- Entry (`app/client/src/main.tsx`)
  - Bootstraps React, React Router, TanStack Query
  - Provides `AuthProvider`, `ThemeProvider`, and global toaster

- Routing (`app/client/src/App.tsx` and `src/lib/router-paths.ts`)
  - Public routes: landing, login, register, forgot/reset password, verify email, auth callback
  - Auth-only routes: onboarding, app routes (board/:workspaceId, profile, settings, dashboard)
  - Guards: `LandingGuard`, `AuthGuard`, `OnboardingGuard`, `AppGuard`

- API config (`app/client/src/lib/config.ts`)
  - `API.BASE_URL` defaults to `http://localhost:5106/api`
  - Endpoint paths for auth, user, and workspace

### Models, DTOs, and Persistence

- Domain models (Core)
  - User, Workspace, UserWorkspace, WorkspaceInvitation, Document, Otp
  - `BaseEntity` provides identifiers and audit fields

- DTOs (Core.DTOs)
  - `WorkspaceDto` returned to API layer for workspace queries

- EF Core mappings (Infrastructure)
  - Fluent configuration for keys, constraints, conversions, relationships
  - Value conversions for enums, composite keys, and indexes

### AuthN/AuthZ Overview

- Registration: `POST /api/Auth/register` — creates user with hashed password, `EmailVerified=false`
- Login: `POST /api/Auth/login` — verifies password, requires `EmailVerified`, issues JWT
  - JWT is set as `access_token` HttpOnly cookie with 1-hour expiry
- Logout: `POST /api/Auth/logout` — deletes `access_token` cookie
- Authorization: `[Authorize]` on protected endpoints; JWT validated via configured issuer/audience/secret

### Workspaces Overview

- Create Workspace: `POST /api/Workspace` (auth required)
  - Creates workspace, sets creator as Owner (`UserWorkspace`), flips onboarding to true
- Get Workspace: `GET /api/Workspace/{workspaceId}` (auth; member access required)
- List My Workspaces: `GET /api/Workspace` (auth)
- Update Workspace: `PUT /api/Workspace/{workspaceId}` (auth; owner/cohost semantics enforced by role checks)
- Delete Workspace: `DELETE /api/Workspace/{workspaceId}` (auth; owner required)

### Error Contract

- Success responses: `{ success, message, data }`
- Error responses (normalized by middleware):
  - `{ success: false, message, errorCode, statusCode, userFriendlyMessage, extra, traceId, timestamp }`

### Environment and Configuration

- API reads `CONNECTION_STRING` from env or `appsettings.json`
- JWT configuration under `Jwt:SecretKey`, `Jwt:Issuer`, `Jwt:Audience`, `Jwt:ExpirationMinutes`
- CORS allows localhost origins (5173/3000)
- Client `API.BASE_URL` can be switched to use `VITE_API_URL` if desired

### Build and Deployment Notes

- Client: Vite build for static assets; Tailwind 4; React 19; React Router 7; TanStack Query 5
- API: .NET with EF Core SQL Server; Swagger for API docs; ensure environment variables are provided in non-dev environments


