import { AppSidebar } from "../sidebars/main-sidebar";
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";

const RootLayout = () => {
  return (
    <div>
      <SidebarProvider> 
        <AppSidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default RootLayout;
