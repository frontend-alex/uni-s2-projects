import { Clock, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { defaultDocumentColor } from "@/consts/consts";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import ColoredCard from "@/components/cards/colored-card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { Document } from "@/types/workspace";
import { useApiMutation } from "@/hooks/hook";
import { API } from "@/lib/config";
import { useCurrentWorkspace } from "@/hooks/workspace/use-current-workspace";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/lib/router-paths";
import { toast } from "sonner";

export const CreateDocCrouselSkeleton = () => {
  return (
    <div className="w-full flex gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton
          key={index}
          className="w-full h-full rounded-md aspect-square"
        />
      ))}
    </div>
  );
};

const CreateDocCarousel = ({ documents }: { documents: Document[] }) => {
  const navigate = useNavigate();

  const { currentWorkspaceId } = useCurrentWorkspace();
  const { mutateAsync: createDocument } = useApiMutation<Document>(
    "POST",
    API.ENDPOINTS.DOCUMENTS.CREATE,
    {
      invalidateQueries: [
        ["workspace-documents", currentWorkspaceId],
        ["workspace", currentWorkspaceId],
      ],
      onSuccess: (data) => {
        if (data.data)
          navigate(
            ROUTES.AUTHENTICATED.DOCUMENT(data.data.id, currentWorkspaceId)
          );
        toast.success(data.message);
      },
    }
  );

  const handleCreateDocument = async (workspaceId: number) =>
    createDocument({ workspaceId });

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="gap-3">
        <CarouselItem className="basis-1/3 lg:basis-1/5">
          <Card
            className="cursor-pointer hover:bg-accent transition-colors aspect-square border-2 border-accent border-dashed"
            onClick={() => handleCreateDocument(currentWorkspaceId)}
          >
            <CardContent className="flex flex-col h-full items-center justify-center  gap-2">
              <Plus className="text-muted-foreground" />
              <span className="text-sm font-medium text-center text-muted-foreground">
                Create New Document
              </span>
            </CardContent>
          </Card>
        </CarouselItem>

        {documents.map((document, index) => {
          const color = document.colorHex ?? defaultDocumentColor;

          return (
            <CarouselItem key={index} className="basis-1/3 lg:basis-1/5">
              <ColoredCard
                title={document.title ?? "Untitled"}
                color={color}
                titleClassName="truncate max-w-[100px]"
                to={ROUTES.AUTHENTICATED.DOCUMENT(
                  document.id,
                  currentWorkspaceId
                )}
              >
                <span className="font-semibold flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4" /> 
                  Last edited {" "}
                  {formatDistanceToNow(new Date(document.updatedAt || document.createdAt), { addSuffix: true })}
                </span>
              </ColoredCard>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
};

export default CreateDocCarousel;
