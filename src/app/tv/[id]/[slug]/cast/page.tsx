import { BackToTop, BackToTopButton } from "@/components/back-to-top";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useTmdbPoster as tmdbPoster } from "@/hooks/useTmdbImage";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";
import slugify from "slugify";
import TopBar from "../top-bar";
import { AggregatedCast, AggregatedCrew, getCredits } from "@/lib/api/tv-show";

interface Props {
  params: {
    id: string;
    slug: string;
  };
}

const TvCastPage: NextPage<Props> = async ({ params }) => {
  const { aggregate_credits: credits, ...tvShow } = await getCredits(
    params.id,
    true,
  );

  if (!tvShow || !credits) {
    return notFound();
  }

  return (
    <main className="relative">
      <TopBar tvShow={tvShow} />

      <div className="container mt-8 grid grid-cols-1 gap-4 pt-20 sm:grid-cols-2">
        <div className="flex flex-col items-start justify-start gap-4">
          <h2 className="text-2xl font-semibold">
            Cast{" "}
            <span className="text-muted-foreground">{credits.cast.length}</span>
          </h2>
          {credits.cast.map((person, i) => (
            <Person key={`cast-${i}-${person.id}`} person={person} />
          ))}
        </div>

        <div className="flex flex-col items-start justify-start gap-4">
          <h2 className="text-2xl font-semibold">
            Crew{" "}
            <span className="text-muted-foreground">{credits.crew.length}</span>
          </h2>
          {credits.crew.map((person, i) => (
            <Person key={`crew-${i}-${person.id}`} person={person} />
          ))}
        </div>
      </div>

      <BackToTop placement="right">
        <BackToTopButton />
      </BackToTop>
    </main>
  );
};

interface PersonProps {
  person: AggregatedCast | AggregatedCrew;
}

const Person: FC<PersonProps> = ({ person }) => {
  const personSlug = slugify(person.name, { lower: true, strict: true });
  return (
    <div className="flex items-center gap-4">
      <Link href={`/person/${person.id}/${personSlug}`}>
        <div className="w-16">
          <AspectRatio ratio={2 / 3}>
            <Image
              src={tmdbPoster({ poster_path: person.profile_path }, "w342")}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={person.name}
              className="rounded-md object-cover"
            />
          </AspectRatio>
        </div>
      </Link>
      <div className="space-y-0.5">
        <p className="mt-1 font-medium">
          <Link
            className="underline-offset-4 hover:underline"
            href={`/person/${person.id}/${personSlug}`}
          >
            {person.name}
          </Link>
        </p>
        <p className="text-sm text-muted-foreground">
          {"roles" in person
            ? person.roles.map((p) => p.character).join(", ")
            : person.jobs.map((p) => p.job).join(", ")}
        </p>
        <p className="text-sm text-muted-foreground">
          {person.total_episode_count} episode
          {person.total_episode_count > 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default TvCastPage;
