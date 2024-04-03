import { getPopular, getTopRated } from "@/lib/api/movie";
import { NextPage } from "next";
import MovieList from "@/components/movie-list";

interface Props {}

const MoviePage: NextPage<Props> = async () => {
  const { results, total_pages: totalPages } = await getTopRated();

  return (
    <main className="container mt-8">
      <h1 className="mb-4 text-4xl font-bold">Top Movie</h1>
      <MovieList
        initialMovies={results}
        totalPages={totalPages}
        loadFn={async (page) => {
          "use server";
          const { results } = await getPopular(page);
          return results;
        }}
      />
    </main>
  );
};

export default MoviePage;
