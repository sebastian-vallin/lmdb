import { getTopRated } from "@/lib/api/movie";
import { NextPage } from "next";
import List from "@/components/list";
import { Duration } from "@/lib/utils";

export const revalidate = Duration.minutes(30);

interface Props {}

const MoviePage: NextPage<Props> = async () => {
  const { results, total_pages: totalPages } = await getTopRated();

  return (
    <main className="container mt-8">
      <h1 className="mb-4 text-4xl font-bold">Top Movie</h1>
      <List
        initialItems={results}
        totalPages={totalPages}
        loadFn={async (page) => {
          "use server";
          const { results } = await getTopRated(page);
          return results;
        }}
      />
    </main>
  );
};

export default MoviePage;
