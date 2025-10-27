import { useWorkspace } from "@/hooks/workspace/use-workspaces";
import { useParams } from "react-router-dom";

const Board = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { data: workspace } = useWorkspace(
    workspaceId ? Number(workspaceId) : undefined
  );

  console.log(workspace);

  return <div></div>;
};

export default Board;
