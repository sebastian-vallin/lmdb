import ListCard from "@/components/list-card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getPopular, getTrending } from "@/lib/api/movie";
import { MoveRight } from "lucide-react";
import Link from "next/link";

const HomePage = async () => {
  const [popularMovies, trendingMovies] = await Promise.all([
    getPopular(),
    getTrending("week"),
  ]);

  return (
    <main>
      <div className="mb-8 bg-primary/25 py-24">
        <div className="container">
          <h1 className="text-center text-5xl font-semibold">
            <span className="relative">
              Welcome to{" "}
              <span className="font-bold">
                LM
                <span className="text-primary underline">DB</span>
              </span>
              <small className="absolute -bottom-4 right-0 text-xs">
                Powered by{" "}
                <a className="underline" href="https://www.themoviedb.org/">
                  TMDB
                </a>
              </small>
            </span>
          </h1>
        </div>
      </div>

      <div className="container space-y-8">
        <div>
          <div className="mb-4 flex flex-col items-stretch justify-between gap-2 md:flex-row md:items-center md:px-8">
            <h2 className="w-full text-2xl font-bold">
              Popular movies right now
            </h2>

            <Button
              asChild
              className="group w-full justify-between gap-1 md:w-auto"
            >
              <Link href="/movie">
                View all
                <MoveRight className="h-5 w-5 transform transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          <Carousel className="mx-auto w-full md:max-w-[calc(100%-4rem)]">
            <CarouselContent>
              {popularMovies.results.map((movie, i) => (
                <CarouselItem
                  key={`popular-${movie.id}`}
                  className="basis-full md:basis-1/2 lg:basis-1/4 xl:basis-1/5"
                >
                  <ListCard item={movie} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
            <div className="flex justify-end gap-4 pt-2 md:hidden">
              <div>
                <CarouselPrevious className="static translate-x-0 translate-y-0" />
              </div>
              <div>
                <CarouselNext className="static translate-x-0 translate-y-0" />
              </div>
            </div>
          </Carousel>
        </div>

        <div>
          <div className="mb-4 flex flex-col items-stretch justify-between gap-2 md:flex-row md:items-center md:px-8">
            <h2 className="w-full text-2xl font-bold">Trending this week</h2>

            <Button
              asChild
              className="group w-full justify-between gap-1 md:w-auto"
            >
              <Link href="/movie/trending">
                View all
                <MoveRight className="h-5 w-5 transform transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          <Carousel className="mx-auto w-full md:max-w-[calc(100%-4rem)]">
            <CarouselContent>
              {trendingMovies.results.map((movie) => (
                <CarouselItem
                  key={`trending-${movie.id}`}
                  className="basis-full md:basis-1/2 lg:basis-1/4 xl:basis-1/5"
                >
                  <ListCard item={movie} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
            <div className="flex justify-end gap-4 pt-2 md:hidden">
              <div>
                <CarouselPrevious className="static translate-x-0 translate-y-0" />
              </div>
              <div>
                <CarouselNext className="static translate-x-0 translate-y-0" />
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
