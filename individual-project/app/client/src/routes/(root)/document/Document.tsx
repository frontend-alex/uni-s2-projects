import { useEffect, useCallback, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDocument, useUpdateDocument } from "@/hooks/document/use-document";
import { Skeleton } from "@/components/ui/skeleton";
import { EditorJSEditor, type OutputData } from "@/components/editors/editorjs-editor";

const Document = () => {
  const { documentId } = useParams<{ documentId: string }>();

  const { data: documentResponse, isLoading } = useDocument(Number(documentId));

  const document = documentResponse?.data;

  const updateDocumentMutation = useUpdateDocument(Number(documentId));
  const { mutateAsync: updateDocument } = updateDocumentMutation;

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<number>(Date.now());

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

  useEffect(() => {
    if (document) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
    }
  }, [document?.id]);

  const localStorageKey = `doc-${documentId}-draft`;

  const saveToLocalStorage = useCallback((content: string) => {
    try {
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({ content, lastModified: Date.now() })
      );
    } catch (error) {
      console.warn("Failed to save to localStorage:", error);
    }
  }, [localStorageKey]);

  const clearLocalDraft = useCallback(() => {
    try {
      localStorage.removeItem(localStorageKey);
    } catch (error) {
      console.warn("Failed to clear localStorage:", error);
    }
  }, [localStorageKey]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleContentChange = useCallback(
    (data: OutputData) => {
      if (!Number(documentId)) return;

      const contentString = JSON.stringify(data);

      saveToLocalStorage(contentString);

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      const timeSinceLastSave = Date.now() - lastSaveRef.current;
      const debounceDelay = timeSinceLastSave > 5000 ? 300 : 500; // 300ms if idle, 500ms if actively typing

      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          await updateDocument({
            content: contentString,
          });
          clearLocalDraft();
          lastSaveRef.current = Date.now();
        } catch (error) {
          console.error("Failed to update content:", error);
        }
      }, debounceDelay);
    },
    [updateDocument, documentId, saveToLocalStorage, clearLocalDraft]
  );

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
