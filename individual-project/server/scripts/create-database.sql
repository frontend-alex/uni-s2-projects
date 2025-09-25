-- Create database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'PeerLearnDb')
BEGIN
    CREATE DATABASE [PeerLearnDb]
END
GO

-- Use the database
USE [PeerLearnDb]
GO

-- Create Users table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE [Users] (
        [Id] int IDENTITY(1,1) NOT NULL,
        [Username] nvarchar(50) NOT NULL,
        [ProfilePicture] nvarchar(500) NOT NULL,
        [Email] nvarchar(255) NOT NULL,
        [Role] nvarchar(50) NOT NULL,
        [Xp] int NOT NULL,
        [Password] nvarchar(255) NOT NULL,
        [EmailVerified] bit NOT NULL,
        [HasPassword] bit NOT NULL,
        [Provider] nvarchar(50) NOT NULL,
        [LastLoginAt] datetime2 NOT NULL,
        [OnBoardingCompleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    )
END
GO

-- Create unique indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Email')
BEGIN
    CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email])
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Username')
BEGIN
    CREATE UNIQUE INDEX [IX_Users_Username] ON [Users] ([Username])
END
GO

-- Insert sample data (optional)
IF NOT EXISTS (SELECT * FROM [Users] WHERE Email = 'admin@peerlearn.com')
BEGIN
    INSERT INTO [Users] (
        [Username], [ProfilePicture], [Email], [Role], [Xp], [Password], 
        [EmailVerified], [HasPassword], [Provider], [LastLoginAt], 
        [OnBoardingCompleted], [CreatedAt], [UpdatedAt]
    ) VALUES (
        'admin', 'https://example.com/admin.jpg', 'admin@peerlearn.com', 'Admin', 1000, 
        '$2a$11$example_hashed_password', 1, 1, 'Email', 
        GETUTCDATE(), 1, GETUTCDATE(), GETUTCDATE()
    )
END
GO

PRINT 'Database and tables created successfully!'
