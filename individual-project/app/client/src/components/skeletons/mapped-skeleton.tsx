import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const MappedSkeleton = ({
  direction = "horizontal",
  className,
}: {
  direction?: "vertical" | "horizontal";
  className?: string;
}) => {
  return (
    <div
      className={`w-full flex gap-2 ${
        direction == "horizontal" ? "flex-row" : "flex-col"
      }`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(`w-full h-full rounded-md ${ direction == "horizontal" ? "aspect-square" : "h-10"} `, className)}
        />
      ))}
    </div>
  );
};
