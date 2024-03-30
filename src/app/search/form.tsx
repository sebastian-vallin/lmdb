"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FC } from "react";

export interface SearchFormProps {
  defaultQuery?: string;
}

const SearchForm: FC<SearchFormProps> = ({ defaultQuery }) => {
  const router = useRouter();

  return (
    <div>
      <form
        className="flex gap-2"
        method="get"
        onSubmit={(ev) => {
          ev.preventDefault();
          const form = ev.currentTarget;
          const data = new FormData(form);
          const q = data.get("q") as string;
          router.push(`/search?q=${q}`);
        }}
      >
        <Input
          autoFocus
          defaultValue={defaultQuery}
          name="q"
          placeholder="Search"
        />
        <Button type="submit">Search</Button>
      </form>
    </div>
  );
};

export default SearchForm;
