import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { TabsContent } from "@radix-ui/react-tabs";
import { useWorkspace } from "@/routes/(root)/workspace/hooks/use-workspaces";
import { FilePlus, GalleryHorizontalEnd, Rows3 } from "lucide-react";
import { MappedSkeleton } from "@/components/skeletons/mapped-skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateDocumentCard from "./components/add-document-card";
import { usePersistentState } from "@/hooks/use-persistance";

const LazyCreateDocCarousel = lazy(
  () => import("@/components/carousels/create-doc-carousel")
);

const LazyDocumentRowCard = lazy(
  () => import("@/components/cards/document-card-row")
);

const Workspace = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { data: workspace } = useWorkspace(
    workspaceId ? Number(workspaceId) : undefined
  );

  const [activeTab, setActiveTab] = usePersistentState(
    "workspace-tab",
    "carousel"
  );

  return (
    <Tabs
      className="flex flex-col gap-5"
      value={activeTab}
      onValueChange={setActiveTab}
    >
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
        <Suspense fallback={<MappedSkeleton />}>
          <LazyCreateDocCarousel documents={workspace?.data?.documents ?? []} />
        </Suspense>
      </TabsContent>
      <TabsContent value="row">
        <Suspense fallback={<MappedSkeleton direction="vertical" />}>
          <div className="flex flex-col gap-3">
            <CreateDocumentCard variant="row" />
            {workspace?.data?.documents?.map((document) => (
              <LazyDocumentRowCard key={document.id} document={document} />
            ))}
          </div>
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};

export default Workspace;
