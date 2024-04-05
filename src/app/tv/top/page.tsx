import { getTopRated } from "@/lib/api/tv-show";
import { NextPage } from "next";
import List from "@/components/list";

interface Props {}

const TopRatedTvShowPage: NextPage<Props> = async () => {
  const { results, total_pages: totalPages } = await getTopRated();

  return (
    <main className="container mt-8">
      <h1 className="mb-4 text-4xl font-bold">Top TV Shows</h1>
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

export default TopRatedTvShowPage;
