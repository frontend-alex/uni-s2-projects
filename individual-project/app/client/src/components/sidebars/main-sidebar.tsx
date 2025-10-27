import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { lazy, Suspense } from "react";
import { UserDropdownSkeleton } from "@/components/dropdowns/user-dropdown";
import { ROUTES } from "@/lib/router-paths";
import { SidebarGroupRenderer } from "./flexible-sidebar-link";
import { FileText, LayoutDashboard } from "lucide-react";
import { useWorkspace } from "@/hooks/workspace/use-workspaces";
import { useParams } from "react-router-dom";
import { CreateDocCrouselSkeleton } from "@/components/carousels/create-doc-carousel";
import { ManageWorkspaceDropdownSkeleton } from "@/components/dropdowns/worksapces/workspace-dropdown-crud";

const LazyUserDropdown = lazy(
  () => import("@/components/dropdowns/user-dropdown")
);

const LazyWorkspaceDropdown = lazy(
  () => import("@/components/dropdowns/worksapces/workspace-dropdown")
);

const LazyWorspaceCrudDropdown = lazy(
  () => import("@/components/dropdowns/worksapces/workspace-dropdown-crud")
);

const generalSidebarGroups = [
  {
    label: "General",
    items: [
      {
        title: "Dashboard",
        url: ROUTES.AUTHENTICATED.DASHBOARD,
        icon: LayoutDashboard,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { workspaceId } = useParams<{ workspaceId?: string }>();
  const { data: workspaceResponse } = useWorkspace(
    workspaceId ? Number(workspaceId) : undefined
  );

  const workspace = workspaceResponse?.data;

  const sidebarGroups = [
    ...generalSidebarGroups,
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

          items: [], // Will be populated with documents from backend
        },
      ],
    },
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
