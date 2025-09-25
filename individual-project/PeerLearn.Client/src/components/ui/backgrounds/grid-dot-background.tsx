import { cn } from "@/lib/utils";

interface GridDotBackgroundProps {
  className?: string;
}

export const GridDotBackground = ({ className }: GridDotBackgroundProps) => {
  return (
    <div className={cn("relative flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black", className)}>
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:linear-gradient(to_bottom,transparent_0%,black_100%)] dark:bg-black"/>
    </div>
  );
}
