import { lazy, Suspense, useState, useEffect } from "react";
import { ROUTES } from "@/lib/router-paths";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BreadCrumpSkeleton } from "../skeletons/breadcrumps-skeleton";
import { Bell, Pin, Search, UserRoundPlus } from "lucide-react";
import { ButtonSkeleton as ManageWorkspaceDropdownSkeleton } from "../skeletons/button-skeleton";
import { CommandMenu } from "../CommandMenu";

const LazyBreadCrumps = lazy(() => import("@/components/BreadCrumps"));

const LazyManageWorkspaceDropdown = lazy(
  () => import("@/components/dropdowns/worksapces/workspace-dropdown-crud")
);

const LazyManageDocumentDropdown = lazy(
  () => import("@/components/dropdowns/documents/document-dropdown-crud")
);

const BoardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const isBoardRoute = location.pathname.startsWith(
    `${ROUTES.BASE.APP}/workspace`
  );

  const isDocumentRoute =
    location.pathname.includes("/document/") ||
    location.pathname.includes("/whiteboard/");

  // Keyboard shortcut: Cmd+K or Ctrl+K to open command menu
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandMenuOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);


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
                {isDocumentRoute ? (
                  <LazyManageDocumentDropdown />
                ) : (
                  <LazyManageWorkspaceDropdown />
                )}
              </Suspense>
              <div className="h-6 w-px bg-accent" />
            </>
          )}
          <div className="relative">
            <Button size="icon" variant={"secondary"}>
              <Bell className="size-4" />
            </Button>
            <span className="absolute -top-1 animate-pulse -right-1 bg-red-500 text-white text-xs rounded-full size-3 " />
          </div>
          <Button 
            size="icon" 
            variant={"secondary"}
            onClick={() => setCommandMenuOpen(true)}
          >
            <Search className="size-4" />
          </Button>
        </div>
      </div>
      <CommandMenu open={commandMenuOpen} onOpenChange={setCommandMenuOpen} />
      <div className={`flex-1 items-center min-h-0`}>{children}</div>
    </div>
  );
};

export default BoardLayout;
