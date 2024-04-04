import { BackToTop, BackToTopButton } from "@/components/back-to-top";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import TopBar from "../top-bar";
import Review from "@/app/movies/[id]/[slug]/review";
import { getReviews } from "@/lib/api/tv-show";

interface Props {
  params: {
    id: string;
    slug: string;
  };
}

const TvShowReviewPage: NextPage<Props> = async ({ params }) => {
  const { reviews, ...tvShow } = await getReviews(params.id, true);

  if (!tvShow || !reviews) {
    return notFound();
  }

  return (
    <main className="relative">
      <TopBar tvShow={tvShow} />

      <div className="container space-y-4 pt-32">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <div className="space-y-8">
          {reviews.results.map((review, i) => (
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

export default TvShowReviewPage;
