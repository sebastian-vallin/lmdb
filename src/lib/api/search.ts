import { u } from "./helpers";
import { Movie, PaginationResponse } from "./movie";
import { Person } from "./person";
import { TvShow } from "./tv-show";

export type MultiSearchResultUnion = Person | Movie | TvShow;

export interface MultiSearchResponse extends PaginationResponse {
  results: (Person | Movie | TvShow)[];
}

export interface MovieSearchResponse extends PaginationResponse {
  results: Movie[];
}

export interface TvSearchResponse extends PaginationResponse {
  results: TvShow[];
}

export interface PersonSearchResponse extends PaginationResponse {
  results: Person[];
}

export const multiSearch = async (
  query?: string,
  page?: string | number | undefined,
) => {
  if (!query) {
    return {
      page: 1,
      total_pages: 1,
      total_results: 0,
      results: [],
    } satisfies MultiSearchResponse;
  }

  const url = u(
    `/search/multi`,
    `query=${query}&${page ? "page=" + page : ""}&`,
  );

  const response = await fetch(encodeURI(url), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response, await response.text());
    return {
      page: 1,
      total_pages: 1,
      total_results: 0,
      results: [],
    } satisfies MultiSearchResponse;
  }

  const data: MultiSearchResponse = await response.json();
  return data;
};

export const movieSearch = async (
  query?: string,
  page?: string | number | undefined,
) => {
  if (!query) {
    return {
      page: 1,
      total_pages: 1,
      total_results: 0,
      results: [],
    } satisfies MovieSearchResponse;
  }

  const url = u(
    `/search/movie`,
    `query=${query}&${page ? "page=" + page : ""}&`,
  );

  const response = await fetch(encodeURI(url), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response, await response.text());
    return {
      page: 1,
      total_pages: 1,
      total_results: 0,
      results: [],
    } satisfies MovieSearchResponse;
  }

  const data: MovieSearchResponse = await response.json();
  return data;
};

export const tvSearch = async (
  query?: string,
  page?: string | number | undefined,
) => {
  if (!query) {
    return {
      page: 1,
      total_pages: 1,
      total_results: 0,
      results: [],
    } satisfies TvSearchResponse;
  }

  const url = u(`/search/tv`, `query=${query}&${page ? "page=" + page : ""}&`);

  const response = await fetch(encodeURI(url), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response, await response.text());
    return {
      page: 1,
      total_pages: 1,
      total_results: 0,
      results: [],
    } satisfies TvSearchResponse;
  }

  const data: TvSearchResponse = await response.json();
  return data;
};

export const personSearch = async (
  query?: string,
  page?: string | number | undefined,
) => {
  if (!query) {
    return {
      page: 1,
      total_pages: 1,
      total_results: 0,
      results: [],
    } satisfies PersonSearchResponse;
  }

  const url = u(
    `/search/person`,
    `query=${query}&${page ? "page=" + page : ""}&`,
  );

  const response = await fetch(encodeURI(url), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response, await response.text());
    return {
      page: 1,
      total_pages: 1,
      total_results: 0,
      results: [],
    } satisfies PersonSearchResponse;
  }

  const data: PersonSearchResponse = await response.json();
  return data;
};
