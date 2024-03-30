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

export interface MovieCardProps {
  movie: Movie;
}

const MovieCard: FC<MovieCardProps> = ({ movie }) => {
  const imageUrl = useTmdbPoster(movie, "w342");
  const releaseDate = new Date(movie.release_date);
  const slug = slugify(movie.title, { lower: true, strict: true });

  return (
    <Card className="flex h-full flex-col">
      <Link href={`/movies/${movie.id}/${slug}`} className="relative">
        <AspectRatio ratio={2 / 3}>
          <CardImage
            src={imageUrl}
            alt={movie.title}
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
            <Link href={`/movies/${movie.id}/${slug}`}>{movie.title}</Link>
          </Button>
        </CardTitle>
        <CardDescription>
          {movie.release_date &&
            releaseDate &&
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
