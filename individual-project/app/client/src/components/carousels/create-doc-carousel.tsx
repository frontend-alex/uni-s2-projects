import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import { Card } from "../ui/card";
import { CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Plus } from "lucide-react";

export const CreateDocCrouselSkeleton = () => {
  return (
    <div className="w-full flex gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="w-full h-full rounded-md aspect-square" />
      ))}
    </div>
  );
};

const CreateDocCarousel = () => {
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
                <span className="text-sm font-medium text-center text-muted-foreground">Create New Document</span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>

        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/3 lg:basis-1/5">
            <div className="p-1">
              <Card className="cursor-pointer hover:bg-accent transition-colors w-full aspect-square">
                <CardContent className="flex h-full items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default CreateDocCarousel;
