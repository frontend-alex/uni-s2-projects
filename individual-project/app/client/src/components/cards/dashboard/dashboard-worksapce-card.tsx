import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Workspace } from "@/types/workspace";
import { defaultWorkspaceColor } from "@/consts/consts";
import { WorkspaceVisibilityIcon } from "@/components/SmallComponents";
import { ROUTES } from "@/lib/router-paths";
import { useNavigate } from "react-router-dom";

export const DashboardWorkspaceCardSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-full h-[100px] rounded-md aspect-square" />
    </div>
  );
};

const DashboardWorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
  const navigate = useNavigate();

  const color = workspace.colorHex ?? defaultWorkspaceColor;

  return (
    <Card
      className="pb-0 overflow-hidden flex flex-col cursor-pointer hover:bg-muted transition-all aspect-square"
      onClick={() => navigate(ROUTES.AUTHENTICATED.BOARD(workspace.id))}
    >
      <CardHeader className=" flex items-center justify-between">
        <CardTitle className="w-full truncate max-w-[100px]">{workspace.name}</CardTitle>
        <WorkspaceVisibilityIcon
          visibility={workspace.visibility}
          className="h-5 w-5 "
        />
      </CardHeader>
      <CardFooter className="p-0 mb-0 relative mt-auto">
        <span
          style={{ "--dynamic-bg": color } as React.CSSProperties}
          className="absolute left-1/2 -translate-x-1/2 bg-[var(--dynamic-bg)] w-[60px] rounded-full h-[40px] rounded-b-md"
        ></span>
        <span
          style={{ "--dynamic-bg": color } as React.CSSProperties}
          className="bg-[var(--dynamic-bg)] w-full h-[10px] rounded-b-md"
        ></span>
      </CardFooter>
    </Card>
  );
};

export default DashboardWorkspaceCard;
