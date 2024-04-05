import { getPopular } from "@/lib/api/tv-show";
import { NextPage } from "next";
import MovieList from "@/components/movie-list";

interface Props {}

const TopRatedTvShowPage: NextPage<Props> = async () => {
  const { results, total_pages: totalPages } = await getPopular();

  return (
    <main className="container mt-8">
      <h1 className="mb-4 text-4xl font-bold">Popular TV Shows</h1>
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

export default TopRatedTvShowPage;
