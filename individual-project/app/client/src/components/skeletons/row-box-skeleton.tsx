import { Skeleton } from "@/components/ui/skeleton";

const RowBoxSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton
          key={index}
          className="w-full h-full rounded-md"
        />
      ))}
    </div>
  );
};

export default RowBoxSkeleton;
