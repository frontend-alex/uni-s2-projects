import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const DropdownSkeleton = () => {
  return (
    <Button
      variant="ghost"
      disabled
      className="no-ring h-12 w-full justify-start gap-3 px-3"
    >
      <Skeleton className="h-8 w-8 rounded-lg" />
      <div className="flex flex-col gap-1 flex-1 text-left">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-36" />
      </div>
    </Button>
  );
};

