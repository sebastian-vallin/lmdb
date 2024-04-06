import ListCard from "@/components/list-card";
import { Rating } from "@/components/rating";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  useTmdbBackdrop as tmdbBackdrop,
  useTmdbPoster as tmdbPoster,
} from "@/hooks/useTmdbImage";
import { getDetails } from "@/lib/api/movie";
import { Duration, formatDate } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { RedirectType, notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import slugify from "slugify";
import Review from "./review";

export const revalidate = Duration.minutes(30);

interface Props {
  params: {
    id: string;
    slug?: string;
  };
}

const MovieDetailsPage: NextPage<Props> = async ({ params }) => {
  const { credits, recommendations, reviews, ...movie } =
    (await getDetails(params.id)) ?? notFound();

  const slug = slugify(movie.title, { lower: true, strict: true });

  if (!params.slug) {
    redirect(`/movie/${params.id}/${slug}`, RedirectType.replace);
  }

  const posterUrl = tmdbPoster(movie, "w500");
  const backdropUrl = tmdbBackdrop(movie, "w780");
  const releaseDate = new Date(movie.release_date);

  const director = credits.crew.find((person) => person.job === "Director");
  const directorSlug = director
    ? slugify(director.name, { lower: true, strict: true })
    : null;
  const screenplay = credits.crew.find((person) => person.job === "Screenplay");
  const screenplaySlug = screenplay
    ? slugify(screenplay.name, {
        lower: true,
        strict: true,
      })
    : null;

  return (
    <main>
      <div className="relative">
        <div className="container relative z-10 mx-auto flex flex-col gap-8 p-8 text-white md:flex-row md:gap-12 lg:p-16">
          <div className="mx-auto flex max-w-sm items-center overflow-hidden rounded-lg md:mx-0">
            <Image
              priority
              width={300}
              height={450}
              src={posterUrl}
              alt={movie.title}
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 py-0 md:py-20">
            <div>
              <h1 className="mb-2 text-4xl font-bold">
                <span>{movie.title}&nbsp;</span>
                <span className="font-medium text-white text-opacity-50">
                  ({formatDate(releaseDate, { year: "numeric" })})
                </span>
              </h1>
              <div className="flex items-center gap-2">
                <Rating
                  progress={Math.round(movie.vote_average * 10)}
                  className="font-bold"
                  size={16}
                  strokeWidth={4}
                />
                <p className="font-medium text-white text-opacity-50">
                  {formatDate(releaseDate, { dateStyle: "long" })}
                </p>
              </div>
            </div>

            <div>
              {movie.genres.map((genre, i) => (
                <Fragment key={genre.id}>
                  <Link
                    href={`/genres/${genre.id}`}
                    className="inline-block hover:underline"
                  >
                    {genre.name}
                  </Link>
                  {i !== movie.genres.length - 1 && <span>,&nbsp;</span>}
                </Fragment>
              ))}
            </div>

            <h2 className="pt-3 text-xl font-semibold">Overview</h2>

            <p className="max-w-2xl">{movie.overview}</p>

            <div className="mt-8 flex max-w-md flex-col justify-between gap-4 sm:flex-row">
              {director && (
                <p>
                  <Link
                    className="font-semibold underline-offset-4 hover:underline"
                    href={`/person/${director.id}/${directorSlug}`}
                  >
                    {director.name}
                  </Link>
                  <br />
                  <span className="text-sm">Director</span>
                </p>
              )}

              {screenplay && (
                <p>
                  <Link
                    className="font-semibold underline-offset-4 hover:underline"
                    href={`/person/${screenplay.id}/${screenplaySlug}`}
                  >
                    {screenplay.name}
                  </Link>
                  <br />
                  <span className="text-sm">Screenplay</span>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 h-full w-full">
          <Image
            priority
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
            src={backdropUrl}
            alt={movie.title}
          />
          <div
            className="absolute left-0 top-0 h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(31.5, 31.5, 31.5, 1) calc((50vw - 170px) - 340px), rgba(31.5, 31.5, 31.5, 0.84) 50%, rgba(31.5, 31.5, 31.5, 0.84) 100%)",
            }}
          />
        </div>
      </div>

      <div className="container mt-8">
        <h2 className="mb-2 text-2xl font-bold">Top cast</h2>
        <ScrollArea type="auto" className="whitespace-nowrap">
          <div className="flex w-max space-x-4 px-2 pb-4">
            {credits.cast.slice(0, 10).map((actor) => {
              const actorSlug = slugify(actor.name, {
                lower: true,
                strict: true,
              });
              return (
                <div key={actor.id} className="flex flex-col items-center">
                  <Link href={`/person/${actor.id}/${actorSlug}`}>
                    <div className="w-44">
                      <AspectRatio ratio={2 / 3}>
                        <Image
                          src={tmdbPoster(
                            { poster_path: actor.profile_path },
                            "w342",
                          )}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          alt={actor.name}
                          className="rounded-md object-cover"
                        />
                      </AspectRatio>
                    </div>
                  </Link>
                  <p className="mt-1 text-sm font-medium">
                    <Link
                      className="underline-offset-4 hover:underline"
                      href={`/person/${actor.id}/${actorSlug}`}
                    >
                      {actor.name}
                    </Link>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {actor.character}
                  </p>
                </div>
              );
            })}
            <div className="flex flex-col items-center justify-center">
              <Button variant="link" className="group gap-1 font-bold" asChild>
                <Link href={`/movie/${movie.id}/${slug}/cast`}>
                  View all
                  <MoveRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="container mt-8">
        <h2 className="mb-2 text-2xl font-bold">Reviews</h2>
        {reviews.results[0] && <Review review={reviews.results[0]} clamp />}

        <Button asChild variant="secondary" className="mt-4">
          <Link href={`/movie/${movie.id}/${slug}/reviews`}>
            View all review
          </Link>
        </Button>
      </div>

      <div className="container mt-8">
        <h2 className="mb-2 text-2xl font-bold">Recommended</h2>
        <ScrollArea type="auto" className="whitespace-nowrap">
          {recommendations.results.length <= 0 ? (
            <p className="text-sm">
              No recommendations found for this movie. Check back again later.
            </p>
          ) : (
            <div className="flex w-max space-x-4 px-2 pb-4">
              {recommendations.results.slice(0, 10).map((movie, i) => (
                <div key={`recommended-${i}-${movie.id}`} className="w-52">
                  <ListCard item={movie} />
                </div>
              ))}
            </div>
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </main>
  );
};

export default MovieDetailsPage;
