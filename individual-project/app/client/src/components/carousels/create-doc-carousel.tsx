import { Plus } from "lucide-react";

import { defaultDocumentColor } from "@/consts/consts";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { Document } from "@/types/workspace";
import { useApiMutation } from "@/hooks/hook";
import { API } from "@/lib/config";
import { useCurrentWorkspace } from "@/hooks/workspace/use-current-workspace";
import { Link, useNavigate } from "react-router-dom";
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
      invalidateQueries: [["workspace-documents", currentWorkspaceId], ["workspace", currentWorkspaceId]],
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
      <CarouselContent>
        <CarouselItem className="basis-1/3 lg:basis-1/5">
          <div className="p-1">
            <Card
              className="cursor-pointer hover:bg-accent transition-colors aspect-square border-2 border-accent border-dashed h-[150px] w-[150px]"
              onClick={() => handleCreateDocument(currentWorkspaceId)}
            >
              <CardContent className="flex flex-col h-full items-center justify-center  gap-2">
                <Plus className="text-muted-foreground" />
                <span className="text-sm font-medium text-center text-muted-foreground">
                  Create New Document
                </span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>

        {documents.map((document, index) => {
          const color = document.colorHex ?? defaultDocumentColor;

          return (
            <Link
              to={ROUTES.AUTHENTICATED.DOCUMENT(
                document.id,
                currentWorkspaceId
              )}
              key={index}
            >
              <CarouselItem className="basis-1/3 lg:basis-1/5">
                <div className="p-1">
                  <Card className="cursor-pointer hover:bg-accent transition-colors aspect-square overflow-hidden pb-0 h-[150px] w-[150px]">
                    <CardContent className="flex h-full">
                      <span className="font-semibold">{document.title}</span>
                    </CardContent>
                    <CardFooter className="p-0 mb-0 relative mt-auto">
                      <span
                        style={{ "--dynamic-bg": color } as React.CSSProperties}
                        className="absolute left-1/2 -translate-x-1/2 bg-[var(--dynamic-bg)] w-[60px] rounded-full h-[40px] rounded-b-md"
                      ></span>
                      <span
                        style={{ "--dynamic-bg": color } as React.CSSProperties}
                        className="bg-[var(--dynamic-bg)] w-full h-[10px] rounded-b-md"
                      ></span>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            </Link>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
};

export default CreateDocCarousel;
