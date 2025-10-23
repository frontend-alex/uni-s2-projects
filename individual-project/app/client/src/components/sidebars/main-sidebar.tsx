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
import WorkspaceDropdown from "../dropdowns/workspace-dropdown";

const LazyUserDropdown = lazy(() => import("@/components/dropdowns/user-dropdown"))

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <WorkspaceDropdown />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<UserDropdownSkeleton/>}>
          <LazyUserDropdown />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}