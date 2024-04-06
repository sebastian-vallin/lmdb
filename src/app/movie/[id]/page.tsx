import { Duration } from "@/lib/utils";
import MovieDetailsPage from "./[slug]/page";

export const revalidate = Duration.minutes(30);

export default MovieDetailsPage;
