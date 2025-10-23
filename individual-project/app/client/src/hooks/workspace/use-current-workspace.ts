import { useParams } from "react-router-dom";
import { useEffect } from "react";

export const useCurrentWorkspace = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const currentWorkspaceId = workspaceId ? Number(workspaceId) : 0;

  // Update localStorage when workspace changes
  useEffect(() => {
    if (currentWorkspaceId && currentWorkspaceId !== 0) {
      localStorage.setItem("currentWorkspaceId", currentWorkspaceId.toString());
    }
  }, [currentWorkspaceId]);

  return {
    currentWorkspaceId,
    isWorkspaceSelected: currentWorkspaceId !== 0,
    hasWorkspaceContext: Boolean(workspaceId), 
  };
};
