import { Lock, LockOpen } from "lucide-react";
import { WorkspaceVisibility } from "@/types/workspace";
import { useCallback } from "react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";

interface WorkspaceVisibilityIconProps {
  visibility: WorkspaceVisibility | undefined;
  className?: string;
  onClick?: () => void;
  onToggle?: (newVisibility: WorkspaceVisibility) => void | Promise<void>;
  clickable?: boolean;
}

export const WorkspaceVisibilityIcon = ({
  visibility,
  className = "h-3 w-3",
  onClick,
  onToggle,
  clickable = false,
}: WorkspaceVisibilityIconProps) => {
  // Backend uses "Private"/"Public", frontend enum is "PRIVATE"/"PUBLIC"
  // Normalize: convert backend format to frontend enum for comparison
  const getVisibility = () => {
    if (!visibility) return WorkspaceVisibility.PUBLIC;
    const visStr = String(visibility);
    return visStr.toUpperCase() === "PRIVATE"
      ? WorkspaceVisibility.PRIVATE
      : WorkspaceVisibility.PUBLIC;
  };

  const currentVis = getVisibility();
  const isPrivate = currentVis === WorkspaceVisibility.PRIVATE;
  const Icon = isPrivate ? Lock : LockOpen;

  const handleToggle = useCallback(async () => {
    if (!onToggle || !visibility) return;

    const newVisibility = isPrivate
      ? WorkspaceVisibility.PUBLIC
      : WorkspaceVisibility.PRIVATE;

    try {
      await onToggle(newVisibility);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update visibility");
    }
  }, [onToggle, visibility, isPrivate]);

  // Determine which handler to use
  const handleClick = onToggle ? handleToggle : onClick;
  const isClickable = clickable || !!onToggle || !!onClick;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Icon
          onClick={handleClick}
          className={`${className} ${
            isClickable ? "cursor-pointer hover:opacity-70" : ""
          }`}
        />
      </TooltipTrigger>
      <TooltipContent>
        {isPrivate
          ? "Only invited members can access this workspace."
          : "Anyone with a link can view this workspace."}
      </TooltipContent>
    </Tooltip>
  );
};
