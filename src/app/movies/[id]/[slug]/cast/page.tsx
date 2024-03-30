import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useTmdbPoster as tmdbPoster } from "@/hooks/useTmdbImage";
import { Cast, Crew, credits, getById } from "@/lib/api/movie";
import { MoveLeft } from "lucide-react";
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

const MovieCastPage: NextPage<Props> = async ({ params }) => {
  const [movie, credit] = await Promise.all([
    getById(params.id),
    credits(params.id),
  ]);

  if (!movie || !credit) {
    return notFound();
  }

  const movieUrl = `/movies/${params.id}/${params.slug}`;
  const posterUrl = tmdbPoster(movie, "w154");

  return (
    <main>
      <div className="bg-primary/25 py-4">
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
              {movie.title} ({new Date(movie.release_date).getFullYear()})
            </h1>
            <Link
              className="group inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline sm:text-base"
              href={movieUrl}
            >
              <MoveLeft className="inline-block h-4 w-4 transition-transform group-hover:-translate-x-0.5 sm:h-5 sm:w-5" />
              Back to movie
            </Link>
          </div>
        </div>
      </div>

      <div className="container mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col items-start justify-start gap-4">
          <h2 className="text-2xl font-semibold">
            Cast{" "}
            <span className="text-muted-foreground">{credit.cast.length}</span>
          </h2>
          {credit.cast.map((person) => (
            <Person key={person.id} person={person} />
          ))}
        </div>

        <div className="flex flex-col items-start justify-start gap-4">
          <h2 className="text-2xl font-semibold">
            Crew{" "}
            <span className="text-muted-foreground">{credit.crew.length}</span>
          </h2>
          {credit.crew.map((person) => (
            <Person key={person.id} person={person} />
          ))}
        </div>
      </div>
    </main>
  );
};

interface PersonProps {
  person: Cast | Crew;
}

const Person: FC<PersonProps> = ({ person }) => {
  const personSlug = slugify(person.name, { lower: true, strict: true });
  return (
    <div key={person.id} className="flex items-center gap-4">
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
      <div className="space-y-1">
        <p className="mt-1 font-medium">
          <Link
            className="underline-offset-4 hover:underline"
            href={`/person/${person.id}/${personSlug}`}
          >
            {person.name}
          </Link>
        </p>
        <p className="text-sm text-muted-foreground">
          {"character" in person ? person.character : person.job}
        </p>
      </div>
    </div>
  );
};

export default MovieCastPage;
