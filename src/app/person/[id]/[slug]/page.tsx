import MovieCard from "@/components/movie-card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  useTmdbProfile as tmdbProfile,
  useTmdbPoster as tmdbPoster,
} from "@/hooks/useTmdbImage";
import { getDetails } from "@/lib/api/person";
import { NextPage } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

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
    .filter((movie) => {
      if (movie.character === "Self") {
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

  const imageUrl = tmdbPoster({ poster_path: person.profile_path }, "w780");

  return (
    <main className="container mt-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <div>
          <div className="mx-auto w-64">
            <AspectRatio ratio={2 / 3}>
              <Image
                src={imageUrl}
                alt={person.name}
                fill
                className="m-auto rounded-lg object-cover"
              />
            </AspectRatio>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold">{person.name}</h1>

          <h2 className="pt-2 text-xl font-bold">Biography</h2>
          <p className="whitespace-pre-line">{person.biography}</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-2 text-2xl font-bold">Known for</h2>
        <ScrollArea type="auto" className="whitespace-nowrap">
          {knownFor.length <= 0 ? (
            <p className="text-sm">
              {person.name} has not been credited in any movies.
            </p>
          ) : (
            <div className="flex w-max space-x-4 px-2 pb-4">
              {knownFor.slice(0, 10).map((movie, i) => (
                <div key={`recommended-${i}-${movie.id}`} className="w-52">
                  <MovieCard movie={movie} />
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

export default PersonDetailsPage;
