import { useParams } from "react-router-dom";
import { useDocument } from "@/hooks/document/use-document";
import { Skeleton } from "@/components/ui/skeleton";

const WhiteBoard = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const { data: documentResponse, isLoading } = useDocument(Number(documentId));

  const document = documentResponse?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full h-full">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Whiteboard not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{document.title || "Untitled Whiteboard"}</h1>
      </div>
      <div className="flex-1 border rounded-lg bg-card p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Whiteboard content will appear here</p>
      </div>
    </div>
  );
};

export default WhiteBoard;

