"use client";

import { MultiSearchResultUnion } from "@/lib/api/search";
import { cn } from "@/lib/utils";
import React, { FC, useMemo } from "react";
import SearchResultCard from "./search-card";
import { TvShow } from "@/lib/api/tv-show";
import { Movie } from "@/lib/api/movie";
import { Person } from "@/lib/api/person";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

export interface SearchListProps {
  query: string;
  results: MultiSearchResultUnion[];
  className?: string;
  resultType?: "movie" | "tv" | "person";
}

const SearchList: FC<SearchListProps> = ({
  query,
  results,
  className,
  resultType = "movie",
}) => {
  const router = useRouter();

  const tvShows = useMemo(
    () => results.filter((result) => result.media_type === "tv") as TvShow[],
    [results],
  );

  const movies = useMemo(
    () => results.filter((result) => result.media_type === "movie") as Movie[],
    [results],
  );

  const people = useMemo(
    () =>
      results.filter((result) => result.media_type === "person") as Person[],
    [results],
  );

  return (
    <div className={cn("w-full space-y-8", className)}>
      <Tabs
        value={resultType}
        className="w-full"
        onValueChange={(value) => {
          const searchParams = new URLSearchParams();
          searchParams.set("q", query);
          searchParams.set("mediaType", value);
          router.push("?" + searchParams.toString());
        }}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="movie">Movies</TabsTrigger>
          <TabsTrigger value="tv">TV Shows</TabsTrigger>
          <TabsTrigger value="person">People</TabsTrigger>
        </TabsList>
        <TabsContent value="movie">
          {movies.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {movies.map((result, i) => (
                <SearchResultCard
                  key={`movie-${i}-${result.id}`}
                  result={result}
                />
              ))}
            </div>
          ) : (
            <p className="my-8 text-center font-medium text-muted-foreground">
              No results found
            </p>
          )}
        </TabsContent>
        <TabsContent value="tv">
          {tvShows.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {tvShows.map((result, i) => (
                <SearchResultCard
                  key={`tv-${i}-${result.id}`}
                  result={result}
                />
              ))}
            </div>
          ) : (
            <p className="my-8 text-center font-medium text-muted-foreground">
              No results found
            </p>
          )}
        </TabsContent>
        <TabsContent value="person">
          {people.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {people.map((result, i) => (
                <SearchResultCard
                  key={`person-${i}-${result.id}`}
                  result={result}
                />
              ))}
            </div>
          ) : (
            <p className="my-8 text-center font-medium text-muted-foreground">
              No results found
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchList;
