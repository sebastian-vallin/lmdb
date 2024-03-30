import { NextPage } from "next";
import SearchForm from "./form";
import { search } from "@/lib/api/movie";
import MovieList from "../../components/movie-list";

interface Props {
  searchParams: {
    q?: string | string[];
    page?: string | string[];
  };
}

const SearchPage: NextPage<Props> = async ({ searchParams: { q, page } }) => {
  const currentPage = parseInt(Array.isArray(page) ? page[0] : page ?? "1");
  const query = Array.isArray(q) ? q[0] : q;
  const movies = await search(query, currentPage);

  return (
    <main className="container mt-8 space-y-4">
      <h1 className="text-4xl font-bold">Search</h1>
      <SearchForm defaultQuery={query} />

      <MovieList
        initialMovies={movies.results}
        totalPages={movies.total_pages}
        loadFn={async (page) => {
          "use server";
          const results = await search(query, page);
          return results.results;
        }}
      />
    </main>
  );
};

export default SearchPage;
