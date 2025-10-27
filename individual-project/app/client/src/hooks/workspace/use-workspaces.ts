import { useApiQuery } from "@/hooks/hook";
import { API } from "@/lib/config";
import type { Workspace } from "@/types/workspace";

export const useUserWorkspaces = () => {
  return useApiQuery<Workspace[]>(
    ["user-workspaces"],
    API.ENDPOINTS.WORKSPACE.USER_WORKSPACES,
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
};

export const useWorkspace = (workspaceId: number | undefined) => {
  return useApiQuery<Workspace>(
    ["workspace", workspaceId],
    API.ENDPOINTS.WORKSPACE.Id(workspaceId),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      enabled: !!workspaceId,
    }
  );
};

