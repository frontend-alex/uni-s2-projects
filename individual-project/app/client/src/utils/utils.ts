import { UserWorkspaceRole } from "@/types/workspace";

export const IsOwner = (userRole: UserWorkspaceRole) => {
    return userRole === UserWorkspaceRole.OWNER;
}

export const IsCohost = (userRole: UserWorkspaceRole) => {
    return userRole === UserWorkspaceRole.COHOST;
}

export const IsMember = (userRole: UserWorkspaceRole) => {
    return userRole === UserWorkspaceRole.MEMBER;
}
