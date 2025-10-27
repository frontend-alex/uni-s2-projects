import { lazy, Suspense } from "react";
import { ROUTES } from "@/lib/router-paths";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BreadCrumpSkeleton } from "../BreadCrumps";
import { Bell, Pin, Search, UserRoundPlus } from "lucide-react";
import { ManageWorkspaceDropdownSkeleton } from "../dropdowns/worksapces/workspace-dropdown-crud";

const LazyBreadCrumps = lazy(() => import("@/components/BreadCrumps"));
const LazyManageWorkspaceDropdown = lazy(() => import("@/components/dropdowns/worksapces/workspace-dropdown-crud"));

const BoardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isBoardRoute = location.pathname.startsWith(`${ROUTES.BASE.APP}/board`);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="sticky top-0 z-10 flex flex-row items-center border-b border-accent justify-between bg-background w-full p-2 shrink-0">
        <Suspense fallback={<BreadCrumpSkeleton />}>
          <LazyBreadCrumps />
        </Suspense>
        <div className="flex flex-row items-center gap-3">
          {isBoardRoute && (
            <>
              <Button size="icon" variant={"secondary"}>
                <UserRoundPlus className="size-4" />
              </Button>
              <Button size="icon" variant={"secondary"}>
                <Pin className="size-4" />
              </Button>
              <Suspense fallback={<ManageWorkspaceDropdownSkeleton />}>
                <LazyManageWorkspaceDropdown />
              </Suspense>
              <div className="h-6 w-px bg-accent" />
            </>
          )}
          <div className="relative">
            <Button size="icon" variant={"secondary"}>
              <Bell className="size-4" />
            </Button>
            <span className="absolute -top-1 animate-pulse -right-1 bg-red-500 text-white text-xs rounded-full size-3 "/>
          </div>
          <Button size="icon" variant={"secondary"}>
            <Search className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
};

export default BoardLayout;
