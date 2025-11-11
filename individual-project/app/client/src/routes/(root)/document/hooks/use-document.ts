import { useApiQuery, useApiMutation } from "@/hooks/hook";
import { API } from "@/lib/config";
import type { Document } from "@/types/workspace";

export const useDocument = (documentId: number | undefined) => {
  return useApiQuery<Document>(
    ["document", documentId],
    API.ENDPOINTS.DOCUMENTS.Id(documentId),
    {
      staleTime: 2 * 60 * 1000,
      enabled: !!documentId,
    }
  );
};


export const useUpdateDocument = (documentId: number) => {
  return useApiMutation<Document>(
    "PUT",
    API.ENDPOINTS.DOCUMENTS.Id(documentId),
    {
      invalidateQueries: [["document", documentId], ["workspace"]],
    }
  );
};

