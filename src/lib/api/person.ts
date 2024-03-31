import { u } from "./helpers";

//#region Types

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

export interface MovieCredit {
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

export interface TvCredit {
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
  video: boolean;
  vote_average: number;
  vote_count: number;
  character: string;
  episode_count: number;
  credit_id: string;
  order: number;
  media_type: "tv";
}

export type CreditUnion = MovieCredit | TvCredit;

export interface CombinedCreditsResponse {
  id: number;
  cast: CreditUnion[];
  crew: CreditUnion[];
}

export interface MovieCreditsResponse {
  id: number;
  cast: MovieCredit[];
  crew: MovieCredit[];
}

export interface PersonDetailsAppended extends PersonDetails {
  combined_credits: CombinedCreditsResponse;
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

//#endregion API