import { AuthorDetails } from "@/lib/api/movie";

export type TmdbImageSize =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "original";

function useTmdbPoster<TSize extends TmdbImageSize = "w500">(
  movie: { poster_path: string },
  size: TSize = "w500" as TSize,
) {
  if (!movie.poster_path) {
    return "/placeholder.svg" as const;
  }

  return `https://image.tmdb.org/t/p/${size}/${movie.poster_path}` as const;
}

function useTmdbBackdrop<TSize extends TmdbImageSize = "w500">(
  movie: { backdrop_path: string },
  size: TSize = "w500" as TSize,
) {
  if (!movie.backdrop_path) {
    return "/placeholder.svg" as const;
  }

  return `https://image.tmdb.org/t/p/${size}/${movie.backdrop_path}` as const;
}

function useTmdbProfile<TSize extends TmdbImageSize = "w500">(
  authorDetails: AuthorDetails,
  size: TSize = "w500" as TSize,
) {
  if (!authorDetails.avatar_path) {
    return "/placeholder.svg" as const;
  }

  return `https://image.tmdb.org/t/p/${size}/${authorDetails.avatar_path}` as const;
}

export { useTmdbPoster, useTmdbBackdrop, useTmdbProfile };
