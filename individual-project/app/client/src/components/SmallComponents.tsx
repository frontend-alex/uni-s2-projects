import { Lock, LockOpen } from "lucide-react";
import { WorkspaceVisibility } from "@/types/workspace"; 

interface WorkspaceVisibilityIconProps {
  visibility: WorkspaceVisibility | number | undefined;
  className?: string;
  onClick?: () => void;
}

export const WorkspaceVisibilityIcon = ({
  visibility,
  className = "h-3 w-3",
  onClick,
}: WorkspaceVisibilityIconProps) => {
  const isPrivate = visibility === WorkspaceVisibility.PRIVATE;

  const Icon = isPrivate ? Lock : LockOpen;

  return (
    <Icon
      onClick={onClick}
      className={className}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    />
  );
};

