import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTmdbProfile as tmdbProfile } from "@/hooks/useTmdbImage";
import { Review as ReviewType } from "@/lib/api/movie";
import { cn, formatDate } from "@/lib/utils";
import { Star } from "lucide-react";
import React, { FC } from "react";

export interface ReviewProps {
  review: ReviewType;
  clamp?: boolean;
}

const Review: FC<ReviewProps> = ({ review, clamp = false }) => {
  const authorImgUrl = review.author_details.avatar_path
    ? tmdbProfile(review.author_details, "w185")
    : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start space-x-4 space-y-0">
        <Avatar className="h-14 w-14">
          <AvatarImage src={authorImgUrl ?? ""} alt={review.author} />
          <AvatarFallback className="text-lg font-bold">
            {review.author.charAt(0).toUpperCase()}
            {review.author.split(" ")?.[1]?.[0] ?? review.author[1]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col space-y-0.5">
          <CardTitle className="text-xl">Review by {review.author}</CardTitle>
          <CardDescription className="flex items-center space-x-2">
            <Badge className="gap-1" asChild>
              <span>
                <Star className="h-3 w-3 fill-white" />
                {review.author_details.rating?.toFixed(1)}
              </span>
            </Badge>
            <small className="text-xs">
              Written on{" "}
              {formatDate(new Date(review.created_at), {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </small>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className={cn("whitespace-pre-line", clamp && "line-clamp-6")}>
          {review.content}
        </p>
      </CardContent>
    </Card>
  );
};

export default Review;
