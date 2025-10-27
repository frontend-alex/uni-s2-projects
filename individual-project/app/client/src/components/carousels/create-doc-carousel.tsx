import { Plus } from "lucide-react";

import { getRandomColor } from "@/lib/utils";
import { randomColors } from "@/consts/consts";
import { useTheme } from "@/contexts/ThemeContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { Document } from "@/types/workspace";

export const CreateDocCrouselSkeleton = () => {
  return (
    <div className="w-full flex gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="w-full h-full rounded-md aspect-square" />
      ))}
    </div>
  );
};

const CreateDocCarousel = ({ documents }: { documents: Document[] }) => {

  const { theme } = useTheme();

  const handleCreateDocument = () => {
    console.log("Create document clicked");
  };

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {/* Static Create Document Card - Always First */}
        <CarouselItem className="basis-1/3 lg:basis-1/5">
          <div className="p-1">
            <Card
              className="cursor-pointer hover:bg-accent transition-colors w-full aspect-square border-2 border-accent border-dashed"
              onClick={handleCreateDocument}
            >
              <CardContent className="flex flex-col h-full items-center justify-center  gap-2">
                <Plus className="text-muted-foreground" />
                <span className="text-sm font-medium text-center text-muted-foreground">
                  Create New Document
                </span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>

        {documents.map((document, index) => {
          const color = getRandomColor(randomColors, theme);
          
          return (
          <CarouselItem key={index} className="basis-1/3 lg:basis-1/5">
            <div className="p-1">
              <Card className="cursor-pointer hover:bg-accent transition-colors w-full aspect-square overflow-hidden pb-0">
                <CardContent className="flex h-full items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{document.title}</span>
                </CardContent>
                <CardFooter className="p-0 mb-0 relative mt-auto">
                  <span
                    style={{ "--dynamic-bg": color } as React.CSSProperties}
                    className="absolute left-1/2 -translate-x-1/2 bg-[var(--dynamic-bg)] w-[60px] rounded-full h-[40px] rounded-b-md"
                  ></span>
                  <span
                    style={{ "--dynamic-bg": color } as React.CSSProperties}
                    className="bg-[var(--dynamic-bg)] w-full h-[10px] rounded-b-md"
                  ></span>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        )})}
      </CarouselContent>
    </Carousel>
  );
};

export default CreateDocCarousel;
