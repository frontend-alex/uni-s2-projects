import { DocumentKind, WorkspaceVisibility } from "@/types/workspace";
import z from "zod";

export const documentSchema = z.object({
  workspaceId: z.number().int().positive(),
  title: z.string().min(1, "Title is required").max(256, "Title must be 256 characters or less"),
  kind: z.nativeEnum(DocumentKind),
  visibility: z.nativeEnum(WorkspaceVisibility).optional(),
});

export type DocumentSchemaType = z.infer<typeof documentSchema>;

