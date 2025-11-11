import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DocumentKind, WorkspaceVisibility } from "@/types/workspace";
import type { DocumentFormProps } from "@/types/types";
import { FileText, Lock, LockOpen, Square } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const CreateDocument = ({ documentForm, isPending }: DocumentFormProps) => {
  const kind = documentForm.watch("kind");
  const vis = documentForm.watch("visibility");

  const toggleKind = () => {
    documentForm.setValue(
      "kind",
      kind === DocumentKind.DOCUMENT
        ? DocumentKind.WHITEBOARD
        : DocumentKind.DOCUMENT,
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const toggleVisibility = () => {
    documentForm.setValue(
      "visibility",
      vis === WorkspaceVisibility.PUBLIC
        ? WorkspaceVisibility.PRIVATE
        : WorkspaceVisibility.PUBLIC,
      { shouldDirty: true, shouldValidate: true }
    );
  };

  return (
    <div>
      <Form {...documentForm}>
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex flex-col w-full">
              <Label
                htmlFor="document-title"
                className="text-sm font-medium text-stone-400 mb-2"
              >
                Document Title
              </Label>
              <FormField
                control={documentForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="input no-ring"
                        placeholder="e.g., Meeting Notes, Project Plan"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={documentForm.control}
              name="visibility"
              render={() => (
                <FormItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant={
                          vis === WorkspaceVisibility.PUBLIC
                            ? "secondary"
                            : "default"
                        }
                        onClick={toggleVisibility}
                        disabled={isPending}
                        className="shrink-0"
                      >
                        {vis === WorkspaceVisibility.PUBLIC ? (
                          <>
                            <LockOpen className="mr-2 h-4 w-4" />
                            Public
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Private
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm text-stone-400">
                        {vis === WorkspaceVisibility.PUBLIC
                          ? "Anyone with a link can view this workspace."
                          : "Only invited members can access this workspace."}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Label
              htmlFor="document-kind"
              className="text-sm font-medium text-stone-400 mb-2"
            >
              Document Type
            </Label>
            <FormField
              control={documentForm.control}
              name="kind"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={
                          kind === DocumentKind.DOCUMENT ? "default" : "outline"
                        }
                        onClick={toggleKind}
                        disabled={isPending}
                        className="flex-1"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Document
                      </Button>
                      <Button
                        type="button"
                        variant={
                          kind === DocumentKind.WHITEBOARD
                            ? "default"
                            : "outline"
                        }
                        onClick={toggleKind}
                        disabled={isPending}
                        className="flex-1"
                      >
                        <Square className="mr-2 h-4 w-4" />
                        Whiteboard
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreateDocument;
