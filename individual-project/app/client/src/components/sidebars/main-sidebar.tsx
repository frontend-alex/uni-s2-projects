import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { lazy, Suspense, useMemo } from "react";
import { DropdownSkeleton as UserDropdownSkeleton } from "@/components/skeletons/dropdown-skeleton";
import { ROUTES } from "@/lib/router-paths";
import { SidebarGroupRenderer } from "./flexible-sidebar-link";
import { FileText, LayoutDashboard, Folder } from "lucide-react";
import { useUserWorkspaces, useWorkspace } from "@/hooks/workspace/use-workspaces";
import { useLocation, useParams } from "react-router-dom";
import { ButtonSkeleton as ManageWorkspaceDropdownSkeleton } from "@/components/skeletons/button-skeleton";
import { defaultWorkspaceColor } from "@/consts/consts";

const LazyUserDropdown = lazy(
  () => import("@/components/dropdowns/user-dropdown")
);

const LazyWorkspaceDropdown = lazy(
  () => import("@/components/dropdowns/worksapces/workspace-dropdown")
);

const LazyWorspaceCrudDropdown = lazy(
  () => import("@/components/dropdowns/worksapces/workspace-dropdown-crud")
);

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { workspaceId } = useParams<{ workspaceId?: string }>();
  const location = useLocation();
  const pathname = location.pathname;
  
  // Show all workspaces if NOT on a workspace/board/document route
  const isWorkspaceRoute = pathname.startsWith(`${ROUTES.BASE.APP}/workspace`);
  const showAllWorkspaces = !isWorkspaceRoute;
  
  const { data: workspaceResponse } = useWorkspace(
    workspaceId ? Number(workspaceId) : undefined
  );
  const { data: allWorkspacesResponse } = useUserWorkspaces();

  const workspace = workspaceResponse?.data;
  const allWorkspaces = allWorkspacesResponse?.data || [];

  const generalGroup = useMemo(
    () => ({
      label: "General",
      items: [
        {
          title: "Dashboard",
          url: ROUTES.AUTHENTICATED.DASHBOARD,
          icon: LayoutDashboard,
          isActive: pathname === ROUTES.AUTHENTICATED.DASHBOARD,
        },
      ],
    }),
    [pathname]
  );

  const workspaceItems = useMemo(() => {
    if (!showAllWorkspaces) return [];

    return allWorkspaces.map((ws) => {
      const documentItems = (ws.documents || [])
        .filter((doc) => doc.title)
        .map((doc) => {
          const documentUrl = ROUTES.AUTHENTICATED.DOCUMENT(doc.id, ws.id);
          return {
            title: doc.title!,
            url: documentUrl,
            isActive: pathname === documentUrl,
          };
        });

      return {
        title: ws.name,
        icon: Folder,
        items: documentItems,
        isActive: documentItems.some((item) => item.isActive),
        colorHex: ws.colorHex ?? defaultWorkspaceColor,
      };
    });
  }, [allWorkspaces, showAllWorkspaces, pathname]);

  const documentItems = useMemo(() => {
    if (showAllWorkspaces || !workspace?.documents) return [];
    return workspace.documents
      .filter((document) => document.title)
      .map((document) => {
        const documentUrl = ROUTES.AUTHENTICATED.DOCUMENT(
          document.id,
          workspace.id
        );
        return {
          title: document.title!,
          url: documentUrl,
          isActive: pathname === documentUrl,
        };
      });
  }, [workspace, pathname, showAllWorkspaces]);

  const sidebarGroups = [
    generalGroup,
    ...(showAllWorkspaces
      ? [
          {
            label: "Workspaces",
            items: workspaceItems,
          },
        ]
      : [
          {
            label: workspace ? (
              <div className="flex items-center justify-between w-full">
                <div
                  className={`flex items-center ${workspace.name.length <= 14 ? "gap-1" : ""}`}
                >
                  <span className="max-w-[100px] truncate">{workspace.name}</span>
                  Documents
                </div>
                <Suspense fallback={<ManageWorkspaceDropdownSkeleton />}>
                  <LazyWorspaceCrudDropdown className="size-4" variant="ghost" />
                </Suspense>
              </div>
            ) : (
              "Documents"
            ),
            items: [
              {
                title: "Documents",
                icon: FileText,
                items: documentItems,
                isActive: documentItems.some((item) => item.isActive),
                colorHex: workspace?.colorHex ?? defaultWorkspaceColor,
              },
            ],
          },
        ]),
  ];

  return (
    <Sidebar
      variant="inset"
      {...props}
      className="bg-background border-r border-accent"
    >
      <SidebarHeader className="bg-background">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Suspense fallback={<UserDropdownSkeleton />}>
                <LazyWorkspaceDropdown />
              </Suspense>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-background">
      {sidebarGroups.map((group, index) => (
          <SidebarGroupRenderer
            key={
              typeof group.label === "string" ? group.label : `group-${index}`
            }
            group={group}
          />
        ))}
      </SidebarContent>
      <SidebarFooter className="bg-background">
        <Suspense fallback={<UserDropdownSkeleton />}>
          <LazyUserDropdown />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}
