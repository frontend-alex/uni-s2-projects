CREATE TABLE Workspaces (
    Id BIGINT IDENTITY (1, 1) PRIMARY KEY,
    Name NVARCHAR (128) NOT NULL,
    Description NVARCHAR (MAX) NULL,
    Visibility NVARCHAR (16) NOT NULL DEFAULT 'private' CHECK (
        Visibility IN ('public', 'private')
    ),
    CreatedBy BIGINT NOT NULL FOREIGN KEY REFERENCES Users (Id) ON DELETE NO ACTION,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME (),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME ()
);

CREATE TABLE UserWorkspaces (
    UserId BIGINT NOT NULL FOREIGN KEY REFERENCES Users (Id) ON DELETE CASCADE,
    WorkspaceId BIGINT NOT NULL FOREIGN KEY REFERENCES Workspaces (Id) ON DELETE CASCADE,
    Role NVARCHAR (16) NOT NULL DEFAULT 'member' CHECK (
        Role IN ('owner', 'cohost', 'member')
    ),
    JoinedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME (),
    LastActiveAt DATETIME2 NULL,
    CONSTRAINT PK_UserWorkspaces PRIMARY KEY (UserId, WorkspaceId)
);

-- Enforce exactly one owner per workspace 
CREATE UNIQUE INDEX UQ_OneOwnerPerWorkspace ON UserWorkspaces (WorkspaceId) WHERE Role = 'owner';

CREATE TABLE WorkspaceInvitations (
    Id BIGINT IDENTITY (1, 1) PRIMARY KEY,
    WorkspaceId BIGINT NOT NULL FOREIGN KEY REFERENCES Workspaces (Id) ON DELETE CASCADE,
    InvitedEmail NVARCHAR (320) NOT NULL,
    InvitedBy BIGINT NOT NULL FOREIGN KEY REFERENCES Users (Id) ON DELETE NO ACTION,
    Token NVARCHAR (255) NOT NULL UNIQUE,
    Status NVARCHAR (16) NOT NULL DEFAULT 'pending' CHECK (
        Status IN (
            'pending',
            'accepted',
            'expired',
            'revoked'
        )
    ),
    ExpiresAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME ()
);

CREATE TABLE Documents (
    Id BIGINT IDENTITY (1, 1) PRIMARY KEY,
    WorkspaceId BIGINT NOT NULL FOREIGN KEY REFERENCES Workspaces (Id) ON DELETE CASCADE,
    Title NVARCHAR (256) NULL,
    Kind NVARCHAR (16) NOT NULL DEFAULT 'note' CHECK (
        Kind IN (
            'note',
            'whiteboard',
            'outline',
            'worksheet'
        )
    ),
    YDocId NVARCHAR (128) NOT NULL UNIQUE,
    CreatedBy BIGINT NOT NULL FOREIGN KEY REFERENCES Users (Id) ON DELETE NO ACTION,
    IsArchived BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME (),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME ()
);

