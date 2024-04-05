import { FC } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardImage,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import { Rating } from "./rating";
import { Movie } from "@/lib/api/movie";
import { useTmdbPoster as tmdbPoster } from "@/hooks/useTmdbImage";
import { AspectRatio } from "./ui/aspect-ratio";
import slugify from "slugify";
import {
  CastCreditUnion,
  CastMovieCredit,
  CastTvShowCredit,
  CrewCreditUnion,
  Person,
} from "@/lib/api/person";
import { TvShow } from "@/lib/api/tv-show";

export interface MovieCardProps {
  item:
    | Movie
    | TvShow
    | CastCreditUnion
    | CrewCreditUnion
    | CastMovieCredit
    | CastTvShowCredit
    | Person;
}

const ListCard: FC<MovieCardProps> = ({ item }) => {
  let title: string;
  let imageUrl: string;
  let slug: string;
  let href: string;
  let releaseDate: Date | null;

  switch (item.media_type) {
    case "movie":
      title = item.title;
      releaseDate = item.release_date ? new Date(item.release_date) : null;
      imageUrl = tmdbPoster(item, "w500");
      slug = slugify(title, { lower: true, strict: true });
      href = `/movie/${item.id}/${slug}`;
      break;
    case "tv":
      title = item.name;
      releaseDate = item.first_air_date ? new Date(item.first_air_date) : null;
      imageUrl = tmdbPoster(item, "w500");
      slug = slugify(title, { lower: true, strict: true });
      href = `/tv/${item.id}/${slug}`;
      break;
    case "person":
      title = item.name;
      releaseDate = null;
      imageUrl = tmdbPoster({ poster_path: item.profile_path }, "w500");
      slug = slugify(title, { lower: true, strict: true });
      href = `/person/${item.id}/${slug}`;
      break;
    default:
      title = "Unknown";
      releaseDate = null;
      imageUrl = "";
      href = "#";
      break;
  }

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
        {item.media_type === "movie" || item.media_type === "tv" ? (
          <div className="pointer-events-none absolute -bottom-6 right-1 rounded-full border-2 border-border bg-background">
            <Rating
              progress={Math.round(item.vote_average * 10)}
              className="font-bold"
            />
          </div>
        ) : null}
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
          {item.media_type === "person"
            ? item.known_for
                .map((knownFor) => knownFor.title)
                .filter((x) => !!x)
                .join(", ")
            : releaseDate &&
              Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }).format(releaseDate)}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default ListCard;
