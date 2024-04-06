import { getAiringToday } from "@/lib/api/tv-show";
import { NextPage } from "next";
import List from "@/components/list";
import { Duration } from "@/lib/utils";

export const revalidate = Duration.minutes(30);

interface Props {}

const TopRatedTvShowPage: NextPage<Props> = async () => {
  const { results, total_pages: totalPages } = await getAiringToday();

  return (
    <main className="container mt-8">
      <h1 className="mb-4 text-4xl font-bold">TV Shows Airing Today</h1>
      <List
        initialItems={results}
        totalPages={totalPages}
        loadFn={async (page) => {
          "use server";
          const { results } = await getAiringToday(page);
          return results;
        }}
      />
    </main>
  );
};

export default TopRatedTvShowPage;
