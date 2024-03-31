import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useTmdbPoster as tmdbPoster } from "@/hooks/useTmdbImage";
import { MovieDetails } from "@/lib/api/movie";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import slugify from "slugify";

export interface TopBarProps {
  movie: MovieDetails;
}

const TopBar: FC<TopBarProps> = ({ movie }) => {
  const slug = slugify(movie.title, { lower: true, strict: true });
  const movieUrl = `/movies/${movie.id}/${slug}`;
  const posterUrl = tmdbPoster(movie, "w154");
  return (
    <>
      <div className="sticky top-0 z-10 w-full bg-background">
        <div className="bg-primary pb-1 pt-2 text-primary-foreground">
          <div className="container flex items-center gap-4">
            <Link href={movieUrl}>
              <div className="w-10">
                <AspectRatio ratio={2 / 3}>
                  <Image
                    src={posterUrl}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt={movie.title}
                    className="rounded-md object-cover"
                  />
                </AspectRatio>
              </div>
            </Link>
            <div className="space-y-1">
              <h1 className="text-xl font-bold">
                {movie.title}{" "}
                <span className="text-primary-foreground/50">
                  ({new Date(movie.release_date).getFullYear()})
                </span>
              </h1>
              <Link
                className="group inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline sm:text-base"
                href={movieUrl}
              >
                <MoveLeft className="inline-block h-4 w-4 transition-transform group-hover:-translate-x-0.5 sm:h-5 sm:w-5" />
                Back to details
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 z-20 w-full bg-background">
        <div className="bg-primary py-4 text-primary-foreground">
          <div className="container flex items-center gap-4">
            <Link href={movieUrl}>
              <div className="w-14 sm:w-20">
                <AspectRatio ratio={2 / 3}>
                  <Image
                    src={posterUrl}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt={movie.title}
                    className="rounded-md object-cover"
                  />
                </AspectRatio>
              </div>
            </Link>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold sm:text-3xl">
                {movie.title}{" "}
                <span className="text-primary-foreground/50">
                  ({new Date(movie.release_date).getFullYear()})
                </span>
              </h1>
              <Link
                className="group inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline sm:text-base"
                href={movieUrl}
              >
                <MoveLeft className="inline-block h-4 w-4 transition-transform group-hover:-translate-x-0.5 sm:h-5 sm:w-5" />
                Back to details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopBar;
