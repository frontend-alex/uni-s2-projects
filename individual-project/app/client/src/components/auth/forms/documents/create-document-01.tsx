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
import { DocumentKind } from "@/types/workspace";
import type { DocumentFormProps } from "@/types/types";
import { FileText, Square } from "lucide-react";

const CreateDocument = ({ documentForm, isPending }: DocumentFormProps) => {
  const kind = documentForm.watch("kind");

  const toggleKind = () => {
    documentForm.setValue(
      "kind",
      kind === DocumentKind.DOCUMENT
        ? DocumentKind.WHITEBOARD
        : DocumentKind.DOCUMENT,
      { shouldDirty: true, shouldValidate: true }
    );
  };

  return (
    <div>
      <Form {...documentForm}>
        <div className="space-y-4">
          <div>
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
                          kind === DocumentKind.DOCUMENT
                            ? "default"
                            : "outline"
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
