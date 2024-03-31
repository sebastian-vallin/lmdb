import { NextPage } from "next";
import SearchForm from "./form";
import {
  MultiSearchResultUnion,
  movieSearch,
  multiSearch,
  personSearch,
  tvSearch,
} from "@/lib/api/search";
import SearchList from "./search-list";

interface Props {
  searchParams: {
    q?: string | string[];
    page?: string | string[];
    mediaType?: string | string[];
  };
}

const SearchPage: NextPage<Props> = async ({
  searchParams: { q, page, mediaType },
}) => {
  const currentPage = parseInt(Array.isArray(page) ? page[0] : page ?? "1");
  const query = Array.isArray(q) ? q[0] : q;
  const media = Array.isArray(mediaType) ? mediaType[0] : mediaType;

  const initialResults = await multiSearch(query, currentPage);
  const firstResultType = initialResults.results[0]?.media_type ?? "movie";

  let results: MultiSearchResultUnion[] = [];
  switch (media ?? firstResultType) {
    case "movie": {
      const movies = await movieSearch(query, currentPage);
      results = movies.results.map((movie) => ({
        ...movie,
        media_type: "movie",
      }));
      break;
    }
    case "tv": {
      const tvShows = await tvSearch(query, currentPage);
      results = tvShows.results.map((tvShow) => ({
        ...tvShow,
        media_type: "tv",
      }));
      break;
    }
    case "person": {
      const people = await personSearch(query, currentPage);
      results = people.results.map((person) => ({
        ...person,
        media_type: "person",
      }));
      break;
    }
  }

  return (
    <main className="container mt-8 space-y-4">
      <h1 className="text-4xl font-bold">Search</h1>
      <SearchForm defaultQuery={query} />
      <SearchList
        query={query ?? ""}
        results={results}
        resultType={
          (media as typeof firstResultType | undefined) ?? firstResultType
        }
      />
    </main>
  );
};

export default SearchPage;
