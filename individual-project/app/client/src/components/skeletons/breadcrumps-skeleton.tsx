import { Skeleton } from "@/components/ui/skeleton";

export const BreadCrumpSkeleton = () => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-16" />
      <span className="text-muted-foreground">/</span>
      <Skeleton className="h-4 w-24" />
      <span className="text-muted-foreground">/</span>
      <Skeleton className="h-4 w-12" />
    </div>
  );
};

