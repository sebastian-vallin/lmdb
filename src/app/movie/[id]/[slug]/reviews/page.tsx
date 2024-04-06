import { BackToTop, BackToTopButton } from "@/components/back-to-top";
import { getById, reviews } from "@/lib/api/movie";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import TopBar from "../top-bar";
import Review from "../review";
import { Duration } from "@/lib/utils";

export const revalidate = Duration.minutes(5);

interface Props {
  params: {
    id: string;
    slug: string;
  };
}

const MovieReviewPage: NextPage<Props> = async ({ params }) => {
  const [movie, review] = await Promise.all([
    getById(params.id),
    reviews(params.id),
  ]);

  if (!movie || !reviews) {
    return notFound();
  }

  return (
    <main className="relative">
      <TopBar movie={movie} />

      <div className="container space-y-4 pt-32">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <div className="space-y-8">
          {review.results.map((review, i) => (
            <Review key={`review-${i}-${review.id}`} review={review} />
          ))}
        </div>
      </div>

      <BackToTop placement="right">
        <BackToTopButton />
      </BackToTop>
    </main>
  );
};

export default MovieReviewPage;
