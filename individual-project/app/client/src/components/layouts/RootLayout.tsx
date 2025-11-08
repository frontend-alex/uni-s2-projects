import { AppSidebar } from "../sidebars/main-sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "../ui/sidebar";
import BoardLayout from "./BoardLayout";

const RootLayout = () => {
  const location = useLocation();
  const isWhiteboardRoute = location.pathname.includes("/whiteboard/");

  return (
    <div className="h-screen flex">
      <SidebarProvider>
        <AppSidebar />
        <div className="bg-background w-full overflow-hidden">
          <BoardLayout>
            <div className={`${isWhiteboardRoute ? "p-0" : "p-10 max-w-5xl mx-auto"} h-full overflow-auto`}>
              <Outlet />
            </div>
          </BoardLayout>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default RootLayout;
