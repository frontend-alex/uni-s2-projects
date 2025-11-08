import { Skeleton } from "@/components/ui/skeleton";

export const GridBoxSkeleton = () => {
  return (
    <div className="w-full flex gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton
          key={index}
          className="w-full h-full rounded-md aspect-square"
        />
      ))}
    </div>
  );
};

