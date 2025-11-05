## PeerLearn – Runbook (Windows, Linux/macOS)

This runbook explains how to set up environment variables, run the backend and frontend locally, and use the Windows launcher. It also documents common ports and troubleshooting.

### Prerequisites

- Node.js LTS (>= 18) and pnpm
- .NET SDK (version matching solution projects; net7+/net8+/net9 as present)
- SQL Server (local/remote) or Azure SQL. For Dev, LocalDB or SQL Server Developer edition works.

### Environment Variables

- API
  - `CONNECTION_STRING` — SQL Server connection string. Example:
    - `Server=localhost;Database=PeerLearn;Trusted_Connection=True;TrustServerCertificate=True;`
  - `Jwt:SecretKey` — strong secret key for HMAC
  - `Jwt:Issuer` — e.g. `PeerLearn`
  - `Jwt:Audience` — e.g. `PeerLearn.Client`
  - `Jwt:ExpirationMinutes` — e.g. `60`

Provide these via a `.env` file in `app/server/API/` (the API loads `.env` via DotNetEnv) or user-level environment variables.

Example `.env` (do not commit secrets):

```env
CONNECTION_STRING=Server=localhost;Database=PeerLearn;Trusted_Connection=True;TrustServerCertificate=True;
Jwt__SecretKey=super-secret-change-me
Jwt__Issuer=PeerLearn
Jwt__Audience=PeerLearn.Client
Jwt__ExpirationMinutes=60
```

Note: ASP.NET binds `:` in keys from `__` in environment variables.

### Ports

- API default: `http://localhost:5106` (base), REST base path is `/api`
- Client default: `http://localhost:5173`

### Running on Windows (recommended)

Option 1: Use the launcher

1. Double-click `start.cmd` (or run it in a terminal).
2. It will open two PowerShell windows:
   - Client in `app/client` running `pnpm dev`
   - Server in `app/server` running `dotnet watch run --project api`
3. Set custom commands via env vars before launching:
   - `CLIENT_START_COMMAND="pnpm dev"`
   - `SERVER_START_COMMAND="dotnet watch run --project API"`

Option 2: Run manually

- Backend
  1. Open a terminal in `app/server`
  2. Ensure env vars are set or `.env` exists
  3. Run: `dotnet restore`
  4. Run: `dotnet watch run --project API`

- Frontend
  1. Open another terminal in `app/client`
  2. Run: `pnpm install`
  3. Run: `pnpm dev`

### Running on Linux/macOS

Run manually (no shell script provided by default):

- Backend
  1. `cd app/server`
  2. Export environment variables or create `.env` in `app/server/API/`
  3. `dotnet restore`
  4. `dotnet watch run --project API`

- Frontend
  1. `cd app/client`
  2. `pnpm install`
  3. `pnpm dev`

### Verifying

- API Swagger UI (Development): open `http://localhost:5106/` (served at root when dev)
- Frontend: open `http://localhost:5173/`

### Configuration Alignment

- Client base URL is configured in `app/client/src/lib/config.ts` under `API.BASE_URL`. Ensure it matches the API port and base path (`/api`).

### Troubleshooting

- CORS errors: Make sure the dev origin (5173 or 3000) is allowed in API security config.
- Database connectivity: Validate `CONNECTION_STRING` and that SQL Server is reachable. On Linux/macOS, use a reachable SQL Server or container.
- JWT auth not working: Verify `Jwt` settings in environment variables; ensure clock sync and that cookies are allowed in browser if relying on HttpOnly cookie.
- Port conflicts: Change client port via Vite config or run with `--port`, adjust API `launchSettings.json` or environment.


