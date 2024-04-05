import { NextPage } from "next";
import List from "@/components/list";
import { getPopular } from "@/lib/api/person";

interface Props {}

const TopRatedTvShowPage: NextPage<Props> = async () => {
  const { results, total_pages: totalPages } = await getPopular();

  return (
    <main className="container mt-8">
      <h1 className="mb-4 text-4xl font-bold">Popular People</h1>
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

export default TopRatedTvShowPage;
