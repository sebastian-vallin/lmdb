import { Rating } from "@/components/rating";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardImage,
  CardTitle,
} from "@/components/ui/card";
import { useTmdbPoster } from "@/hooks/useTmdbImage";
import { MultiSearchResultUnion } from "@/lib/api/search";
import Link from "next/link";
import React, { FC } from "react";
import slugify from "slugify";

export interface SearchCardProps {
  result: MultiSearchResultUnion;
}

const SearchResultCard: FC<SearchCardProps> = ({ result }) => {
  const imageUrl = useTmdbPoster(
    {
      poster_path:
        result.media_type === "person"
          ? result.profile_path
          : result.poster_path,
    },
    "w342",
  );
  const title =
    result.media_type === "person"
      ? result.name
      : result.media_type === "movie"
        ? result.title
        : result.name;

  const date =
    result.media_type === "person"
      ? null
      : result.media_type === "movie"
        ? result.release_date
        : result.first_air_date;

  const releaseDate = date ? new Date(date) : null;
  const slug = slugify(title, { lower: true, strict: true });
  const href =
    result.media_type === "person"
      ? `/person/${result.id}/${slug}`
      : result.media_type === "movie"
        ? `/movie/${result.id}/${slug}`
        : `/tv/${result.id}/${slug}`;

  return (
    <Card className="flex h-full flex-col">
      <Link href={href} className="relative">
        <AspectRatio ratio={2 / 3}>
          <CardImage
            src={imageUrl}
            alt={title}
            width={256}
            height={384}
            className="m-auto object-cover"
          />
        </AspectRatio>
        {"vote_average" in result && (
          <div className="pointer-events-none absolute -bottom-6 right-1 rounded-full border-2 border-border bg-background">
            <Rating
              progress={Math.round(result.vote_average * 10)}
              className="font-bold"
            />
          </div>
        )}
      </Link>
      <CardHeader>
        <CardTitle>
          <Button
            asChild
            className="inline h-auto text-wrap p-0 text-base text-foreground"
            variant="link"
          >
            <Link href={href}>{title}</Link>
          </Button>
        </CardTitle>
        <CardDescription>
          {result.media_type === "person" ? (
            <span className="flex flex-col">
              {result.known_for.map((kf, i) => (
                <span key={`known-for-${i}-${kf.id}`}>{kf.title}</span>
              ))}
            </span>
          ) : (
            releaseDate &&
            Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(releaseDate)
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default SearchResultCard;
