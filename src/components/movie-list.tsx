"use client";

import MovieCard from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import { Movie } from "@/lib/api/movie";
import { cn } from "@/lib/utils";
import { FC, useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export interface MovieListProps {
  initialMovies: Movie[];
  totalPages: number;
  loadFn?: (page: number) => Movie[] | Promise<Movie[]>;
  className?: string;
}

const MovieList: FC<MovieListProps> = ({
  initialMovies,
  totalPages,
  loadFn,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState(initialMovies);
  const [loadMoreRef] = useInView({
    delay: 150,
    skip: isLoading || page >= totalPages,
    async onChange(inView) {
      if (inView) {
        loadMore();
      }
    },
  });

  const loadMore = useCallback(async () => {
    console.log("load more");
    setIsLoading(true);
    const nextPage = page + 1;
    const results = loadFn ? await loadFn(nextPage) : [];
    setMovies([...movies, ...results]);
    setPage(nextPage);
    setIsLoading(false);
  }, [movies, page, loadFn]);

  useEffect(() => {
    setMovies(initialMovies);
  }, [initialMovies]);

  return (
    <div className={cn("w-full space-y-8", className)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <p className="text-center">
        {page < totalPages ? (
          <Button
            size="lg"
            onClick={() => (isLoading ? undefined : loadMore())}
          >
            <span ref={loadMoreRef}>
              {isLoading ? <>Loading... </> : "Load More"}
            </span>
          </Button>
        ) : (
          <span className="font-medium text-muted-foreground">
            {movies.length > 0 ? "No more movies" : "No movies found"}
          </span>
        )}
      </p>
    </div>
  );
};

export default MovieList;
