namespace Core.Enums;

public enum WorkspaceVisibility {
    Private,
    Public
}

public enum UserWorkspaceRole {
    Owner,
    Cohost,
    Member
}

public enum WorkspaceInvitationStatus {
    Pending,
    Accepted,
    Expired,
    Revoked
}

public enum DocumentKind {
    Note,
    Whiteboard,
    Outline,
    Worksheet
}