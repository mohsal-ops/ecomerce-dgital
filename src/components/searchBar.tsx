"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { Button } from "./ui/button";
import db from "@/db/db";

export function SearchBar() {
  const [searchterm, setsearchterm] = useState<string >();
  const router = useRouter();
    const handlesearch = (event: React.FormEvent) => {
        event.preventDefault()
        const finalsearchterm = searchterm?.replace(/ /g, "").replace(/ [^\w-]+/g, "");
        if (typeof searchterm !== "string" ) {
            return
        }
    router.push(`/search/${finalsearchterm}`);
  };
  return (
    <div className="flex w-full">
      <div className="flex pl-1 w-full justify-start items-center bg-white border rounded-xl outline-none focus-within:shadow-sm">
        <IoMdSearch fontSize={21} className="ml-1" />
        <form onSubmit={handlesearch}>
          <input
            value={searchterm}
            type="text"
            onChange={(e) => {
              setsearchterm(e.target.value);
            }}
            placeholder="Search"
            className="p-2 outline-none rounded-3xl "
          />
        </form>
      </div>
    </div>
  );
}
