"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const MovieDetailsError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="container flex flex-col items-center justify-center gap-4 pt-24">
      <h1 className="text-2xl font-bold">Something went wrong!</h1>
      <Button
        size="lg"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </main>
  );
};

export default MovieDetailsError;
