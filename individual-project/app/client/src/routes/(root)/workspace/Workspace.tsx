import { FilePlus, GalleryHorizontalEnd, Rows3 } from "lucide-react";
import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { useWorkspace } from "@/hooks/workspace/use-workspaces";
import { GridBoxSkeleton as CreateDocCrouselSkeleton } from "@/components/skeletons/grid-box-skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

const LazyCreateDocCarousel = lazy(
  () => import("@/components/carousels/create-doc-carousel")
);

const Workspace = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { data: workspace } = useWorkspace(
    workspaceId ? Number(workspaceId) : undefined
  );

  return (
    <Tabs className="flex flex-col gap-5" defaultValue="carousel">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FilePlus />
          <h1>
            {workspace?.data?.documentCount === 0
              ? "Create your first document"
              : "Documents"}{" "}
          </h1>
        </div>
        <TabsList>
          <TabsTrigger value="row">
            <Rows3 />
          </TabsTrigger>
          <TabsTrigger value="carousel">
            <GalleryHorizontalEnd />
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="carousel">
        <Suspense fallback={<CreateDocCrouselSkeleton />}>
          <LazyCreateDocCarousel documents={workspace?.data?.documents ?? []} />
        </Suspense>
      </TabsContent>
      <TabsContent value="row">
        <div>Row View Coming Soon!</div>
      </TabsContent>
    </Tabs>
  );
};

export default Workspace;
