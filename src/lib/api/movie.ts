"use server";

import { u } from "./helpers";

export interface PaginationResponse {
  page: number;
  total_results: number;
  total_pages: number;
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface PopularMoviesResponse extends PaginationResponse {
  results: Movie[];
}

export interface TrendingMoviesResponse extends PopularMoviesResponse {}

export interface SearchMoviesResponse extends PopularMoviesResponse {}

export interface RecommendationsResponse extends PopularMoviesResponse {}

export interface Cast {
  id: number;
  adult: boolean;
  gender: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface Crew {
  id: number;
  adult: boolean;
  gender: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
  department: string;
  job: string;
}

export interface MovieCreditsResponse {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  } | null;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export const getPopular = async (page?: string | number | undefined) => {
  const url = u("/movie/popular", page ? `page=${page}` : undefined);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.log(response, await response.text());
    return {
      page: 1,
      total_pages: 1,
      total_results: 0,
      results: [],
    } satisfies PopularMoviesResponse;
  }

  const data: PopularMoviesResponse = await response.json();
  return data;
};

export const getTrending = async (
  timeWindow: "day" | "week",
  page?: string | number | undefined,
) => {
  const url = u(`/trending/movie/${timeWindow}`, page ? `page=${page}` : "");
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response, await response.text());
    throw new Error("Failed to fetch trending movies");
  }

  const data: TrendingMoviesResponse = await response.json();
  return data;
};

export const getById = async (id: string | number) => {
  const url = u(`/movie/${id}`);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response, await response.text());
    return null;
  }

  const data: MovieDetails = await response.json();
  return data;
};

export const search = async (
  query?: string,
  page?: string | number | undefined,
) => {
  if (!query) {
    return {
      page: 1,
      total_pages: 1,
      total_results: 0,
      results: [],
    } satisfies SearchMoviesResponse;
  }

  const url = u(
    `/search/movie`,
    `query=${query}&${page ? "page=" + page : ""}`,
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
    } satisfies SearchMoviesResponse;
  }

  const data: SearchMoviesResponse = await response.json();
  return data;
};

export const credits = async (id: string | number) => {
  const url = u(`/movie/${id}/credits`);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response, await response.text());
    return null;
  }

  const data: MovieCreditsResponse = await response.json();
  return data;
};

export const recommendations = async (id: string | number) => {
  const url = u(`/movie/${id}/recommendations`);
  const response = await fetch(url, {
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
    };
  }

  const data: RecommendationsResponse = await response.json();
  return data;
};
