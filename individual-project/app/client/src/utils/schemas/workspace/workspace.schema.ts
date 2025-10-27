import { WorkspaceVisibility } from "@/types/workspace";
import z from "zod";

export const workspaceSchema = z.object({
  name: z.string().min(2).max(100),
  visibility: z.nativeEnum(WorkspaceVisibility),
});

export type WorkspaceSchemaType = z.infer<typeof workspaceSchema>;