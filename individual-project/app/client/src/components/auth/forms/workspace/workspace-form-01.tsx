  import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, LockOpen } from "lucide-react";
import { WorkspaceVisibility } from "@/types/workspace";
import type { WorkspaceFormProps } from "@/types/types";

const WorkspaceForm = ({ workspaceForm, isPending }: WorkspaceFormProps) => {
  const vis = workspaceForm.watch("visibility");

  const toggleVisibility = () => {
    workspaceForm.setValue(
      "visibility",
      vis === WorkspaceVisibility.PUBLIC
        ? WorkspaceVisibility.PRIVATE
        : WorkspaceVisibility.PUBLIC,
      { shouldDirty: true, shouldValidate: true }
    );
  };

  return (
    <div>
      <Form {...workspaceForm}>
        <div className="space-y-4">
            <div>
              <Label
                htmlFor="workspace-name"
                className="text-sm font-medium text-stone-400 mb-2"
              >
                Workspace Name
              </Label>
              <div className="flex items-center gap-2">
                <FormField
                  control={workspaceForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          className="input no-ring"
                          placeholder="e.g., My Study Room, Team Alpha, Learning Hub"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={workspaceForm.control}
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
            </div>
            <p className="text-sm text-stone-400">
              This will be the name of your personal learning space
            </p>
        </div>
      </Form>
    </div>
  );
};

export default WorkspaceForm;
