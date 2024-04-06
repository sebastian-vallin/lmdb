import { Link } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";
import { PropsWithChildren } from "react";
import tmdb from "@/lib/tmdb-logo-long-alt.svg";

interface Props {}

const Page: NextPage<Props> = () => {
  return (
    <main className="container mt-8">
      <article className="prose mx-auto dark:prose-invert prose-a:text-primary">
        <HeadingLink level="h1" id="lmdb">
          About LMDB
        </HeadingLink>
        <p>
          LMDB is a movie and TV show database that allows you to search for
          movies and TV shows, view details, and show cast and crew information.
        </p>
        <p>
          This project was created as a learning experience and is not intended
          for commercial use.
        </p>

        <HeadingLink level="h2" id="tmdb">
          <Image
            className="mr-4 inline"
            src={tmdb}
            alt="The Movie DB"
            width={250}
            height={21}
            priority
          />
        </HeadingLink>
        <p>
          <a
            href="https://themoviedb.org"
            target="_blank"
            rel="noreferrer noopener"
          >
            The Movie Database (TMDB)
          </a>{" "}
          is a popular, user editable database for movies and TV shows.
        </p>
        <p>
          <strong>
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </strong>
        </p>
      </article>
    </main>
  );
};

interface HeadingLinkProps extends PropsWithChildren {
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  id: string;
}

const iconSize = {
  h1: "w-7 h-7",
  h2: "w-6 h-6",
  h3: "w-5 h-5",
  h4: "w-4 h-4",
  h5: "w-4 h-4",
  h6: "w-4 h-4",
};

const HeadingLink: React.FC<HeadingLinkProps> = ({ level, id, children }) => {
  const Comp = level;

  return (
    <Comp id={id}>
      <a href={`#${id}`} className="not-prose group hover:underline">
        {children}
        <Link
          className={`ml-2 hidden group-hover:inline ${iconSize[level]}`}
          strokeWidth={3}
        />
      </a>
    </Comp>
  );
};

export default Page;
