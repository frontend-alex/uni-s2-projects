import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserWorkspaces } from "@/hooks/workspace/use-workspaces";
import { ROUTES } from "@/lib/router-paths";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: workspaces, isLoading } = useUserWorkspaces();

  useEffect(() => {
    if (!isLoading && workspaces?.data?.length) {
      const firstWorkspace = workspaces.data[0];
      navigate(ROUTES.HELPERS.getBoardRoute(firstWorkspace.id), {
        replace: true,
      });
    }
  }, [isLoading, workspaces, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
};

export default Dashboard;
