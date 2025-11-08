import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDocument, useUpdateDocument } from "@/hooks/document/use-document";
import { Skeleton } from "@/components/ui/skeleton";
import { EditorJSEditor, type OutputData } from "@/components/editors/editorjs-editor";
import { useAutoSave } from "@/hooks/useAutoSave";

const Document = () => {
  const { documentId } = useParams<{ documentId: string }>();

  const { data: documentResponse, isLoading } = useDocument(Number(documentId));

  const document = documentResponse?.data;

  const updateDocumentMutation = useUpdateDocument(Number(documentId));
  const { mutateAsync: updateDocument } = updateDocumentMutation;

  const localStorageKey = `doc-${documentId}-draft`;

  const { handleChange } = useAutoSave({
    documentId: Number(documentId) || 0,
    enabled: !!documentId,
    onSave: async (content: string) => {
      await updateDocument({ content });
    },
    localStorageKey,
  });

  const initialContent = useMemo(() => {
    if (!document) return undefined;
    
    if (!document.content || document.content.trim() === '') {
      return { blocks: [] };
    }
    
    try {
      const parsedContent = JSON.parse(document.content);
      
      if (parsedContent && Array.isArray(parsedContent.blocks)) {
        return parsedContent;
      }
      
      return { blocks: [] };
    } catch (error) {
      return { blocks: [] };
    }
  }, [document?.id]);

  const handleContentChange = (data: OutputData) => {
    if (!Number(documentId)) return;
    const contentString = JSON.stringify(data);
    handleChange(contentString);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-8">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Document not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full ">
      <div className="w-full">
        <EditorJSEditor
          key={documentId}
          documentKey={documentId}
          data={initialContent}
          onChange={handleContentChange}
          placeholder="Start writing..."
        />
      </div>
    </div>
  );
};

export default Document;
