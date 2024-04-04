import { u } from "./helpers";
import { PaginationResponse, Review, ReviewsResponse } from "./movie";
import { TvShowCreditsResponse } from "./person";

export type TvShowId = number | string;

export interface TvShow {
  adult: boolean;
  backdrop_path: string;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
  media_type: "tv";
}

export interface Creator {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
}

export interface Network {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface Season {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TvShowDetails {
  adult: boolean;
  backdrop_path: string;
  created_by: Creator[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: Episode;
  name: string;
  next_episode_to_air: null | Episode;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

export interface Role {
  credit_id: string;
  character: string;
  episode_count: number;
}

export interface AggregatedCast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  roles: Role[];
  total_episode_count: number;
  order: number;
}

export interface Job {
  credit_id: string;
  job: string;
  episode_count: number;
}

export interface AggregatedCrew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  jobs: Job[];
  department: string;
  total_episode_count: number;
}

export interface AggregatedCreditsResponse {
  id: number;
  cast: AggregatedCast[];
  crew: AggregatedCrew[];
}

export interface TvShowDetailsAppended extends TvShowDetails {
  aggregate_credits: {
    cast: AggregatedCast[];
    crew: AggregatedCrew[];
  };
  reviews: PaginationResponse & {
    results: Review[];
  };
  recommendations: PaginationResponse & {
    results: TvShow[];
  };
}

export interface CastDetailsResponse extends TvShowDetails {
  aggregate_credits: {
    cast: AggregatedCast[];
    crew: AggregatedCrew[];
  };
}

export interface ReviewsDetailsResponse extends TvShowDetails {
  reviews: ReviewsResponse;
}

export const getDetails = async (id: TvShowId) => {
  const url = u(
    `/tv/${id}`,
    "append_to_response=aggregate_credits,recommendations,reviews",
  );
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response, await response.text());
    return null;
  }

  const data: TvShowDetailsAppended = await response.json();
  return data;
};

export async function getCredits(
  id: TvShowId,
  includeDetails: true,
): Promise<CastDetailsResponse>;
export async function getCredits(
  id: TvShowId,
  includeDetails?: false | undefined,
): Promise<AggregatedCreditsResponse>;
export async function getCredits(
  id: TvShowId,
  includeDetails: boolean = false,
) {
  if (includeDetails) {
    const url = u(`/tv/${id}`, "append_to_response=aggregate_credits");
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(response, await response.text());
      return null;
    }

    const data: CastDetailsResponse = await response.json();
    return data;
  }

  const url = u(`/tv/${id}/aggregate_credits`);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response, await response.text());
    return null;
  }

  const data: AggregatedCreditsResponse = await response.json();
  return data;
}

export async function getReviews(
  id: TvShowId,
  includeDetails: true,
): Promise<ReviewsDetailsResponse>;
export async function getReviews(
  id: TvShowId,
  includeDetails?: false | undefined,
): Promise<ReviewsResponse>;
export async function getReviews(
  id: TvShowId,
  includeDetails: boolean = false,
) {
  if (includeDetails) {
    const url = u(`/tv/${id}`, "append_to_response=reviews");
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(response, await response.text());
      return null;
    }

    const data: ReviewsDetailsResponse = await response.json();
    return data;
  }

  const url = u(`/tv/${id}/reviews`);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response, await response.text());
    return null;
  }

  const data: ReviewsResponse = await response.json();
  return data;
}
