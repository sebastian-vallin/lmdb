"use client";

import ListCard from "@/components/list-card";
import { Button } from "@/components/ui/button";
import { Movie } from "@/lib/api/movie";
import {
  CastCreditUnion,
  CastMovieCredit,
  CastTvShowCredit,
  CrewCreditUnion,
  Person,
} from "@/lib/api/person";
import { TvShow } from "@/lib/api/tv-show";
import { cn } from "@/lib/utils";
import { FC, useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type ItemType =
  | Movie
  | TvShow
  | CastCreditUnion
  | CrewCreditUnion
  | CastMovieCredit
  | CastTvShowCredit
  | Person;

export interface ListProps {
  initialItems: ItemType[];
  totalPages: number;
  loadFn?: (page: number) => ItemType[] | Promise<ItemType[]>;
  className?: string;
}

const List: FC<ListProps> = ({
  initialItems,
  totalPages,
  loadFn,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(initialItems);
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
    setIsLoading(true);
    const nextPage = page + 1;
    const results = loadFn ? await loadFn(nextPage) : [];
    setItems([...items, ...results]);
    setPage(nextPage);
    setIsLoading(false);
  }, [items, page, loadFn]);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  return (
    <div className={cn("w-full space-y-8", className)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item) => (
          <ListCard key={item.id} item={item} />
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
            {items.length > 0 ? "No more results" : "No results found"}
          </span>
        )}
      </p>
    </div>
  );
};

export default List;
