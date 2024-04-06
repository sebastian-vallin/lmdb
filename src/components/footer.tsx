import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import tmdbImage from "@/lib/tmdb-logo.svg";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const Footer = () => {
  return (
    <footer className="pt-4">
      <div className="bg-primary/5 py-2">
        <nav className="container">
          <ul className="flex items-center justify-center">
            <li>
              <Button asChild variant="link">
                <Link href="/">Home</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="link">
                <Link href="/about">About</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex flex-col items-center justify-center gap-1 bg-primary/10 py-3 text-sm sm:flex-row sm:gap-2 ">
        <div className="text-center font-medium">
          Copyright &copy; {new Date().getFullYear()} LMDB
        </div>
        <div className="flex gap-1">
          Powered by{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link href="/about#tmdb">
                  <Image src={tmdbImage} alt="TMDB" width={50} height={21} />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <Button asChild variant="link" className="font-semibold">
                  <Link href="/about#tmdb">The Movie Database (TMDB)</Link>
                </Button>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
