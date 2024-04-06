import ListCard from "@/components/list-card";
import { Rating } from "@/components/rating";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  useTmdbBackdrop as tmdbBackdrop,
  useTmdbPoster as tmdbPoster,
} from "@/hooks/useTmdbImage";
import { getDetails } from "@/lib/api/tv-show";
import { Duration, formatDate } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { RedirectType, notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import slugify from "slugify";
import Review from "@/app/movie/[id]/[slug]/review";

export const revalidate = Duration.minutes(30);

interface Props {
  params: {
    id: string;
    slug?: string;
  };
}

const TvShowDetailsPage: NextPage<Props> = async ({ params }) => {
  const {
    aggregate_credits: credits,
    recommendations,
    reviews,
    ...tvShow
  } = (await getDetails(params.id)) ?? notFound();

  const slug = slugify(tvShow.name, { lower: true, strict: true });

  if (!params.slug) {
    redirect(`/movie/${params.id}/${slug}`, RedirectType.replace);
  }

  const posterUrl = tmdbPoster(tvShow, "w500");
  const backdropUrl = tmdbBackdrop(tvShow, "w780");
  const releaseDate = new Date(tvShow.first_air_date);

  const creator = tvShow.created_by[0];
  const creatorSlug = creator
    ? slugify(creator.name, { lower: true, strict: true })
    : null;

  const creator2 = tvShow.created_by[1];
  const creatorSlug2 = creator2
    ? slugify(creator2.name, { lower: true, strict: true })
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
              alt={tvShow.name}
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 py-0 md:py-20">
            <div>
              <h1 className="mb-2 text-4xl font-bold">
                <span>{tvShow.name}&nbsp;</span>
                <span className="font-medium text-white text-opacity-50">
                  ({formatDate(releaseDate, { year: "numeric" })})
                </span>
              </h1>
              <div className="flex items-center gap-2">
                <Rating
                  progress={Math.round(tvShow.vote_average * 10)}
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
              {tvShow.genres.map((genre, i) => (
                <Fragment key={genre.id}>
                  <Link
                    href={`/genres/${genre.id}`}
                    className="inline-block hover:underline"
                  >
                    {genre.name}
                  </Link>
                  {i !== tvShow.genres.length - 1 && <span>,&nbsp;</span>}
                </Fragment>
              ))}
            </div>

            <h2 className="pt-3 text-xl font-semibold">Overview</h2>

            <p className="max-w-2xl">{tvShow.overview}</p>

            <div className="mt-8 flex max-w-md flex-col justify-between gap-4 sm:flex-row">
              {creator && (
                <p>
                  <Link
                    className="font-semibold underline-offset-4 hover:underline"
                    href={`/person/${creator.id}/${creatorSlug}`}
                  >
                    {creator.name}
                  </Link>
                  <br />
                  <span className="text-sm">Creator</span>
                </p>
              )}

              {creator2 && (
                <p>
                  <Link
                    className="font-semibold underline-offset-4 hover:underline"
                    href={`/person/${creator2.id}/${creatorSlug2}`}
                  >
                    {creator2.name}
                  </Link>
                  <br />
                  <span className="text-sm">Creator</span>
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
            alt={tvShow.name}
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
                    {actor.roles.map((role) => role.character).join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {actor.total_episode_count} episode
                    {actor.total_episode_count > 1 ? "s" : ""}
                  </p>
                </div>
              );
            })}
            <div className="flex flex-col items-center justify-center">
              <Button variant="link" className="group gap-1 font-bold" asChild>
                <Link href={`/tv/${tvShow.id}/${slug}/cast`}>
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

        <Button variant="secondary" className="mt-4" asChild>
          <Link href={`/tv/${tvShow.id}/${slug}/reviews`}>View all review</Link>
        </Button>
      </div>

      <div className="container mt-8">
        <h2 className="mb-2 text-2xl font-bold">Recommended</h2>
        <ScrollArea type="auto" className="whitespace-nowrap">
          {recommendations.results.length <= 0 ? (
            <p className="text-sm">
              No recommendations found for this show. Check back again later.
            </p>
          ) : (
            <div className="flex w-max space-x-4 px-2 pb-4">
              {recommendations.results.slice(0, 10).map((tvShow, i) => (
                <div
                  key={`recommended-${i}-${tvShow.id}`}
                  className="w-52 rounded-lg bg-secondary"
                >
                  <ListCard item={tvShow} />
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

export default TvShowDetailsPage;
