import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useWorkspace } from "@/hooks/workspace/use-workspaces";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/lib/router-paths";
import { Link } from "react-router-dom";

export const BreadCrumpSkeleton = () => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-16" />
      <span className="text-muted-foreground">/</span>
      <Skeleton className="h-4 w-24" />
      <span className="text-muted-foreground">/</span>
      <Skeleton className="h-4 w-12" />
    </div>
  );
};

const BreadCrumps = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: workspaceResponse, isLoading } = useWorkspace(
    workspaceId ? Number(workspaceId) : undefined
  );

  const workspace = workspaceResponse?.data;

  // Extract the current route after /v1
  const getCurrentRoute = () => {
    const pathname = location.pathname;
    // Extract segment after /app/v1/
    const match = pathname.match(/\/app\/v1\/([^/]+)/);
    return match ? match[1] : "";
  };

  const currentRoute = getCurrentRoute();

  if (isLoading) return <BreadCrumpSkeleton />;

  return (
    <div className="flex items-center gap-3">
      {/* Back/Forward Navigation */}
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => navigate(1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
        <Link
          to={ROUTES.AUTHENTICATED.DASHBOARD}
          className="text-muted-foreground capitalize max-w-[100px] truncate"
        >
          {currentRoute || "board"}
        </Link>
        {workspace && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground  max-w-[150px] lg:max-w-full truncate">
              {workspace.name}
            </span>
          </>
        )}
      </nav>
    </div>
  );
};

export default BreadCrumps;
