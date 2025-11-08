import { Clock, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { defaultDocumentColor } from "@/consts/consts";
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
import { WorkspaceVisibilityIcon } from "../SmallComponents";
import GlobalDialog from "@/components/dialogs/GlobalDialog";
import CreateDocument from "@/components/auth/forms/documents/create-document-01";
import { documentSchema, type DocumentSchemaType } from "@/utils/schemas/document/document.schema";
import { DocumentKind } from "@/types/workspace";

const CreateDocCarousel = ({ documents }: { documents: Document[] }) => {
  const navigate = useNavigate();

  const { currentWorkspaceId } = useCurrentWorkspace();
  const { mutateAsync: createDocument, isPending: isDocumentPending } = useApiMutation<Document>(
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

  const form = useForm<DocumentSchemaType>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      workspaceId: currentWorkspaceId || 0,
      title: "",
      kind: DocumentKind.DOCUMENT,
    },
  });

  const handleCreateDocument = async (data: DocumentSchemaType) => {
    await createDocument({
      workspaceId: data.workspaceId,
      title: data.title,
      kind: data.kind,
    });
  };

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="gap-3">
        <CarouselItem className="basis-1/3 lg:basis-1/5">
          <GlobalDialog
            content={
              <CreateDocument
                documentForm={form}
                isPending={isDocumentPending}
              />
            }
            onConfirm={async () => {
              form.setValue("workspaceId", currentWorkspaceId || 0);
              const isValid = await form.trigger();
              if (isValid) {
                await handleCreateDocument(form.getValues());
              }
            }}
            title="Create New Document"
            description="Enter the document details"
            confirmText="Create"
            cancelText="Cancel"
            isLoading={isDocumentPending}
            hideFooter={false}
          >
            <Card className="cursor-pointer hover:bg-accent transition-colors aspect-square border-2 border-accent border-dashed">
              <CardContent className="flex flex-col h-full items-center justify-center gap-2">
                <Plus className="text-muted-foreground" />
                <span className="text-sm font-medium text-center text-muted-foreground">
                  Create New Document
                </span>
              </CardContent>
            </Card>
          </GlobalDialog>
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
                headerIcon={
                  <WorkspaceVisibilityIcon className="size-5" visibility={document.visibility} />
                }
              >
                <span className="font-semibold flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Last edited{" "}
                  {formatDistanceToNow(
                    new Date(document.updatedAt || document.createdAt),
                    { addSuffix: true }
                  )}
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
