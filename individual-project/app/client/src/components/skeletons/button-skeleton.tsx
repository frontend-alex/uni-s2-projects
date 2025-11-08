import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const ButtonSkeleton = () => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full flex-start font-normal hover:text-destructive -ml-[2px] group cursor-pointer"
    >
      <Skeleton className="size-9" />
    </Button>
  );
};

