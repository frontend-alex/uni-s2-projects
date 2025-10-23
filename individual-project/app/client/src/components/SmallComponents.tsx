import { Lock, LockOpen } from "lucide-react";
import { WorkspaceVisibility } from "@/types/workspace"; 

interface WorkspaceVisibilityIconProps {
  visibility: WorkspaceVisibility | number | undefined;
  className?: string;
}

export const WorkspaceVisibilityIcon = ({
  visibility,
  className = "h-3 w-3",
}: WorkspaceVisibilityIconProps) => {
  const isPrivate = visibility === WorkspaceVisibility.PRIVATE;

  const Icon = isPrivate ? Lock : LockOpen;

  return <Icon className={className} />;
};

