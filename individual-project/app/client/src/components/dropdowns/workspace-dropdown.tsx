import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { getRandomColor } from "@/lib/utils";
import { randomColors } from "@/consts/consts";
import { WorkspaceVisibility, type Workspace } from "@/types/workspace";
import { UserDropdownSkeleton } from "./user-dropdown";
import { Check, ChevronsUpDown, House, Loader, Plus } from "lucide-react";
import { useUserWorkspaces } from "@/hooks/workspace/use-workspaces";
import { useCurrentWorkspace } from "@/hooks/workspace/use-current-workspace";
import { API } from "@/lib/config";
import GlobalDialog from "../dialogs/GlobalDialog";
import WorkspaceForm from "../auth/forms/workspace/workspace-form-01";
import { WorkspaceVisibilityIcon } from "../SmallComponents";
import type { WorkspaceSchemaType } from "@/utils/schemas/workspace/workspace.schema";
import { useForm } from "react-hook-form";
import { useApiMutation } from "@/hooks/hook";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/router-paths";
import { useTheme } from "@/contexts/ThemeContext";

const WorkspaceDropdown = () => {

  const { theme } = useTheme();

  const {
    data: workspaces,
    isLoading: isWorkspacesLoading,
    error,
  } = useUserWorkspaces();

  const form = useForm<WorkspaceSchemaType>({
    defaultValues: {
      name: "",
      visibility: WorkspaceVisibility.PUBLIC,
    },
  });

  const { mutateAsync: createWorkspace, isPending: isWorkspacePending } =
    useApiMutation<Workspace>("POST", API.ENDPOINTS.WORKSPACE.WORKSPACE, {
      invalidateQueries: [["user-workspaces"]],
      onSuccess: (data) => {
        if (data.success && data.data) {
          toast.success(data.message);
        }
      },
    });


  const { currentWorkspaceId, hasWorkspaceContext } = useCurrentWorkspace();

  const handleWorkspace = async (data: WorkspaceSchemaType) =>
    createWorkspace(data);

  if (isWorkspacesLoading) return <UserDropdownSkeleton />;

  if (error) return null;

  const workspaceList = workspaces?.data || [];
  const currentWorkspace = workspaceList.find(
    (ws: Workspace) => ws.id === currentWorkspaceId
  );

  const colorFirst = getRandomColor(randomColors, theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="no-ring h-12 w-full flex items-center justify-between gap-3 px-3 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
        >
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: colorFirst }}
              className="flex justify-center items-center p-2 rounded-sm"
            >
              <House className="h-4 w-4" />
            </div>
            <span className="capitalize truncate max-w-[100px]">
              {hasWorkspaceContext 
                ? (currentWorkspace?.name || "Unknown Workspace")
                : "Secret Bug"
              }
            </span>
            {hasWorkspaceContext && (
              <WorkspaceVisibilityIcon
                visibility={currentWorkspace?.visibility}
              />
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      {isWorkspacesLoading ? (
        <Loader />
      ) : (
        <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg capitalize">
          {workspaceList.map((workspace: Workspace) => {
            const colors = getRandomColor(randomColors, theme);

            return (
              <Link to={ROUTES.AUTHENTICATED.BOARD(workspace.id)}>
                <DropdownMenuItem
                  key={workspace.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 justify-start">
                    <div
                      style={{ backgroundColor: colors }}
                      className="flex justify-center items-center p-1 rounded-sm"
                    >
                      <House className="text-black dark:text-white" />
                    </div>
                    <span className="font-medium text-xs max-w-[100px] truncate">
                      {workspace.name}
                    </span>
                    <WorkspaceVisibilityIcon
                      visibility={workspace.visibility}
                    />
                  </div>

                  {workspace.id === currentWorkspaceId && <Check />}
                </DropdownMenuItem>
              </Link>
            );
          })}

          {/* Divider */}
          <DropdownMenuSeparator />

          {/* Create Workspace Button */}
          <GlobalDialog
            content={
              <WorkspaceForm
                workspaceForm={form}
                isPending={isWorkspacePending}
              />
            }
            onConfirm={() => handleWorkspace(form.getValues())}
          >
            <Button
              variant={"ghost"}
              className="flex items-center justify-center w-full"
            >
              <Plus className="h-4 w-4" />
              Create Workspace
            </Button>
          </GlobalDialog>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default WorkspaceDropdown;
