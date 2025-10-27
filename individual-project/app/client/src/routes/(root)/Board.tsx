import { CreateDocCrouselSkeleton } from "@/components/carousels/create-doc-carousel";
import { useWorkspace } from "@/hooks/workspace/use-workspaces";
import { FilePlus, Plus } from "lucide-react";
import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";

const LazyCreateDocCarousel = lazy(
  () => import("@/components/carousels/create-doc-carousel")
);

const Board = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { data: workspace } = useWorkspace(
    workspaceId ? Number(workspaceId) : undefined
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <FilePlus/>
        <h1>
          {workspace?.data?.documentCount === 0
            ? "Create your first document"
            : "Documents"}{" "}
        </h1>
      </div>
      <div className="w-full">
        <Suspense fallback={<CreateDocCrouselSkeleton />}>
          <LazyCreateDocCarousel />
        </Suspense>
      </div>
    </div>
  );
};

export default Board;
