/* eslint-disable react/prop-types */

import React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export interface RatingProps
  extends React.ForwardRefExoticComponent<
    React.ComponentProps<"div"> & {
      progress: number;
      size?: number;
      strokeWidth?: number;
      fontSize?: number;
    }
  > {}

const Rating = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<RatingProps>
>(
  (
    {
      progress,
      size = 20,
      strokeWidth = 5,
      fontSize = 13,
      className,
      ...props
    },
    ref,
  ) => {
    const circumference = ((2 * 22) / 7) * size;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              ref={ref}
              className={cn(
                "pointer-events-auto flex w-max items-center justify-center rounded-full",
                className,
                "shadow-[0px_0px_20px_0px_rgb(239_68_68/100%)] dark:shadow-[0px_0px_20px_0px_rgb(239_68_68/40%)]",
                progress > 50 &&
                  "shadow-[0px_0px_20px_0px_rgb(234_179_8/100%)] dark:shadow-[0px_0px_20px_0px_rgb(234_179_8/40%)]",
                progress > 70 &&
                  "shadow-[0px_0px_20px_0px_rgb(34_197_94/100%)] dark:shadow-[0px_0px_20px_0px_rgb(34_197_94/40%)]",
              )}
              {...props}
            >
              <svg
                className="-rotate-90 transform"
                style={{
                  width: size * 2 + strokeWidth * 2,
                  height: size * 2 + strokeWidth * 2,
                }}
              >
                <circle
                  cx={size + strokeWidth}
                  cy={size + strokeWidth}
                  r={size}
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  className="text-muted-foreground/25"
                />

                <circle
                  cx={size + strokeWidth}
                  cy={size + strokeWidth}
                  r={size}
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={
                    circumference - (progress / 100) * circumference
                  }
                  className={cn(
                    "text-red-500",
                    progress > 50 && "text-yellow-500",
                    progress > 70 && "text-green-500",
                  )}
                />
              </svg>
              <span className="absolute" style={{ fontSize }}>
                {progress}
                <span
                  className="inline-block"
                  style={{
                    fontSize: fontSize * 0.5,
                    transform: `translateY(-${fontSize * 0.4}px)`,
                  }}
                >
                  %
                </span>
              </span>
            </div>
          </TooltipTrigger>

          <TooltipContent
            align="center"
            side="top"
            sideOffset={4}
            className="p-2"
          >
            <div className="px-1 py-0.5 text-center">
              <p className="text-sm font-bold">Rating {progress}%</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);
Rating.displayName = "Rating";

export { Rating };
