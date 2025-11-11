import { useParams } from "react-router-dom";
import { useDocument } from "@/routes/(root)/document/hooks/use-document";
import { Skeleton } from "@/components/ui/skeleton";
import { WhiteboardCanvas } from "./components/WhiteboardCanvas";

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
      <div className="flex-1 overflow-hidden">
        <WhiteboardCanvas documentId={Number(documentId)} />
      </div>
    </div>
  );
};

export default WhiteBoard;

