import { u } from "./helpers";
import { PaginationResponse } from "./movie";

//#region Types

export interface PersonKnownFor {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  media_type: "movie" | "tv";
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
  vote_count: number;
}

export interface Person {
  id: number;
  adult: boolean;
  name: string;
  original_name: string;
  popularity: number;
  gender: number;
  known_for_department: string;
  profile_path: string;
  known_for: PersonKnownFor[];
  media_type: "person";
}

export interface PersonDetails {
  id: number;
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}

export interface CastMovieCredit {
  id: number;
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
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
  character: string;
  credit_id: string;
  order: number;
  media_type: "movie";
}

export interface CastTvShowCredit {
  id: number;
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
  character: string;
  episode_count: number;
  credit_id: string;
  order: number;
  media_type: "tv";
}

export interface CrewMovieCredit {
  id: number;
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
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
  character: string;
  credit_id: string;
  order: number;
  media_type: "movie";
}

export interface CrewTvShowCredit {
  id: number;
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
  episode_count: number;
  credit_id: string;
  order: number;
  department: string;
  job: string;
  media_type: "tv";
}

export type CastCreditUnion = CastMovieCredit | CastTvShowCredit;
export type CrewCreditUnion = CrewMovieCredit | CrewTvShowCredit;

export interface CombinedCreditsResponse {
  id: number;
  cast: CastCreditUnion[];
  crew: CrewCreditUnion[];
}

export interface MovieCreditsResponse {
  id: number;
  cast: CastMovieCredit[];
  crew: CrewMovieCredit[];
}

export interface TvShowCreditsResponse {
  id: number;
  cast: CastTvShowCredit[];
  crew: CrewTvShowCredit[];
}

export interface PersonDetailsAppended extends PersonDetails {
  combined_credits: CombinedCreditsResponse;
}

export interface PopularPersonResponse extends PaginationResponse {
  results: Person[];
}

//#endregion Types

//#region API

export const getById = async (id: string | number) => {
  const url = u(`/person/${id}`);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response, await response.text());
    return null;
  }

  const data: PersonDetails = await response.json();
  return data;
};

export const combinedCredit = async (id: string | number) => {
  const url = u(`/person/${id}/combined_credits`);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response, await response.text());
    return {
      id: 0,
      cast: [],
      crew: [],
    };
  }

  const data: CombinedCreditsResponse = await response.json();
  return data;
};

export const movieCredit = async (id: string | number) => {
  const url = u(`/person/${id}/movie_credits`);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response, await response.text());
    return {
      id: 0,
      cast: [],
      crew: [],
    };
  }

  const data: MovieCreditsResponse = await response.json();
  return data;
};

export const getDetails = async (id: string | number) => {
  const url = u(`/person/${id}`, "append_to_response=combined_credits");
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response, await response.text());
    return null;
  }

  const data: PersonDetailsAppended = await response.json();
  return data;
};

export async function getPopular(page?: string | number) {
  const url = u(`/person/popular`, page ? `page=${page}` : "");
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response, await response.text());
    throw new Error("Failed to fetch top rated tv shows");
  }

  const data: PopularPersonResponse = await response.json();
  data.results = data.results.map((r) => ({ ...r, media_type: "person" }));
  return data;
}

//#endregion API
