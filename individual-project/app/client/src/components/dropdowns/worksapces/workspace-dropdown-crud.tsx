import DeleteDialog from "@/components/dialogs/DeleteDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiMutation } from "@/hooks/hook";
import { useCurrentWorkspace } from "@/hooks/workspace/use-current-workspace";
import { API } from "@/lib/config";
import { ROUTES } from "@/lib/router-paths";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types/workspace";
import { EllipsisVerticalIcon, Info, Settings, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const ManageWorkspaceDropdownSkeleton = () => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full flex-start font-normal hover:text-destructive -ml-[2px] group cursor-pointer"
    >
      <Skeleton className="size-9" />
    </Button>
  );
};

const ManageWorkspaceDropdown = ({
  className,
  variant = "secondary",
}: {
  className?: string;
  variant?: "default" | "secondary" | "ghost" | "link" | "destructive" | "outline";
}) => {
  const navigate = useNavigate();

  const { currentWorkspaceId } = useCurrentWorkspace();

  const { mutateAsync: deleteWorkspace, isPending: isDeletingWorkspace } =
    useApiMutation<Workspace>(
      "DELETE",
      API.ENDPOINTS.WORKSPACE.Id(currentWorkspaceId),
      {
        invalidateQueries: [["user-workspaces"]],
        onSuccess: (data) => {
          toast.success(data.message);
          navigate(ROUTES.AUTHENTICATED.DASHBOARD);
        },
        onError: (error) => {
          toast.error(error.response?.data.message);
        },
      }
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant={variant} className={cn(className, "")}>
          <EllipsisVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Manage Workspace</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Info />
          <span>Information</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <DeleteDialog
            isLoading={isDeletingWorkspace}
            onConfirm={async () => await deleteWorkspace(undefined)}
          >
            <Button
              variant={"ghost"}
              className="flex items-center justify-start w-max text-destructive hover:text-destructive p-0 m-0 h-[20px]"
            >
              <Trash className="h-4 w-4 text-destructive hover:text-destructive" />
              Delete Workspace
            </Button>
          </DeleteDialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ManageWorkspaceDropdown;
