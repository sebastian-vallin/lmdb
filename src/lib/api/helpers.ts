export const baseUrl = "https://api.themoviedb.org/3";

export type BaseUrl = typeof baseUrl;

const token = process.env.TMDB_API_KEY;

/**
 * A helper function to create a URL with the token and query parameters that is type safe
 * @param path  The path of the URL
 * @param query The query parameters of the URL
 * @returns The URL with the token and query parameters
 */
export const u = <T extends string, J extends string = "">(
  path: T,
  query: J = "" as J,
): `${BaseUrl}${T}?api_key=${string}&${J}` =>
  `${baseUrl}${path}?api_key=${token}&${query}`;

export const q = <TKey extends string, TValue extends string>(
  key: TKey,
  value: TValue,
) => `${key}=${value}` as const;

export const qAdd = <T extends string[]>(...queryParams: T): T[number] => {
  return queryParams.join("&");
};
