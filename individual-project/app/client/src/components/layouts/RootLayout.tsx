import { AppSidebar } from "../sidebars/main-sidebar";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../ui/sidebar";
import BoardLayout from "./BoardLayout";

const RootLayout = () => {
  return (
    <div className="h-screen flex">
      <SidebarProvider>
        <AppSidebar />
        <div className="bg-background w-full overflow-hidden">
          <BoardLayout>
            <div className="p-5 mt-5  h-full overflow-auto max-w-4xl mx-auto">
              <Outlet />
            </div>
          </BoardLayout>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default RootLayout;
