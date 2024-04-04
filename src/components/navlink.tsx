"use client";

import React, { useMemo } from "react";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

export interface NavLinkProps
  extends LinkProps,
    Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      keyof LinkProps | "className"
    > {
  className?:
    | string
    | ((props: {
        isActive: boolean;
        isPending: boolean;
      }) => string | undefined);
  matching?: "exact" | "partial";
}

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ matching = "partial", className, href, ...props }, ref) => {
    const pathname = usePathname();

    const isActive = useMemo(() => {
      if (matching === "exact") {
        return pathname === href;
      }

      return pathname.startsWith(href as string);
    }, [pathname, matching, href]);

    return (
      <Link
        ref={ref}
        className={
          typeof className === "function"
            ? className({ isActive, isPending: false })
            : className
        }
        href={href}
        {...(isActive ? { "data-active": true } : {})}
        {...props}
      />
    );
  },
);
NavLink.displayName = "NavLink";

export { NavLink };
