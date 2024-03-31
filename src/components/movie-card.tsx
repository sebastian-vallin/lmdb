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
import { useTmdbPoster } from "@/hooks/useTmdbImage";
import { AspectRatio } from "./ui/aspect-ratio";
import slugify from "slugify";
import { CreditUnion, MovieCredit, TvCredit } from "@/lib/api/person";

export interface MovieCardProps {
  movie: Movie | CreditUnion | MovieCredit | TvCredit;
}

const MovieCard: FC<MovieCardProps> = ({ movie }) => {
  const imageUrl = useTmdbPoster(movie, "w342");
  const title =
    "media_type" in movie && movie.media_type === "tv"
      ? movie.name
      : movie.title;
  const date =
    "media_type" in movie && movie.media_type === "tv"
      ? movie.first_air_date
      : movie.release_date;

  const releaseDate = new Date(date);
  const slug = slugify(title, { lower: true, strict: true });
  const href =
    "media_type" in movie && movie.media_type === "tv"
      ? `/tv/${movie.id}/${slug}`
      : `/movies/${movie.id}/${slug}`;

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
        <div className="pointer-events-none absolute -bottom-6 right-1 rounded-full border-2 border-border bg-background">
          <Rating
            progress={Math.round(movie.vote_average * 10)}
            className="font-bold"
          />
        </div>
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
          {date &&
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

export default MovieCard;
