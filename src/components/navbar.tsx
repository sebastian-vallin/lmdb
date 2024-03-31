"use client";

import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { NavLink } from "./navlink";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="bg-primary">
      <div className="container flex h-14 w-full items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="lg:hidden" size="icon" variant="outline">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className="ps-1 text-start">LMDB</SheetTitle>
            </SheetHeader>
            <div className="grid gap-2 py-6">
              <NavLink
                href="/"
                matching="exact"
                className={({ isActive, isPending }) =>
                  cn(
                    buttonVariants({
                      size: "lg",
                      variant: isPending ? "secondary" : "ghost",
                    }),
                    "justify-start ps-2 text-base text-foreground/60",
                    isActive && "text-foreground",
                    isPending && "animate-pulse",
                  )
                }
              >
                Home
              </NavLink>
              <NavLink
                href="/movies"
                className={({ isActive, isPending }) =>
                  cn(
                    buttonVariants({
                      size: "lg",
                      variant: isPending ? "secondary" : "ghost",
                    }),
                    "justify-start ps-2 text-base text-foreground/60",
                    isActive && "text-foreground",
                    isPending && "animate-pulse",
                  )
                }
              >
                Popular
              </NavLink>
            </div>
          </SheetContent>
        </Sheet>

        <Link
          href="/"
          className="mr-4 hidden text-lg font-bold text-primary-foreground lg:flex"
        >
          LMDB
        </Link>
        <nav className="hidden items-center gap-2 lg:flex">
          <NavLink
            href="/"
            matching="exact"
            className={({ isActive, isPending }) =>
              cn(
                buttonVariants({
                  size: "lg",
                  variant: isPending ? "secondary" : "ghost",
                }),
                "text-base text-primary-foreground/60",
                isActive && "text-primary-foreground",
                isPending && "animate-pulse",
              )
            }
          >
            Home
          </NavLink>
          <NavLink
            href="/movies"
            matching="exact"
            className={({ isActive, isPending }) =>
              cn(
                buttonVariants({
                  size: "lg",
                  variant: isPending ? "secondary" : "ghost",
                }),
                "text-base text-primary-foreground/60",
                isActive && "text-primary-foreground",
                isPending && "animate-pulse",
              )
            }
          >
            Popular
          </NavLink>
          <NavLink
            href="/movies/trending"
            matching="exact"
            className={({ isActive, isPending }) =>
              cn(
                buttonVariants({
                  size: "lg",
                  variant: isPending ? "secondary" : "ghost",
                }),
                "text-base text-primary-foreground/60",
                isActive && "text-primary-foreground",
                isPending && "animate-pulse",
              )
            }
          >
            Trending
          </NavLink>
        </nav>
        <nav className="ms-auto flex items-center gap-2">
          <Button
            className="justify-start px-2.5 font-semibold sm:pe-10"
            variant="outline"
            asChild
          >
            <Link href="/search">
              <Search className="me-0 h-5 w-5 sm:me-2" />
              <span className="sr-only sm:not-sr-only">
                Search movie, tv show, person
              </span>
            </Link>
          </Button>

          {/* <ThemeSelect /> */}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
