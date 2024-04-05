import { getPopular } from "@/lib/api/movie";
import { NextPage } from "next";
import List from "@/components/list";

interface Props {
  searchParams: Record<string, string[] | string>;
}

const MoviePage: NextPage<Props> = async ({ searchParams }) => {
  const { page } = searchParams;
  const { results, total_pages: totalPages } = await getPopular(
    Array.isArray(page) ? page[0] : page,
  );

  return (
    <main className="container mt-8">
      <h1 className="mb-4 text-4xl font-bold">Popular Movies</h1>
      <List
        initialItems={results}
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
