import MovieCard from "@/components/movie-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTmdbPoster as tmdbPoster } from "@/hooks/useTmdbImage";
import {
  CastCreditUnion,
  CrewCreditUnion,
  PersonDetails,
  getDetails,
} from "@/lib/api/person";
import { cn, formatDate, getGender } from "@/lib/utils";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";
import slugify from "slugify";

interface Props {
  params: {
    id: string;
    slug: string;
  };
}

const genreExcludes = [10767, 10763];

const PersonDetailsPage: NextPage<Props> = async ({ params }) => {
  const { combined_credits: credits, ...person } =
    (await getDetails(params.id)) ?? notFound();

  const knownFor = (
    person.known_for_department === "Acting" ? credits.cast : credits.crew
  )
    .filter((movie, i, arr) => {
      if (arr.findIndex((m) => m.id === movie.id) !== i) {
        return false;
      }

      if ("character" in movie && movie.character === "Self") {
        return false;
      }

      if (
        !movie.genre_ids.length ||
        movie.genre_ids.some((genreId) => genreExcludes.includes(genreId))
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const langA = a.original_language === "en" ? 1 : 0;
      const langB = b.original_language === "en" ? 1 : 0;
      const langDiff = langB - langA;
      if (langDiff !== 0) {
        return langDiff;
      }

      return b.popularity - a.popularity;
    });

  const cast = credits.cast
    .filter((movie, i, arr) => arr.findIndex((m) => m.id === movie.id) === i)
    .sort((a, b) => {
      const dateStrA = "title" in a ? a.release_date : a.first_air_date;
      const dateStrB = "title" in b ? b.release_date : b.first_air_date;

      if (!dateStrA || !dateStrB) {
        return dateStrA ? 1 : -1;
      }

      const dateA = new Date(dateStrA);
      const dateB = new Date(dateStrB);

      return dateB.getTime() - dateA.getTime();
    });

  const crew = credits.crew
    .filter((movie, i, arr) => arr.findIndex((m) => m.id === movie.id) === i)
    .sort((a, b) => {
      const dateStrA = "title" in a ? a.release_date : a.first_air_date;
      const dateStrB = "title" in b ? b.release_date : b.first_air_date;

      if (!dateStrA || !dateStrB) {
        return dateStrA ? 1 : -1;
      }

      const dateA = new Date(dateStrA);
      const dateB = new Date(dateStrB);

      return dateB.getTime() - dateA.getTime();
    });

  const imageUrl = tmdbPoster({ poster_path: person.profile_path }, "w780");

  return (
    <main className="container mt-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <div>
          <div className="mx-auto w-64">
            <AspectRatio ratio={2 / 3}>
              <Image
                priority
                src={imageUrl}
                alt={person.name}
                fill
                className="m-auto rounded-lg object-cover"
              />
            </AspectRatio>
          </div>

          <div className="mt-2 block md:hidden">
            <Sheet>
              <div className="mx-auto max-w-64">
                <SheetTrigger asChild>
                  <Button variant="secondary" className="w-full font-semibold">
                    Personal Info
                  </Button>
                </SheetTrigger>
              </div>
              <SheetContent>
                <PersonalInfo person={person} />
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:block">
            <PersonalInfo person={person} />
          </div>
        </div>

        <div>
          <h1 className="pb-3 text-4xl font-bold">{person.name}</h1>
          <h2 className="pb-2 text-xl font-bold">Biography</h2>
          <p className="whitespace-pre-line">{person.biography}</p>
        </div>
      </div>

      <div className="mt-12 space-y-8">
        {/* Known for */}
        <div>
          <h2 className="mb-2 text-2xl font-bold">Known for</h2>
          <ScrollArea type="auto" className="whitespace-nowrap">
            {knownFor.length <= 0 ? (
              <p className="text-sm">
                {person.name} has not been credited in any movies.
              </p>
            ) : (
              <div className="flex w-max space-x-4 px-2 pb-4">
                {knownFor.slice(0, 10).map((credit, i) => (
                  <div key={`recommended-${i}-${credit.id}`} className="w-52">
                    <MovieCard movie={credit} />
                  </div>
                ))}
              </div>
            )}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Credits */}
        <div>
          <h2 className="mb-2 text-2xl font-bold">Credits</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="acting">
              <AccordionTrigger>Acting</AccordionTrigger>
              <AccordionContent className="space-y-4 divide-y">
                {cast.map((credit, i) => (
                  <Credit
                    key={`credit-${i}-${credit.credit_id}`}
                    credit={credit}
                    className={i > 0 ? "pt-4" : undefined}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="crew">
              <AccordionTrigger>Crew</AccordionTrigger>
              <AccordionContent className="space-y-4 divide-y">
                {crew.map((credit, i) => (
                  <Credit
                    key={`credit-${i}-${credit.credit_id}`}
                    credit={credit}
                    className={i > 0 ? "pt-4" : undefined}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </main>
  );
};

interface CreditProps {
  credit: CastCreditUnion | CrewCreditUnion;
  className?: string;
}

const Credit: FC<CreditProps> = ({ credit, className }) => {
  const title = "title" in credit ? credit.title : credit.name;
  const dateStr =
    "release_date" in credit ? credit.release_date : credit.first_air_date;
  const date = new Date(
    "release_date" in credit ? credit.release_date : credit.first_air_date,
  );
  const ratingPercent = Math.round(credit.vote_average * 10);
  const slug = slugify("title" in credit ? credit.title : credit.name, {
    lower: true,
    strict: true,
  });
  const href =
    "title" in credit
      ? `/movie/${credit.id}/${slug}`
      : `/tv/${credit.id}/${slug}`;

  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="flex flex-1 space-x-2">
        <div>
          <Link href={href}>
            <div className="w-12 md:w-14">
              <AspectRatio ratio={2 / 3}>
                <Image
                  src={tmdbPoster(credit, "w185")}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 10vw"
                  className="rounded-md object-cover"
                />
              </AspectRatio>
            </div>
          </Link>
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold md:text-lg">
            <Link className="underline-offset-4 hover:underline" href={href}>
              {title}
            </Link>
          </h3>
          <p className="mb-2 font-medium text-muted-foreground">
            {"character" in credit ? `as ${credit.character}` : credit.job}
          </p>
          <p
            className={cn(
              "text-sm font-semibold text-red-600 dark:text-red-400",
              ratingPercent > 50 && "text-yellow-600 dark:text-yellow-400",
              ratingPercent > 70 && "text-green-600 dark:text-green-400",
            )}
          >
            {ratingPercent}%
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center space-y-2 text-sm font-medium">
        {dateStr ? (
          <p>
            {formatDate(date, {
              year: "numeric",
            })}
          </p>
        ) : (
          <p>&mdash;</p>
        )}
        {"episode_count" in credit && (
          <p className="text-xs">
            {credit.episode_count} episode
            {credit.episode_count === 1 ? "" : "s"}
          </p>
        )}
      </div>
    </div>
  );
};

interface PersonalInfoProps {
  person: PersonDetails;
}

const PersonalInfo: FC<PersonalInfoProps> = ({ person }) => {
  const birthday = person.birthday ? new Date(person.birthday) : null;
  const age = birthday ? getAge(birthday) : null;

  return (
    <>
      <h2 className="mb-2 mt-6 text-lg font-semibold">Personal Info</h2>
      <dl className="space-y-4 text-sm">
        <div className="flex flex-col justify-between gap-x-2 md:flex-row">
          <dt className="font-bold">Known For</dt>
          <dd className="font-medium md:text-end">
            {person.known_for_department}
          </dd>
        </div>
        <div className="flex flex-col justify-between gap-x-2 md:flex-row">
          <dt className="font-bold">Gender</dt>
          <dd className="font-medium md:text-end">
            {getGender(person.gender)}
          </dd>
        </div>
        <div className="flex flex-col justify-between gap-x-2 md:flex-row">
          <dt className="font-bold">Birthday</dt>
          <dd className="font-medium md:text-end">
            {birthday ? (
              formatDate(birthday, { dateStyle: "medium" })
            ) : (
              <>&mdash;</>
            )}
          </dd>
        </div>
        <div className="flex flex-col justify-between gap-x-2 md:flex-row">
          <dt className="font-bold">Age</dt>
          <dd className="font-medium md:text-end">
            {birthday ? <>{age} years old</> : <>&mdash;</>}
          </dd>
        </div>
        <div className="flex flex-col justify-between gap-x-2 md:flex-row">
          <dt className="font-bold">Place of Birth</dt>
          <dd className="font-medium md:text-end">
            {person.place_of_birth ?? <>&mdash;</>}
          </dd>
        </div>
      </dl>
    </>
  );
};

const getAge = (date: Date) => {
  const now = new Date();
  const age = now.getFullYear() - date.getFullYear();
  if (
    now.getMonth() < date.getMonth() ||
    (now.getMonth() === date.getMonth() && now.getDate() < date.getDate())
  ) {
    return age - 1;
  }

  return age;
};

export default PersonDetailsPage;
