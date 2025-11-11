import { useApiMutation } from "@/hooks/hook";
import { useCurrentWorkspace } from "@/hooks/workspace/use-current-workspace";
import { API } from "@/lib/config";
import { ROUTES } from "@/lib/router-paths";
import type { Workspace } from "@/types/workspace";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDocumentImportExport } from "@/hooks/document";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  EllipsisVerticalIcon,
  FileText,
  Settings,
  Trash,
  FileType,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import { cn } from "@/lib/utils";

const ManageDocumentDropdown = ({
  className,
  variant = "secondary",
}: {
  className?: string;
  variant?:
    | "default"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive"
    | "outline";
}) => {
  const navigate = useNavigate();

  const { documentId } = useParams<{ documentId: string }>();
  const { currentWorkspaceId } = useCurrentWorkspace();

  const {
    fileInputRef,
    triggerImport,
    handleFileInputChange,
    exportWhiteboardPDF,
    exportDocumentPDF,
    exportDocumentWord,
    canImport,
    canExportWhiteboard,
    canExportDocument,
  } = useDocumentImportExport({
    documentId: Number(documentId),
  });

  const { mutateAsync: deleteWorkspace, isPending: isDeletingWorkspace } =
    useApiMutation<Workspace>(
      "DELETE",
      API.ENDPOINTS.DOCUMENTS.Id(Number(documentId)),
      {
        invalidateQueries: [
          ["workspace", currentWorkspaceId],
          ["user-workspaces"],
        ],
        onSuccess: (data) => {
          toast.success(data.message);
          navigate(ROUTES.AUTHENTICATED.BOARD(currentWorkspaceId));
        },
        onError: (error) => {
          toast.error(error.response?.data.message);
        },
      }
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant={variant} className={cn(className, "")}>
          <EllipsisVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Manage Document</DropdownMenuLabel>

        <DropdownMenuItem>
          <Settings />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {canImport && (
          <>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                triggerImport();
              }}
            >
              <Upload className="text-stone-400 size-5" />
              <span>Import</span>
            </DropdownMenuItem>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.md,.markdown,.txt,.readme"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="w-full gap-2">
            <Download className="text-stone-400 size-5" />
            <span>Export</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {canExportWhiteboard ? (
              <DropdownMenuItem onClick={() => exportWhiteboardPDF()}>
                <FileText />
                <span>PDF</span>
              </DropdownMenuItem>
            ) : canExportDocument ? (
              <>
                <DropdownMenuItem onClick={() => exportDocumentPDF()}>
                  <FileText />
                  <span>PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportDocumentWord()}>
                  <FileType />
                  <span>Word</span>
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <DeleteDialog
            isLoading={isDeletingWorkspace}
            onConfirm={async () => await deleteWorkspace(undefined)}
          >
            <Button
              variant={"ghost"}
              className="flex items-center justify-start w-max text-destructive hover:text-destructive p-0 m-0 h-[20px]"
            >
              <Trash className="h-4 w-4 text-destructive hover:text-destructive" />
              Delete Document
            </Button>
          </DeleteDialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ManageDocumentDropdown;
