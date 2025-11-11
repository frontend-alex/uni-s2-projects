import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface ColoredCardProps {
  title: string;
  color: string;
  to?: string;
  onClick?: () => void;
  headerIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
}

export const ColoredCardSkeleton = () => {
  return <Skeleton className="w-full h-full rounded-md aspect-square" />;
};

const ColoredCard = ({
  title,
  color,
  to,
  onClick,
  headerIcon,
  children,
  className = "",
  titleClassName = "",
}: ColoredCardProps) => {
  const cardContent = (
    <Card
      className={`pb-0 overflow-hidden flex flex-col cursor-pointer hover:bg-accent transition-colors aspect-square ${className}`}
      onClick={onClick}
    >
      <CardHeader className="flex items-center justify-between">
        <CardTitle className={`w-full ${titleClassName}`}>{title}</CardTitle>
        {headerIcon}
      </CardHeader>
      {children && <CardContent className="flex h-full">{children}</CardContent>}
      <CardFooter className="p-0 mb-0 relative mt-auto">
        <span
          style={{ "--dynamic-bg": color } as React.CSSProperties}
          className="absolute left-1/2 -translate-x-1/2 bg-[var(--dynamic-bg)] w-[60px] rounded-full h-[40px] rounded-b-md"
        />
        <span
          style={{ "--dynamic-bg": color } as React.CSSProperties}
          className="bg-[var(--dynamic-bg)] w-full h-[10px] rounded-b-md"
        />
      </CardFooter>
    </Card>
  );

  if (to) {
    return <Link to={to}>{cardContent}</Link>;
  }

  return cardContent;
};

export default ColoredCard;

