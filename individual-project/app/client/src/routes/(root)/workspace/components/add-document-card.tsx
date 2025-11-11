import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import GlobalDialog from "@/components/dialogs/GlobalDialog";
import CreateDocumentForm from "@/components/auth/forms/documents/create-document-01";
import {
  documentSchema,
  type DocumentSchemaType,
} from "@/utils/schemas/document/document.schema";
import { DocumentKind, type Document } from "@/types/workspace";
import { API } from "@/lib/config";
import { useApiMutation } from "@/hooks/hook";
import { useCurrentWorkspace } from "@/routes/(root)/workspace/hooks/use-current-workspace";
import { ROUTES } from "@/lib/router-paths";

/**
 * A reusable component for creating new documents.
 * Can be dropped into either grid or row layouts.
 */
const CreateDocumentCard = ({
  variant = "grid", // "grid" | "row"
}: {
  variant?: "grid" | "row";
}) => {
  const navigate = useNavigate();
  const { currentWorkspaceId } = useCurrentWorkspace();

  const { mutateAsync: createDocument, isPending } = useApiMutation<Document>(
    "POST",
    API.ENDPOINTS.DOCUMENTS.CREATE,
    {
      invalidateQueries: [
        ["workspace-documents", currentWorkspaceId],
        ["workspace", currentWorkspaceId],
      ],
      onSuccess: (data) => {
        if (data.data) {
          navigate(
            ROUTES.AUTHENTICATED.DOCUMENT(
              currentWorkspaceId,
              data.data.id,
              data.data.kind
            )
          );
        }
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
    <GlobalDialog
      content={<CreateDocumentForm documentForm={form} isPending={isPending} />}
      onConfirm={async () => {
        form.setValue("workspaceId", currentWorkspaceId || 0);
        const isValid = await form.trigger();
        if (isValid) await handleCreateDocument(form.getValues());
      }}
      title="Create New Document"
      description="Enter the document details"
      confirmText="Create"
      cancelText="Cancel"
      isLoading={isPending}
      hideFooter={false}
    >
      {variant === "grid" ? (
        <Card className="cursor-pointer hover:bg-accent transition-colors aspect-square border-2 border-accent border-dashed">
          <CardContent className="flex flex-col h-full items-center justify-center gap-2">
            <Plus className="text-muted-foreground" />
            <span className="text-sm font-medium text-center text-muted-foreground">
              Create New Document
            </span>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-center justify-center gap-3 p-3 cursor-pointer hover:bg-accent transition-colors rounded-md border-2 border-accent border-dashed">
          <Plus className="text-muted-foreground" />
          <span className="text-sm font-medium text-center text-muted-foreground">
            Create New Document
          </span>
        </div>
      )}
    </GlobalDialog>
  );
};

export default CreateDocumentCard;
