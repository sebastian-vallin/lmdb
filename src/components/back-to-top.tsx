"use client";

import React from "react";
import { Button } from "./ui/button";
import { Slot } from "@radix-ui/react-slot";
import * as PortalPrimitive from "@radix-ui/react-portal";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";

const BackToTopPortal = PortalPrimitive.Root;

export interface BackToTopProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  placement?: "left" | "right";
}

const BackToTop = React.forwardRef<HTMLDivElement, BackToTopProps>(
  ({ placement, className, asChild, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    React.useEffect(() => {
      setVisible(true);
    }, []);

    const Comp = asChild ? Slot : "div";
    return (
      visible && (
        <BackToTopPortal>
          <Comp
            className={cn(
              "fixed bottom-4 z-50",
              placement === "left" ? "left-4" : "right-4",
              className,
            )}
            ref={ref}
            {...props}
          />
        </BackToTopPortal>
      )
    );
  },
);
BackToTop.displayName = "BackToTop";

const BackToTopButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, children, onClick, size = "icon", asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : Button;
  const [visible, setVisible] = React.useState(false);

  const handleOnClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(ev);
    if (ev.defaultPrevented) return;

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref]);

  return (
    <Comp
      className={cn(
        "scale-100 opacity-100 transition-all animate-in aria-hidden:pointer-events-none aria-hidden:scale-90 aria-hidden:opacity-0",
        className,
      )}
      size={size}
      ref={ref}
      onClick={handleOnClick}
      aria-hidden={!visible}
      {...props}
    >
      <ChevronUp className="h-6 w-6" />
      {children}
    </Comp>
  );
});
BackToTopButton.displayName = "BackToTopButton";

export { BackToTop, BackToTopButton };
