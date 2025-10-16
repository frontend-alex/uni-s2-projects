import Navbar from "@/components/Navbar";
import { GridDotBackground } from "@/components/ui/backgrounds/grid-dot-background";
import { Button } from "@/components/ui/button";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/router-paths";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <GridDotBackground className="h-[50dvh] absolute top-0 -z-1" />

      <div className="h-[calc(100vh-100px)] w-full flex flex-col gap-5 items-center justify-center">
        <div className="mx-auto text-3xl font-bold tracking-tight md:text-6xl lg:text-7xl text-center">
          Unlock Knowledge, Together With
          <PointerHighlight containerClassName="mx-auto">
            <span>PeerLearn</span>
          </PointerHighlight>
        </div>
        <p className="font-medium text-stone-400 max-w-2xl mx-auto text-center text-base">
          Join a vibrant community of learners and educators. Share your
          expertise, ask questions, and grow together. PeerLearn makes learning
          collaborative and fun!
        </p>
        <Link to={ROUTES.PUBLIC.REGISTER}>
          <Button>Get Started</Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
